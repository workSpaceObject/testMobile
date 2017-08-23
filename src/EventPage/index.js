import React, {Component} from 'react';
import {Button,Icon,} from 'antd-mobile';
import {connect} from 'dva';
import Styles from './index.less';
import {Link} from 'dva/router';

class EventPage extends Component {
  componentWillMount() {
    this.getReply();
  }
  componentDidMount(){

  }
  componentDidUpdate(){
    const {isReply,phtml}=this.props.tcTestState;
    if (!isReply||phtml){
      clearInterval(this.interval);
    }else {
      this.interval=setInterval(this.getReply,10000);
    }
  }
  componentWillUnmount(){
    clearInterval(this.interval);
    this.props.dispatch({type:'tcTestState/updateState',payload:{isReply:false}})
  }
  getReply=()=>{
    const {isReply,phtml}=this.props.tcTestState;
    if(isReply){
      this.props.dispatch({type:'tcTestState/getReplyedHelpEvent'})
    }
  }
  onUpdateState=(params)=>{
    this.props.dispatch({type:'tcTestState/updateState',payload:params})
  }
  onDeployPaper=()=>{
    this.props.dispatch({type:'tcTestState/deployPaper'})
  }
  render() {
    const {eventImg,btnIsShow,phtml,deployBtn}=this.props.tcTestState;

    return (
      <div style={{height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
        <img  src={require(`../assets/${eventImg}`)} style={{width:'100%'}} alt=""/>
        <div>
          <div dangerouslySetInnerHTML={{__html:phtml}}>
          </div>
          {btnIsShow?<Link to="/" className={Styles.login}>返回登录</Link>:null}
          {deployBtn?<Button style={{display:'block',margin:'0 auto',position: 'absolute',left:'35%',top:'80%',width: 113}} onClick={()=>this.onDeployPaper()}>再次交卷</Button>:null}
        </div>
      </div>
    );
  }
}
export default connect(({tcTestState}) => ({tcTestState}))(EventPage);


