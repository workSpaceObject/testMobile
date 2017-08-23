import React, {Component} from 'react';
import publicstyle from '../common/index.less';
import {NavBar,Icon} from 'antd-mobile';
import {connect} from 'dva';
import {Link} from 'dva/router';
import Dimensions from 'react-dimensions'

class MainPage extends Component {
  componentWillMount() {
    this.props.dispatch({type:'tcTestState/getTestPapers'})
  }
  componentDidMount(){

  }
  render() {
    const {test}=this.props.tcTestState;
    const route=[...(this.props.routes||[])][1].path;
    let title,lastRoute,hidleftCont;
    switch (route){
      case '/helpEvent':
        title='远程求助',lastRoute='/';break;
      case '/eventWait':
        title='等待处理求助',lastRoute='/helpEvent';break;
      case '/testWait':
        title=test.title,lastRoute='/';break;
      case '/testing':
        title=test.title,hidleftCont=true;break;
      default:
        title=test.title,lastRoute="/";
    }
    //console.log(this.props.routes);
    return (
      <div style={{backgroundColor:'#FFFFFF',}}>
        <NavBar leftContent={!hidleftCont?<Link style={{fontSize:20,fontFamily:'serif',fontWeight:'bold' ,color:'#fff'}} to={String(lastRoute)} >{'<'}</Link>:''}
                style={{backgroundColor:'#3593DB',color:'#fff'}}
                mode="dark"
                iconName={false}
        >{title}</NavBar>
        <div style={{height:this.props.containerHeight-45}}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
export default connect(({tcTestState, loading})=>({tcTestState, loading: loading.global,}))(Dimensions()(MainPage));


