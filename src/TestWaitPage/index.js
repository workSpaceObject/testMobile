import React, {Component} from 'react';
import {connect} from 'dva';
import publicstyle from '../common/index.less';
import styles from './index.less';
import {urlpre} from '../utils/Constants';
import {Link} from 'dva/router';
import {getPropertyValue,timeForamt} from '../common/ObjUtils';
import { Flex,Button,List} from 'antd-mobile';


class TestWaitPage extends Component {
  componentWillMount() {
    this.props.dispatch({type:'tcTestState/getTestPapers',payload:{}})
  }
  componentDidMount(){
    this.interval=setInterval(this.time,1000);
  }
  componentDidUpdate(){
    const {dispatch}=this.props;
    const {waitSeconds}=this.props.tcTestState;
    if (waitSeconds==0){
      dispatch({type:'tcTestState/enterTest'})
    }
  }
  componentWillUnmount(){
    clearInterval(this.interval);
    this.props.dispatch({type:'tcTestState/updateState',payload:{waitSeconds:1000}})
  }

  time=()=>{
    const {waitSeconds}=this.props.tcTestState;
    this.props.dispatch({type:'tcTestState/updateState',payload:{waitSeconds:waitSeconds-1}})
  }
  render() {
    const {loading,dispatch}=this.props;
    const {examinee,test,waitSeconds,paperSects}=this.props.tcTestState;

    const items=paperSects&&paperSects.map(papersect=>{
      return  <p style={{color:'#505050',lineHeight:'0.6rem',marginTop:'0.2rem',}}>{papersect.title}</p>
    })

    return (
      <div style={{backgroundColor:'#fff',}}>
        <div className={styles.waitpage}>
          <Flex>
            <Flex.Item align="center" style={{marginLeft:'2rem',color:'#fff',lineHeight:'0.8rem'}}>考试未开始，请等待...</Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item align="center" style={{marginTop:'0.2rem',textAlign:'center',padding:12}}>
              {items}
              <p style={{color:'#505050',lineHeight:'0.6rem',textAlign:'right',bottom:'0.2rem',right:'0.7rem'}}>{waitSeconds>0?<span>距离考试时间：<span style={{color:'#ef6000'}}>{timeForamt(waitSeconds)}</span></span>:'进入考试，请稍后...'}</p>
            </Flex.Item>
          </Flex>
        </div>
        <div style={{backgroundColor:'#E4F0FE'}}>
          <article style={{lineHeight:'25px',fontSize:'12px',padding:'10px 0px 20px 17px'}}>
            1、景点试题抽取一次有效，考生不得要求更换；<br/>
            2、考生可备考5分钟，期间不得离开备考室；<br/>
            3、景点讲解和随机问答中文类在15分钟以内，外语类在25分钟以内；<br/>
            4、外语类考生须用所报考的语言全程进行面试，并对“口译”题进行翻译；<br/>
            5、考试期间不得要求考官作任何提示；<br/>
            6、考生自我介绍时不得以任何方式向考官明示或暗示自己的真实姓名及单位，须采用规定的格式介绍自己。
          </article>
        </div>
      </div>
    );
  }
}
export default connect(({tcTestState,loading}) => ({tcTestState,loading:loading.global}))(TestWaitPage);
