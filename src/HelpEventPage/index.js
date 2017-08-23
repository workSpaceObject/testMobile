import React, {Component} from 'react';
import {connect} from 'dva';
import Styles from '../SelectTestPage/index.less';
import {Link} from 'dva/router';
import { createForm } from 'rc-form';
import {Button,List,Flex,InputItem,TextareaItem} from 'antd-mobile';
import Dimensions from 'react-dimensions'

class HelpEventPage extends Component {
  componentWillMount() {

  }
  componentDidMount(){

  }
  onUpdateState=(params)=>{
    this.props.dispatch({type:'tcTestState/updateState',payload:params})
  }

  render() {
  const {form,dispatch}=this.props;
  const {curHelp}=this.props.tcTestState;
  const {getFieldProps,getFieldValue,getFieldError}=form;
  const formItemLayout = {wrapperCol: {span: 18},labelCol:{span:6}};

    const onSubmit = (e)=> {
      e.preventDefault();
      form.validateFields((errs, formData)=> {
        if (!!errs) {
          return;
        }
        const data={...curHelp,...formData};
        console.log(data);
       this.props.dispatch({type:'tcTestState/sendHelpEvent',payload:data})
      });
    }
    return (
          <div style={{backgroundColor:'#fff',height:'100%',overflowY:'auto'}}>
            <img src={require('../assets/helpbanner.png')} style={{width:'100%',height:'2.2rem'}}/>
            <List style={{width:'100%'}}>
              <InputItem
                style={{color:'#3593DB',height:'1.05rem'}}
                {...getFieldProps('identifier',{rules: [{ required: true, max: 20, message: '请输入身份证号',whitespace:true },],})}
                clear
                placeholder="请输入身份证号"
                autoFocus
                error={getFieldError("identifier")}
              />
            </List>
            {getFieldError("identifier")?<span style={{color:'red',lineHeight:'0.7rem',}}> 身份证号不得为空</span>:''}
            {/*helpType*/}
            <div style={{backgroundColor:'#ebebeb'}}>
              <p style={{color:'#383838',fontSize:'0.4rem',backgroundColor:'#ebebeb',height:'0.8rem',lineHeight:'0.8rem'}}>　问题类型</p>
              <Flex justify="center" style={{backgroundColor:'#EBEBEB'}}>
                <Flex.Item><Button type={curHelp.helpType==1?"primary":'ghost'} inline size="small" onClick={()=>this.onUpdateState({curHelp:{...curHelp,helpType:1}})} style={curHelp.helpType==1?{ margin: '0.2rem',}:{ margin: '0.2rem',background:'#fff'}}>不能登录</Button></Flex.Item>

                <Flex.Item><Button type={curHelp.helpType==2?"primary":'ghost'} inline size="small" onClick={()=>this.onUpdateState({curHelp:{...curHelp,helpType:2}})} style={curHelp.helpType==2?{ margin: '0.2rem',}:{ margin: '0.2rem',background:'#fff'}}>取消交卷</Button></Flex.Item>
                <Flex.Item><Button type={curHelp.helpType==3?"primary":'ghost'} inline size="small" onClick={()=>this.onUpdateState({curHelp:{...curHelp,helpType:3}})} style={curHelp.helpType==3?{ margin: '0.2rem',}:{ margin: '0.2rem',background:'#fff'}}>解锁机器</Button></Flex.Item>
                {/*<Button type={curHelp.helpType==4?"primary":'ghost'} inline size="small" onClick={()=>this.onUpdateState({curHelp:{...curHelp,helpType:4}})} style={{ marginRight: '0.08rem' }}>延长时间</Button>*/}
                <Flex.Item><Button type={curHelp.helpType==9?"primary":'ghost'} inline size="small" onClick={()=>this.onUpdateState({curHelp:{...curHelp,helpType:9}})} style={curHelp.helpType==9?{ margin: '0.2rem',}:{ margin: '0.2rem',background:'#fff'}}>其他</Button></Flex.Item>
              </Flex>
            </div>
            <div style={{backgroundColor:'#ffffff',paddingTop:'0.3rem'}}>
              <TextareaItem style={{width:'87%',margin:'0 auto',border:'0.01rem solid #DBDBDB'}}
                            {...getFieldProps('content',{rules: [{ required: true, max: 20, message: '请输入您的问题描述',whitespace:true },],})}
                            rows={5}
                            count={100}
                            error={getFieldError("content")}
              />
              {getFieldError("content")?<p style={{color:'red',textAlign:'center',lineHeight:'0.7rem'}}>问题描述不得为空</p>:''}
              <div  style={{}}>
                <Flex justify="center" style={{backgroundColor:'#E4F0FE',height:'1rem',marginTop:this.props.containerHeight-496<0?45:this.props.containerHeight-496}}>
                  <Button size="large" style={{display:'block',marginRight:'40px',width:'1.5rem',height:'0.7rem',lineHeight:'0.7rem'}} onClick={onSubmit} type="primary">提交</Button>
                  <Button size="large" style={{display:'block',marginRight:'40px',width:'1.5rem',height:'0.7rem',lineHeight:'0.7rem'}}><Link to="/" size="large">返 回</Link></Button>
                </Flex>
              </div>
            </div>

              {/*<Row style={{position: 'absolute',width: '100%',height: 100,bottom: 0,background:' #E4F0FE',lineHeight:100,left:0}}><Col span={12}><Button size="large" style={{margin:'0 auto',display:'block'}} htmlType="submit" type="primary">提交</Button></Col><Col span={12}><Link className="aBtnDefa" to="/" size="large">返 回</Link></Col></Row>*/}
          </div>
    );
  }
}
export default connect(({tcTestState, loading})=>({tcTestState, loading: loading.global,}))(createForm()(Dimensions()(HelpEventPage)));

