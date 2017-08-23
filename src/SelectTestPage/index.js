import React, {Component} from 'react';
import { Flex,Button,List} from 'antd-mobile';
import {connect} from 'dva';
import publicstyle from '../common/index.less';
import Styles from './index.less';
import screenfull from 'screenfull';
import ReactDOM from 'react-dom';

class SelectTestPage extends Component {
  componentWillMount() {
    this.onSelectTest({});
  }
  componentDidMount(){
     //为login添加监听事件（‘click’），点击后网页全屏
    let intoPaper=ReactDOM.findDOMNode(this.refs.intoPaper);
    intoPaper.addEventListener('click',() => {
      if (screenfull.enabled) {
        screenfull.request();
      } else {
        // Ignore or do something else
      }
    });
  }

  onSelectTest=(examineeUid)=>{
    this.props.dispatch({type:'tcTestState/getTestInfo',payload:examineeUid})
  }

render() {
    const {testInfos,examinees}=this.props.tcTestState;
let index=0;
    const divCon=examinees&&examinees.map(data=>{
        index++;
      return (
        <div key={data.uid} ref="intoPaper" className={Styles.testlistDiv} onClick={()=>this.onSelectTest({examineeUid:data.uid})}>
          <Flex style={{width:'100%',backgroundColor:'#F3F3F3',height:'0.9rem',lineHeight:'0.9rem'}}>
            <Flex.Item style={{flex:4}}>　{data.title}</Flex.Item>
            <Flex.Item ><img src={require('../assets/selectgo.png')} style={{width:'0.2rem',marginLeft:'0.8rem'}}/></Flex.Item>
          </Flex>

          <Flex  className={Styles.testTitle}>
            <Flex.Item style={{position:'relative'}}><img src={require('../assets/selecttime.png')} style={{width:'0.7rem',marginLeft:'0.3rem',position:'relative'}}/><span style={{color:'#EF6000',position:'absolute',top:'0.2rem',left:'0.55rem',fontSize:'0.35rem'}}>{index}</span></Flex.Item>
            <Flex.Item style={{flex:4}}>
              <p style={{lineHeight:'0.8rem',paddingTop:'0.2rem'}}>开始时间：{data.testFrom}</p>
              <p style={{lineHeight:'0.8rem'}}>结束时间：{data.testTo}</p>
              <p style={{color:'#FEB547',textAlign:'right',marginRight:'0.5rem',lineHeight:'0.6rem',borderTop:'1px dashed #e0e0e0'}}>{data.isImediateTest!=null?data.isImediateTest?'即到即考':'集体考试':''}</p>
            </Flex.Item>
          </Flex>
        </div>
      )
    })

    return (
        <div style={{backgroundColor:'#FFFFFF'}}>
          {/*<span style={{color:'#333',fontSize:'22px',display:'block',textAlign:'center',height: 145,lineHeight:'110px'}}>您当前有<span style={{color:'#F39801',fontSize:'45px'}}>{examinees.length}</span>场考试可以进行，请选择要进行的考试</span>*/}
            {divCon}
        </div>
    );
  }
}
export default connect(({tcTestState}) => ({tcTestState}))(SelectTestPage);


