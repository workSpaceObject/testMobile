import React, {Component} from 'react';
import { Flex,Button,List} from 'antd-mobile';
import {connect} from 'dva';
import {urlpre} from '../utils/Constants';
import {Link} from 'dva/router';
import Styles from './index.less';
import Dimensions from 'react-dimensions'

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
          <img src={`${urlpre}/ts/getExamineeImg/${examinee.uid}/${examinee.imgVer}`} />
          <span style={{marginLeft:'75px'}}>{examinee.name}</span>
        </div>
        <div className={Styles.testtit}>
          <div className={Styles.title} style={{lineHeight:'1rem',}}>
            <i className="iconfont" style={{color:'#fff',fontSize:'0.88rem',marginLeft:9}}>&#xe601;</i>
            <span style={{marginLeft:'1.2rem'}}>{test.title}</span>
          </div>
          <div className={Styles.testtype}>
            <span>{test.isImediateTest?'即到即考':'集体考试'}</span>
          </div>
        </div>

        <div className={Styles.nameid} >
          <div className={Styles.title}>
            <i className="iconfont" style={{color:'#3593db',fontSize:'0.7rem',marginLeft:9}}>&#xe689;</i>
            <span style={{color:'#333'}}>考生标识</span>
          </div>
          <div className={Styles.peoinfo}>
            <span>{examinee.identifier}</span>
          </div>
        </div>

        <div className={Styles.nameid} style={{margin:0,borderBottom:0}}>
          <div className={Styles.title}>
            <i className="iconfont" style={{color:'#8FD085'}}>&#xe65e;</i>
            <span style={{color:'#333'}}>开始时间</span>
          </div>
          <div className={Styles.peoinfo}>
            <span>{test.testFrom}</span>
          </div>
        </div>

        <div className={Styles.nameid} style={{margin:0,borderBottom:0}}>
          <div className={Styles.title}>
            <i className="iconfont" style={{color:'#F7B186'}}>&#xe65d;</i>
            <span style={{color:'#333'}}>结束时间</span>
          </div>
          <div className={Styles.peoinfo}>
            <span>{test.testTo}</span>
          </div>
        </div>

        <div className={Styles.nameid} style={{margin:0}}>
          <div className={Styles.title}>
            <i className="iconfont" style={{color:'#62D3E3'}}>&#xe615;</i>
            <span style={{color:'#333'}}>考试时长</span>
          </div>
          <div className={Styles.peoinfo}>
            <span>{test.testMinutes}分钟</span>
          </div>
        </div>

        <Flex style={{width:'100%',marginTop:this.props.containerHeight-609<0?0:this.props.containerHeight-609,paddingBottom:'0.2rem'}} >
          <Flex.Item align="center" >
            <Link style={{marginTop:15,width: 165,backgroundColor:'#3593DB',padding:'0.2rem'}} className="aBtn" to="/testWait" size="large">信息无误，进入考试</Link>
            <Link style={{marginTop:15,width: 165,padding:'0.2rem'}} className="aBtnDenger" to="/" size="large">信息有误，返回登录</Link>
          </Flex.Item>
        </Flex>
      </div>


    );
  }
}
export default connect(({tcTestState,loading}) => ({tcTestState,loading:loading.global}))(Dimensions()(ExaminePage));


