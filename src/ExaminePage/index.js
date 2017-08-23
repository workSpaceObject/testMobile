import React, {Component} from 'react';
import { Flex,Button,List} from 'antd-mobile';
import {connect} from 'dva';
import {urlpre} from '../utils/Constants';
import {Link} from 'dva/router';
import {getPropertyValue,timeForamt} from '../common/ObjUtils';

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
      <div style={{backgroundColor:'#EBEBEB',height:'100%'}}>
        <Flex style={{backgroundColor:'#ffffff',height:'1.5rem'}}>
          <Flex.Item align="center" style={{flex:3,marginLeft:'0.2rem',color:'#3593db',fontSize:25}}>考试在线 365</Flex.Item>
          <Flex.Item align="center" style={{color:'#3593db',fontSize:16}}>已登录</Flex.Item>
        </Flex>
        <div>
          <img src={require('../assets/minebanner.png')} style={{width:'100%'}}/>
        </div>
        <Flex style={{backgroundColor:'#ffffff',borderBottom:'1px solid #E7E7E7',height:'2rem'}}>
          <Flex.Item align="center" style={{flex:3}}><img src={require('../assets/minename.png')} style={{width:'1.2rem',marginLeft:'0.4rem'}}/></Flex.Item>
          <Flex.Item align="center" style={{flex:5}}>
            <p style={{color:'#999999',lineHeight:'0.5rem',paddingTop:'0.2rem'}}>姓名</p>
            <p style={{color:'#666666',fontSize:'0.35rem',lineHeight:'0.8rem'}}>{examinee.name}</p>
          </Flex.Item>
          <Flex.Item align="center" style={{flex:3}}>
            <img src={`${urlpre}/tc/getExamineeImg/${examinee.uid}/${examinee.imgVer}`}  style={{width:'1.6rem',marginLeft:'0.2rem',border:'1px solid #98C8ED'}}/>
          </Flex.Item>
        </Flex>
        <Flex style={{backgroundColor:'#ffffff',borderBottom:'1px solid #E7E7E7'}}>
          <Flex.Item align="center"><img src={require('../assets/mineid.png')} style={{width:'1.2rem',marginLeft:'0.4rem'}}/></Flex.Item>
          <Flex.Item align="center" style={{flex:3}}>
            <p style={{color:'#999999',lineHeight:'0.5rem',paddingTop:'0.4rem'}}>考生标识</p>
            <p style={{color:'#666666',fontSize:'0.35rem',lineHeight:'0.8rem'}}>{examinee.identifier}</p>
          </Flex.Item>
        </Flex>
        <Flex style={{backgroundColor:'#ffffff',borderBottom:'1px solid #E7E7E7'}}>
          <Flex.Item style={{height:'42%'}}><img src={require('../assets/minetest.png')} style={{width:'1.2rem',marginLeft:'0.4rem'}}/></Flex.Item>
          <Flex.Item align="center" style={{flex:3}}>
            <p style={{color:'#999999',lineHeight:'0.5rem',paddingTop:'0.4rem'}}>考试名称</p>
            <p style={{borderBottom:'1px solid #E7E7E7',paddingBottom:'0.2rem',color:'#666666',fontSize:'0.35rem',lineHeight:'0.8rem'}}>
              {test.title}　<span style={{border:'1px solid #D3D3D3',padding:'0.05rem 0.15rem',borderRadius:'5px'}}>{test.isImediateTest?'即到即考':'集体考试'}</span>
            </p>
            <p style={{color:'#999999',lineHeight:'0.5rem',paddingTop:'0.4rem'}}>考试时间</p>
            <p style={{color:'#666666',fontSize:'0.35rem',lineHeight:'0.8rem'}}>开始：{test.testFrom}</p>
            <p style={{borderBottom:'1px solid #E7E7E7',paddingBottom:'0.2rem',color:'#666666',fontSize:'0.35rem',lineHeight:'0.8rem'}}>结束：{test.testTo}</p>
            <p style={{color:'#999999',lineHeight:'0.5rem',paddingTop:'0.4rem'}}>考试时长</p>
            <p style={{color:'#666666',fontSize:'0.35rem',lineHeight:'0.8rem'}}>{test.testMinutes}分钟</p>
          </Flex.Item>
        </Flex>
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


