import React, {Component} from 'react';
import {connect} from 'dva';
import Styles from '../SelectTestPage/index.less';
import styles from './index.less';
import {Link} from 'dva/router';
import screenfull from 'screenfull';
import {Button} from 'antd-mobile';

class LeaveWaitPage extends Component {
  componentWillMount() {
    this.props.dispatch({type:'tcTestState/getTestPapers'})
  }
  componentDidMount(){
    this.interval=setInterval(this.time,1000);
  }
  componentDidUpdate(){
    const {leaveWaitSecond,}=this.props.tcTestState;
    if (leaveWaitSecond==0){
      clearInterval(this.interval);
      //this.props.dispatch({type:'tcTestState/updateState',payload:{leaveVisible:true}})
      this.props.dispatch({type:'tcTestState/increLeaveCnt',payload:{}})
    }
  }
  time=()=>{
    const {leaveWaitSecond}=this.props.tcTestState;
    this.props.dispatch({type:'tcTestState/updateState',payload:{leaveWaitSecond:leaveWaitSecond-1}})
  }
  componentWillUnmount(){
    clearInterval(this.interval);
    this.props.dispatch({type:'tcTestState/updateState',payload:{leaveWaitSecond:5}})
  }

  onUpdateState=(params)=>{
    this.props.dispatch({type:'tcTestState/updateState',payload:params})
  }
  contion=()=> {
    screenfull.request();
    clearInterval(this.interval);
    this.props.dispatch({type: 'tcTestState/increLeaveCnt', payload: {type:'/testing'}});
  }
  render() {
    const {dispatch}=this.props;
    //继续考试

    const {leaveVisible,leaveWaitSecond,oldMaxLeaveCnt,leaveCnt}=this.props.tcTestState;
    return (
      <div className={Styles.page} style={{height:'100%',padding:0,position:'relative',overflow:'hidden'}}>
        {!leaveVisible?<div style={{width:'80%',margin:'30px auto',textAlign:'center'}} >
          <img src={require('../assets/leave.png')} alt=""/>
          <h5 style={{fontSize:20,margin:25}}>请您赶快进入考试，否则将被记录离开考试一次。</h5>
          <div className={Styles.leavewaitMiao}>
            <span style={{fontSize: 30,fontWeight:' bold'}}>{leaveWaitSecond}</span>
          </div>
        </div>:<div style={{textAlign:'center',marginTop:'41%'}}>
          <img src={require('../assets/leaveMess.png')} alt="" style={{width:'100%'}}/>
          <p style={{position:'absolute',top: '35%',left: '29%',fontSize: 22}}>您已经离开考试<i style={{color:'#F39800',fontSize:37,fontWeight:'bold',}}> {leaveCnt||0} </i>次</p>
        </div>}
        <Button size='large' style={{width:178,margin:'15% auto 0 auto'}} type="primary" onClick={this.contion}>知道了，继续答题</Button>
        {leaveVisible?<p  style={{marginTop:15,textAlign:'center',width:'100%',color:'red'}}>离开考试次{oldMaxLeaveCnt}，将被判定为作弊，并强制收卷</p>:''}
      </div>
    );
  }
}
export default connect(({tcTestState}) => ({tcTestState}))(LeaveWaitPage);


