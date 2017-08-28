import React, {Component} from 'react';
import { Flex,Button,List} from 'antd-mobile';
import {connect} from 'dva';
import {urlpre} from '../utils/Constants';
import {Link} from 'dva/router';
import {getPropertyValue,timeForamt} from '../common/ObjUtils';
import Styles from './index.less';

class ExaminePage extends Component {
  componentWillMount() {
    this.onSelectTest({});
  }
  componentDidMount(){
  }
  componentWillUnmount(){
    this.props.dispatch({type:'tcTestState/updateState',payload:{waitSeconds:1000}})
  }
  onSelectTest=(params)=>{
    this.props.dispatch({type:'tcTestState/getTestInfo',payload:params})
  }
render() {
  const {loading,dispatch}=this.props;
  const {examinee,test,waitSeconds}=this.props.tcTestState;
    return (
      <div className={Styles.container}>
        <div className={Styles.bannerv}>
          <img src={require('../assets/head.png')} />
          <span>{examinee.name}</span>
        </div>
        <div className={Styles.testtit}>
          <div className={Styles.title}>
            <img src={require("../assets/testtit.png")} />
            <span>{test.title}</span>
          </div>
          <div className={Styles.testtype}>
            <span>{test.isImediateTest?'即到即考':'集体考试'}</span>
          </div>
        </div>

        <div className={Styles.nameid} >
          <div className={Styles.title}>
            <img src="../../images/peoid.png" />
            <span style={{color:'#333'}}>考生标识</span>
          </div>
          <div className={Styles.peoinfo}>
            <span>{examinee.identifier}</span>
          </div>
        </div>

        <div className={Styles.nameid} style={{margin:0,borderBottom:0}}>
          <div className={Styles.title}>
            <img src={require("../assets/starttime.png")} />
            <span style={{color:'#333'}}>开始时间</span>
          </div>
          <div className={Styles.peoinfo}>
            <span>{test.testFrom}</span>
          </div>
        </div>

        <div className={Styles.nameid} style={{margin:0,borderBottom:0}}>
          <div className={Styles.title}>
            <img src={require("../assets/endtime.png")} />
            <span style={{color:'#333'}}>结束时间</span>
          </div>
          <div className={Styles.peoinfo}>
            <span>{test.testTo}</span>
          </div>
        </div>

        <div className={Styles.nameid} style={{margin:0}}>
          <div className="title">
            <img src={require("../assets/testtimes.png")} />
            <span style={{color:'#333'}}>考试时长</span>
          </div>
          <div className={Styles.peoinfo}>
            <span>{test.testMinutes}分钟</span>
          </div>
        </div>

        <Flex style={{backgroundColor:'#EBEBEB',paddingBottom:'0.2rem'}}>
          <Flex.Item align="center">
            <Link style={{marginTop:15,width: 165,backgroundColor:'#3593DB',padding:'0.2rem'}} className="aBtn" to="/testWait" size="large">信息无误，进入考试</Link>
            <Link style={{marginTop:15,width: 165,padding:'0.2rem'}} className="aBtnDenger" to="/" size="large">信息有误，返回登录</Link>
          </Flex.Item>
        </Flex>
      </div>


    );
  }
}
export default connect(({tcTestState,loading}) => ({tcTestState,loading:loading.global}))(ExaminePage);


