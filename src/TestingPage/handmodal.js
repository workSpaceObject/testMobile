import React, {PropTypes} from 'react';
import {Button} from 'antd-mobile';
import styles from './index.less';

function HandPageModal({handVisible,testItems,ansDoubts,ansResults={},onDeployPaper, onCancel,onUpdateState}){

  return (
    <div className={styles.imgdiv} style={{height:'100%'}}>
      <div style={{width:'100%',justifyContent:'center',alignItems:'center',display:'flex'}}><img src={require('../assets/testtip.png')} style={{width:'1.5rem'}} alt=""/></div>
      <div style={{display: 'flex',alignItems: 'center',margin: '20px'}}>
        <h3 style={{fontSize:'17px',fontWeight:'lighter'}}>存在<span style={{color:'#ff1e00'}}> {[...(ansDoubts||[])].length} </span>道标记题,<span style={{color:'#ff1e00'}}> {[...(testItems||[])].length-[...(Object.keys(ansResults)||[])].length} </span>道未完成题，您是否确认提交试卷？</h3>
      </div>
      <div className={styles.imgdiv} style={{width:'100%',height:'1rem',flexDirection:'row'}}>
        <Button size="large" style={{display:'block',marginRight:'40px',width:'1.5rem',height:'0.7rem',lineHeight:'0.7rem'}} onClick={onDeployPaper} type="primary">提交</Button>
        <Button size="large" style={{display:'block',width:'1.5rem',height:'0.7rem',lineHeight:'0.7rem'}} onClick={()=>onUpdateState({handVisible:false})}>返 回</Button>
      </div>
      {/*<img src={againVisible?require('../assets/tipscoin.png'):require('../assets/tipcoin.png')} style={{float:'left'}} alt=""/>*/}
      {/*<div style={{display: 'flex',alignItems: 'center', height: '140px',marginRight: '20px'}}>*/}
        {/*{againVisible?<h3 style={{color:'#000',fontSize:'17px'}}><span style={{color:'#ff1e00'}}> 再次提醒： </span>交卷后将不能再进行答题，您确定要交卷吗？</h3>:<h3 style={{color:'#000',fontSize:'17px'}}>存在<span style={{color:'#ff1e00'}}> {[...(ansDoubts||[])].length} </span>道标记题,<span style={{color:'#ff1e00'}}> {[...(testItems||[])].length-[...(Object.keys(ansResults)||[])].length} </span>道未完成题，您是否确认提交试卷？</h3>}*/}
      {/*</div>*/}
    </div>
  );
}
export default HandPageModal;
