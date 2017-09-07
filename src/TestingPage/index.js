import React, {Component} from 'react';
import { Flex,Button,List,TabBar,Icon,Modal,Checkbox,InputItem,Popup} from 'antd-mobile';
import {connect} from 'dva';
import styles from './index.less';
import {timeForamt,getPropertyValue} from '../common/ObjUtils';
import {urlpre} from '../utils/Constants';
import screenfull from 'screenfull';
import HandModal from './handmodal';
import Dimensions from 'react-dimensions'

const CheckboxItem=Checkbox.CheckboxItem;
const alert=Modal.alert;

class TestingPage extends Component {
  componentWillMount() {
    this.onGetPapers();
  }
  componentDidMount(){
    //考试倒计时
    this.interval=setInterval(this.time,1000);

    window.addEventListener('onblur',(e)=>this.winonBulr(e))
  }
  componentDidUpdate(){
    const {countDown,}=this.props.tcTestState;
    if (countDown==0){
      clearInterval(this.interval);
      //执行交卷之前 先把countDown 设为 负数，防止执行多次交卷行为
      this.onUpdateState({countDown:-1})
      this.onDeployPaper();
    }else if(countDown==60){
      this.onGetLeaveSeconds();
    }
  }
  componentWillUnmount(){
    clearInterval(this.interval);
    this.props.dispatch({type:'tcTestState/updateState',payload:{countDown:9999}})
    window.removeEventListener('onblur',this.winonBulr);
  }
  time=()=>{
    const {countDown}=this.props.tcTestState;
    this.props.dispatch({type:'tcTestState/countDown',payload:countDown-1})
  }
  winonBulr=(e)=>{
    e = e || window.event;
    if (window.ActiveXObject && /MSIE/.test(navigator.userAgent)) {  //IE
      //如果 blur 事件是窗口内部的点击所产生，返回 false, 也就是说这是一个假的 blur
      var x = e.clientX;
      var y = e.clientY;
      var w = document.body.clientWidth;
      var h = document.body.clientHeight;

      if (x >= 0 && x <= w && y >= 0 && y <= h) {
        window.focus();
        return false;
      }
    }else {
      screenfull.exit();
      this.props.dispatch({type:'tcTestState/increLeaveCnt',payload:{type:'/leaveWait'}})
    }
  }
  onUpdateState = (params)=> {
    this.props.dispatch({type: 'tcTestState/updateState', payload: params});
  }
  onGetPapers=()=>{
    this.props.dispatch({type:'tcTestState/getTestPapers'})
  }

  onSaveAns=(params)=>{
    //console.log(params);
    this.props.dispatch({type:'tcTestState/saveStudentAns',payload:params})
  }
  onSaveAnses=()=>{
    this.props.dispatch({type:'tcTestState/saveStudentAnses'})
  }
  onSaveAnsDoubt=(params)=>{
    this.props.dispatch({type:'tcTestState/saveStudentAnsDoubt',payload:params})
  }
  onSaveStudentAnsDoubts=()=>{
    this.props.dispatch({type:'tcTestState/saveStudentAnsDoubts'})
  }
  onDeployPaper=()=>{
    clearInterval(this.interval);
    this.props.dispatch({type:'tcTestState/deployPaper'})
  }
  onGetLeaveSeconds=(examinUid)=>{
    this.props.dispatch({type:'tcTestState/getLeaveSeconds',payload:examinUid})
  }
  setitemsIndex=(params)=>{
    this.props.dispatch({type:'tcTestState/setitemsIndex',payload:params})
  }

  render(){
    const {form,dispatch}=this.props;
    const {handVisible,leaveVisible,ansResults,ansDoubts,examinee,oldCountDown,test,testItems,countDown,leaveCnt,paperSects,againVisible,answSheetVisible,itemsIndex}=this.props.tcTestState;

    //每3分钟上传一次  未上传成功的答案
    if((oldCountDown-countDown)&&((oldCountDown-countDown)%180)==0){
      this.onSaveAnses();
      this.onSaveStudentAnsDoubts();
    }

    if(!screenfull.isFullscreen) {
      dispatch({type:'tcTestState/increLeaveCnt',payload:{type:'/leaveWait'}})
    }

  //试题导航
    const anchor=new Array();
    for(let index in testItems){
      let defaultValue=ansResults[index],isDoubt,Style={};
      isDoubt=ansDoubts.indexOf(parseInt(index))<0?false:true;
      if(isDoubt){
        Style={background:'#F99727',color:'#fff'};
      }else if(defaultValue){
        Style={background:'#4FBEF9',color:'#fff'};
      }
      anchor.push( <div className={styles.num} style={Style} onClick={()=>{this.setitemsIndex(parseInt(index));this.onUpdateState({answSheetVisible:false})}}>{parseInt(index)+1}</div>)
    }
    //为试题、题号添加整体说明
    function getTestNum(start,end,sourse) {
      const testNum=new Array();
      for (let index=start;index<end;index++){
        testNum.push(sourse[index])
      }
      return testNum
    }

    let sectIndex=-1;
    let lastSectCnt=0;
    //题型信息

    const testNum=paperSects&&paperSects.map(sect=>{
        sectIndex++;
        sectIndex?lastSectCnt+=paperSects[sectIndex-1].itemCnt:lastSectCnt=0;
        return (
          <div style={{backgroundColor:'#fff',overflowY:'auto'}}>
            <div style={{backgroundColor:'#eee',lineHeight:'0.6rem'}}>
              <p style={{textIndent:'0.2rem'}}>{sect.title}</p>
            </div>
            <div  style={{width:'5.2rem',margin:'0 auto',padding:24}}>
              {sectIndex?getTestNum(lastSectCnt,lastSectCnt+sect.itemCnt,anchor):getTestNum(0,sect.itemCnt,anchor)}
            </div>
        </div>
        )
      })

    let secTitle='';
    for(let paperSecIndex=0;paperSecIndex<[...(paperSects||[])].length;paperSecIndex++){
      paperSecIndex?lastSectCnt+=paperSects[paperSecIndex-1].itemCnt:lastSectCnt=0;
      if(itemsIndex<lastSectCnt+paperSects[paperSecIndex].itemCnt||itemsIndex==lastSectCnt+paperSects[paperSecIndex].itemCnt){
        secTitle=paperSects[paperSecIndex].title;
        break;
      }
    }


    let type, itemSel,defaultValue,isDoubt;
    //已答题答案;
    defaultValue=ansResults[itemsIndex]
    //疑问标记
    isDoubt=ansDoubts.indexOf(itemsIndex)<0?false:true;

    //保存多选题型答案（将数组答案转换成字符串）
    function checkBoxSave(data) {
      let arr=[];
      if(defaultValue){
        arr=String(defaultValue).split("");
        if(String(defaultValue).indexOf(data)<0){
          arr.push(data);
        }else {
          for(let [index,value] of [...String(defaultValue).split("")].entries()){
            if(value==data){
              delete arr[index];
            }
          }
        }
      }else {
        arr.push(data);
      }
      let content='';
      const newData=[...(arr||[])].sort();
      for (let i=0;i<newData.length;i++){
        if(newData[i]){
          content+=newData[i];
        }
      }
      //console.log(content);
      dispatch({type:'tcTestState/saveStudentAns',payload:{itemIndex:itemsIndex,studentAns:content}})
    }
    const item=testItems[itemsIndex];

    //试题信息
    let selCode=["A","B","C","D","E","F","G","H","L"];
    if(getPropertyValue(item,'itemType.code')=='0201'){
      let selIndex=-1;
      const radios=[...(item.itemSels||[])].map(sel=>{
        selIndex++;
        return (
          <div onClick={()=>this.onSaveAns({itemIndex:itemsIndex,studentAns:sel.selCode})} size="large" style={{display: 'block',fontSize:14,fontFamily:'宋体',padding:'20px 20px 20px 30px',position:'relative',borderBottom:'1px solid #CCCCCC'}}>
            <span className={sel.selCode==defaultValue?styles.selDefSpan:styles.selSpan}>{selCode[selIndex]}</span>、
            {getPropertyValue(sel,'selText.isRichText')?<div dangerouslySetInnerHTML={{__html:getPropertyValue(sel,'selText.content')}}></div>:getPropertyValue(sel,'selText.content')}
          </div>
        )
      })
      //onChange={(data)=>this.onSaveAns({itemIndex:index,studentAns:data.target.value})}
      itemSel=(<div>{radios}</div>)
    }else if(getPropertyValue(item,'itemType.code')=='0301'){
      let selIndex=-1;
      const options=[...(item.itemSels||[])].map(sel=>{
        selIndex++;
        return (
          <div onClick={()=>checkBoxSave(sel.selCode)} size="large" style={{display: 'block',fontSize:14,fontFamily:'宋体',padding:'20px 20px 20px 30px',position:'relative',borderBottom:'1px solid #CCCCCC'}}>
            <span style={{borderRadius:0}} className={String(defaultValue).indexOf(sel.selCode)<0?styles.selSpan:styles.selDefSpan}>{selCode[selIndex]}</span>、
            {getPropertyValue(sel,'selText.isRichText')?<div dangerouslySetInnerHTML={{__html:getPropertyValue(sel,'selText.content')}}></div>:getPropertyValue(sel,'selText.content')}
          </div>
        )
      })

      itemSel=(<div style={{borderBottom:'1px solid #CCCCCC'}}>{options}</div>)
    }else if(getPropertyValue(item,'itemType.code')=='0101'){
      itemSel=(
        <div style={{display: 'block',fontSize:14,fontFamily:'宋体',margin:10}} onChange={(data)=>this.onSaveAns({itemIndex:itemsIndex,studentAns:data.target.value})} defaultValue={defaultValue}>
          <div onClick={()=>this.onSaveAns({itemIndex:itemsIndex,studentAns:'A'})} size="large" style={{display: 'block',fontSize:14,fontFamily:'宋体',padding:'20px 20px 20px 30px',position:'relative',borderBottom:'1px solid #CCCCCC'}}>
            <span className={'A'==defaultValue?styles.selDefSpan:styles.selSpan}> </span>、正确
          </div>
          <div onClick={()=>this.onSaveAns({itemIndex:itemsIndex,studentAns:'B'})} size="large" style={{display: 'block',fontSize:14,fontFamily:'宋体',padding:'20px 20px 20px 30px',position:'relative',borderBottom:'1px solid #CCCCCC'}}>
            <span className={'B'==defaultValue?styles.selDefSpan:styles.selSpan}> </span>、错误
          </div>
        </div>
      )
    }else if(String(getPropertyValue(item,'itemType.code')).substring(0,2)=='si'){
      itemSel=(<InputItem style={{display: 'block',fontSize:14,fontFamily:'宋体',margin:10}} defaultValue={defaultValue} onBlur={(data)=>this.onSaveAns({itemIndex:itemsIndex,studentAns:data.target.value})} placeholder="请输入答案" autosize={{ minRows: 2, maxRows: 6 }} />)
    }

    const props={testItems,ansDoubts,ansResults,onDeployPaper:this.onDeployPaper,onUpdateState:this.onUpdateState}

    const onPopuClick = (e) => {
      e.preventDefault(); // 修复 Android 上点击穿透
      Popup.show(<div>
        <div style={{padding:20,lineHeight:'45px'}}>
          <img src={`${urlpre}/ts/getExamineeImg/${examinee.uid}/${examinee.imgVer}`}  alt=""  style={{width:'90px',height:'90px',borderRadius:'45px',float:'left'}}/>
          <div style={{marginLeft:'10px',float:'left'}}>
            <p style={{color:'#333333',fontSize:'16px'}}>{examinee.name}</p>
            {/*<p style={{color:'#666666',paddingTop:'10px'}}>{unit.title}</p>总分<span style={{color:'#FA9627',fontSize:'20px'}}>100</span>*/}
          </div>
          <div style={{clear:'both'}}></div>
        </div>
        {/*<div style={{height:'45px',lineHeight:'40px',backgroundColor:'#E4F0FE',textAlign:'center',color:'#7F8284'}}>{unit.title}</div>*/}
      </div>);
    };

    return(
      <div>
        {handVisible?
          <HandModal {...props}/>
            :<div style={{height:'100%',backgroundColor:'#EEEEEE'}}>
            <a onClick={()=>this.onUpdateState({handVisible:true})} style={{position:'absolute',right:15,top:15,color:'#fff'}}>交卷</a>
            <a onClick={onPopuClick} style={{position:'absolute',right:58,top:13,color:'#fff'}}><span style={{fontSize:20}} className="iconfont">&#xe636;</span></a>
            <div style={{borderBottom:'1px solid #ccc',lineHeight:'0.7rem'}}>
              <span style={{width:this.props.containerWidth-140,float:'left',marginLeft:10}}>{secTitle}</span>
              <span style={{width:'100px',float:'right',color:'#ef6000',fontSize:'0.4rem',marginRight:10}}>{timeForamt(countDown)}</span>
              <div style={{clear:'both'}}></div>
            </div>
            {/*试题*/}
            {!answSheetVisible?<div style={{marginBottom:'50px',marginTop:10,padding:'15px 0'}}>
              <div style={{padding:'6px 6px 6px 25px',position:'relative'}} id={String(itemsIndex)}><i className="iconfont" style={{color:isDoubt?'#F99727':'#e1e1e1',cursor:'pointer',fontSize:19,position:'absolute',left:3}} onClick={()=>this.onSaveAnsDoubt({itemIndex:itemsIndex,isDoubt:isDoubt?0:1})} >&#xe60e;</i><span style={{color:'#3792DB'}}>【{getPropertyValue(item,'itemType.name')}】</span><span style={{fontFamily:'微软雅黑',fontWeight:'bold'}}>{itemsIndex+1}.</span>{getPropertyValue(item,'mainText.isRichText')?<div style={{textIndent:30,}} dangerouslySetInnerHTML={{__html:getPropertyValue(item,'mainText.content')}}></div>: <span style={{lineHeight:'18px'}}>{getPropertyValue(item,'mainText.content')}</span>}</div>
              <div style={{background:'#fff',width:'95%',margin:'15 auto',border:'1px solid #ccc'}}>
                {itemSel}
              </div>
            </div>:null}
            {/*答题卡样式*/}
            {answSheetVisible?<div style={{marginBottom:50}}>
              <div style={{padding:10,backgroundColor:'#FFF391',lineHeight:'0.5rem'}}>
                <p>答题卡：红色代表<span style={{color:'#ef6000'}}>标记题</span>，蓝色代表<span style={{color:'#3593db'}}>已答题</span>，默认代表未答题</p>
              </div>
              {testNum}
            </div>:null}
            {/*底部按钮*/}

            <TabBar
              hidden={answSheetVisible}
              unselectedTintColor="#949494"
              tintColor="#33A3F4"
              barTintColor="white"
            >
              <TabBar.Item
                title="上一题"
                key="上一题"
                icon={<img style={{width:'0.5rem',height:'0.5rem'}} src={require('../assets/testup.png')}/>}
                onPress={(itemsIndex<0||itemsIndex==0)?null:()=>this.setitemsIndex(parseInt(itemsIndex)-1)}
              >
              </TabBar.Item>
              <TabBar.Item
                icon={<img style={{width:'0.5rem',height:'0.5rem'}} src={require('../assets/testnav.png')}/>}
                selectedIcon={<img style={{width:'0.5rem',height:'0.5rem'}} src={require('../assets/testnavb.png')}/>}
                title="答题卡"
                key="答题卡"
                onPress={() => this.onUpdateState({answSheetVisible:!answSheetVisible})}
              >
              </TabBar.Item>
              <TabBar.Item
                icon={<img style={{width:'0.5rem',height:'0.5rem'}} src={require('../assets/testdown.png')}/>}
                title="下一题"
                key="下一题"
                onPress={itemsIndex<[...(testItems||[])].length-1?()=>this.setitemsIndex(parseInt(itemsIndex)+1):null}
              >
              </TabBar.Item>
            </TabBar>
          </div>}
      </div>
    );
  }

}
export default connect(({tcTestState,})=>({tcTestState,})) (Dimensions()(TestingPage));


