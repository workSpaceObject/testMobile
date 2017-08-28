 import React, {Component} from 'react';
import {InputItem,Flex,Button,List} from 'antd-mobile';
import {connect} from 'dva';
import Styles from './index.less';
import screenfull from 'screenfull';
import ReactDOM from 'react-dom';
import {Link} from 'dva/router';
 import { createForm } from 'rc-form';
 import Dimensions from 'react-dimensions'

class LoginPage extends Component {
  componentWillMount() {
      this.props.dispatch({type:'tcTestState/getUnitSetting'})
  }
  componentDidMount(){
    const {form}=this.props;
    //为login添加监听事件（‘click’），点击后网页全屏
    let login=ReactDOM.findDOMNode(this.refs.login);
    login.addEventListener('click',() => {
      // form.validateFields((errs, data)=> {
      //   if (!!errs) {
      //     return;
      //   }
      //   this.props.dispatch({type: 'tcTestState/login', payload: data});
      // })
      if (screenfull.enabled) {
        screenfull.request();
      }
        form.validateFields((errs, data)=> {
          if (!!errs) {
            return;
          }
          //console.log(data);
          this.props.dispatch({type: 'tcTestState/login', payload: data});
        });

    });

  }
  render() {
  const {form,loading }=this.props;
  const {preLogin}=this.props.tcTestState;
  const {getFieldProps,getFieldError,getFieldValue}=form;
  const formItemLayout = {wrapperCol: {span: 24},};
    let errors;

    return (
     <div className={Styles.page}>
         <Flex justify="center">
           <img style={{width:'24%',paddingTop:'1.2rem'}} src={require('../assets/logo.png')}/>
         </Flex>
         <Flex  justify="center">
           <h3  style={{color:'#18639c',paddingTop:'0.2rem'}}>考试在线365</h3>
         </Flex>
       <List style={{margin:'0 auto',marginTop:'1.2rem',width:'86%'}} className={Styles.ListStyle}>
         <InputItem style={{color:'#3593DB',border:'0.02rem solid #66ACE2',fontSize:'1rem',borderRadius:'0.1rem'}}
           {...getFieldProps('identifier',{rules: [{ required: true, max: 20, message: '请输入身份证号',whitespace:true },],initialValue:(preLogin!='undefine'&&preLogin!='undefined')?preLogin:''})}
           clear
           placeholder="请输入身份证号"
           autoFocus
           labelNumber={1}
         ><span style={{display:'block',color:'#3593db',fontSize:'0.5rem',width:'0.8rem'}} className="iconfont">&#xe689;</span></InputItem>
       </List>
       <p style={{textAlign:'right',marginRight:'0.4rem',paddingTop:'0.2rem'}}><Link to="/helpEvent" style={{color:'#3593db'}}>远程求助</Link></p>
       <Flex justify="center" style={{paddingTop:'1rem'}}>
         <Button style={{width:'88%',borderRadius:'0.5rem'}} type="primary" disabled={!getFieldValue("identifier")} ref="login">登 录</Button>
       </Flex>
       <Flex style={{height:'1rem',width:'100%',marginTop:this.props.containerHeight-452<0?45:this.props.containerHeight-452}}>
         <p style={{textAlign:'center',color:'#999999',width:'100%'}}>技术支持：北京云翼互联科技有限公司</p>
       </Flex>
    </div>
  );
  }
}
export default connect(({tcTestState, loading})=>({tcTestState, loading: loading.global,}))(createForm()(Dimensions()(LoginPage)));
