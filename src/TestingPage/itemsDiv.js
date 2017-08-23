import React, {PropTypes} from 'react';
import {Radio,Checkbox,Input,Icon} from 'antd';
import styles from './index.less';
import {timeForamt} from '../common/ObjUtils';

const RadioGroup = Radio.Group;
import {getPropertyValue} from '../common/ObjUtils';

function ItemsDiv({paperSects,ansResults,testItems,countDown,ansDoubts={},onSaveAns,onSaveAnsDoubt,getTestNum,}){

//试题
let items=new Array();
for (let [index, item] of [...(testItems||[])].entries()) {
  let type,itemSel,defaultValue,isDoubt;
  //已答题答案;
  defaultValue=ansResults[index]
  //疑问标记
  isDoubt=ansDoubts.indexOf(index)<0?false:true;
  //保存多选题型答案（将数组答案转换成字符串）
  function checkBoxSave(data) {
    let content='';
    const newData=[...(data||[])].sort();
    for (let i=0;i<newData.length;i++){
      content+=newData[i];
    }
    return content;
  }
  //试题信息
  let selCode=["A","B","C","D","E","F","G","H","L"];
  if(getPropertyValue(item,'itemType.code')=='0201'){
    let selIndex=-1;
    const radios=[...(item.itemSels||[])].map(sel=>{
      selIndex++;
      return <Radio value={sel.selCode} size="large" style={{display: 'block',fontSize:14,fontFamily:'宋体',margin:'20px 20px 20px 30px',position:'relative',}}><span style={{position:'absolute',left:-20,top:-4,fontSize:17,fontWeight:'bold'}}>{selCode[selIndex]}：</span>{getPropertyValue(sel,'selText.isRichText')?<div dangerouslySetInnerHTML={{__html:getPropertyValue(sel,'selText.content')}}></div>:getPropertyValue(sel,'selText.content')}</Radio>
    })

    itemSel=(<RadioGroup onChange={(data)=>onSaveAns({itemIndex:index,studentAns:data.target.value})} defaultValue={defaultValue}>{radios}</RadioGroup>)
  }else if(getPropertyValue(item,'itemType.code')=='0301'){
    let selIndex=-1;
    const options=[...(item.itemSels||[])].map(sel=>{
      selIndex++;
      return <Checkbox value={sel.selCode} size="large" style={{display: 'block',fontSize:14,fontFamily:'宋体',margin:'20px 20px 20px 30px',position:'relative',}}><span style={{position:'absolute',left:-20,top:-4,fontSize:17,fontWeight:'bold'}}>{selCode[selIndex]}：</span>{getPropertyValue(sel,'selText.isRichText')?<div dangerouslySetInnerHTML={{__html:getPropertyValue(sel,'selText.content')}}></div>:getPropertyValue(sel,'selText.content')}</Checkbox>
    })

    itemSel=(<Checkbox.Group defaultValue={defaultValue} onChange={(data)=>onSaveAns({itemIndex:index,studentAns:checkBoxSave(data)})}>{options}</Checkbox.Group>)
  }else if(getPropertyValue(item,'itemType.code')=='0101'){
    itemSel=(
      <RadioGroup style={{display: 'block',fontSize:14,fontFamily:'宋体',margin:10}} onChange={(data)=>onSaveAns({itemIndex:index,studentAns:data.target.value})} defaultValue={defaultValue}>
        <Radio value="A">正确</Radio>
        <Radio value="B">错误</Radio>
      </RadioGroup>
    )
  }else if(String(getPropertyValue(item,'itemType.code')).substring(0,2)=='si'){
    itemSel=(<Input style={{display: 'block',fontSize:14,fontFamily:'宋体',margin:10}} defaultValue={defaultValue} onBlur={(data)=>onSaveAns({itemIndex:index,studentAns:data.target.value})} type="textarea" placeholder="请输入答案" autosize={{ minRows: 2, maxRows: 6 }} />)
  }
  items.push(<div style={{borderBottom:'1px solid #DBDBDB',marginLeft:'40px',marginBottom:'20px'}}>
    <div style={{padding:'6px 6px 6px 25px',position:'relative'}} id={String(index)}><Icon type="question-circle" style={{color:isDoubt?'#F99727':'#e1e1e1',cursor:'pointer',fontSize:19,position:'absolute',left:0}} onClick={()=>onSaveAnsDoubt({itemIndex:index,isDoubt:isDoubt?0:1})} /><span style={{float:'left',fontFamily:'微软雅黑',fontWeight:'bold'}}>{index+1}、</span>{getPropertyValue(item,'mainText.isRichText')?<div dangerouslySetInnerHTML={{__html:getPropertyValue(item,'mainText.content')}}></div>:getPropertyValue(item,'mainText.content')}【{getPropertyValue(item,'itemType.name')}】</div>
    <div style={{marginLeft:'40px'}}>
      {itemSel}
    </div>
  </div>)
}
  let itemsIndex=-1;
  let lastItemCnt=0;
  const itemDIv=paperSects&&paperSects.map(sect=>{
      itemsIndex++;
      itemsIndex?lastItemCnt+=paperSects[itemsIndex-1].itemCnt:lastItemCnt=0;
      return (
        <div style={{paddingLeft:'20px'}}>
          <p style={{margin:'24px 0',fontSize:16,color:'#000',fontFamily:'微软雅黑'}}>{sect.title}</p>
          {itemsIndex?getTestNum(lastItemCnt,lastItemCnt+sect.itemCnt,items):getTestNum(0,sect.itemCnt,items)}
        </div>
      )
    })
  return (
    <div>
      {
        itemDIv
      }
    </div>
  )
}
export default ItemsDiv;
