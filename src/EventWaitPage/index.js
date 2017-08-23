import React, {Component} from 'react';
import {connect} from 'dva';
import Styles from '../SelectTestPage/index.less';

import {Link} from 'dva/router';
import { Flex,Button,List} from 'antd-mobile';

class EventWaitPage extends Component {
  componentWillMount() {
    this.getReply();
  }
  componentDidMount(){
    this.interval=setInterval(this.getReply,10000);
  }
  componentDidUpdate(){


  }
  componentWillUnmount(){
    clearInterval(this.interval);
  }
  getReply=()=>{
    this.props.dispatch({type:'tcTestState/getReplyedHelpEvent'})
  }
  onUpdateState=(params)=>{
    this.props.dispatch({type:'tcTestState/updateState',payload:params})
  }
  render() {
    return (
      <div>
        <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'center'}}>
          <Flex justify="center" align="center">
            <img style={{width:'2rem'}} src={require('../assets/waitingicon.png')} alt=""/>
          </Flex>
          <Flex justify="center">
            <div><p style={{color:'#A4A4A4',paddingTop:'0.2rem'}}>问题已提交,请等待处理...</p></div>
          </Flex>
        </div>
        {/*<div style={{width:220,float:' left'}}><div className={styles.waitSlidMove}></div></div>*/}
        {/*<div className={styles.waitPenPaper}>*/}
          {/*<img src={require('../assets/waitPaper.png')} />*/}
          {/*<img src={require('../assets/waitPen.png')} alt=""/>*/}
        {/*</div>*/}
        {/*<img className={styles.waittingRate} src={require('../assets/waiting.png')} />*/}
        <Link style={{position:'absolute',bottom:40,right:45}} to="/" className="aBtn">返回登录</Link>
      </div>
    );
  }
}
export default connect(({tcTestState}) => ({tcTestState}))(EventWaitPage);


