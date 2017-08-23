import {setLocalData,getLocalData,removeLocalData,getUnitSetting,login,getTestInfo,getLeaveSeconds,enterTest,increLeaveCnt,saveStudentAns,saveStudentAnses,deployPaper,sendHelpEvent,getReplyedHelpEvent,saveStudentAnsDoubt,saveStudentAnsDoubts,updateOfflineAnses} from  './service';
import {routerRedux} from 'dva/router';
import {combineExtProperties} from 'devutils';
import * as FileSaver from 'file-saver';

export default {
  namespace: 'tcTestState',
  state: {
    curUser:{},
    testInfos:{},
    examinees:[],
    unit:{},
    curHelp:{},
    //试卷信息、
    ansResults:{},
    ansDoubts:[],
    examinee:{},
    test:{},
    testItems:[],
    paperSects:[],
    failansResults:{},
    failansDoubts:{},
    waitSeconds:1000,
    answSheetVisible:false,
    itemsIndex:0,

    handVisible: false,
    againVisible:false,
    leaveVisible:false,
    oldCountDown:0,
    countDown:99999,
    leaveCnt:0,
    leaveWaitSecond:5,
    //提示信息页面
    btnIsShow:true,
    eventImg:'testOver.png',
    phtml:``,
    isReply:false,
    deployBtn:false,
  },

  effects: {
    *login({payload},{call,put}){
      const {data} = yield call(login, payload);
      if (data) {
        const {unitId,examineeUid}=data.data;
        yield call(setLocalData,'unitId',String(unitId))

        if(examineeUid){
          yield call(setLocalData,'examineeUid',String(examineeUid))
        }else {
          yield call(removeLocalData,'examineeUid')
        }
        yield call(setLocalData,'identifier',String(payload.identifier));
        yield put({type:'getTestInfo',payload:{}})
      }
    },
    *getUnitSetting({payload},{call,put}){
      const {data}=yield call(getUnitSetting)
    },
    *getTestInfo({payload},{call,put,select}){
      const unitId=yield call(getLocalData,'unitId');
      const idCard=yield call(getLocalData,'identifier');
      let studnetUid=payload.examineeUid;
      //将examineeUid放入localStroge里，以便刷新时更新数据
      if(payload.examineeUid){
        yield call(setLocalData,'examineeUid',String(payload.examineeUid))
      }else {
        studnetUid=yield call(getLocalData,'examineeUid');
      }
      if(studnetUid){
        const newFail=yield call(getLocalData,'failansResults');
        const failansResults=JSON.parse(newFail);
        //判断本地是否有未上传的答案，有：上传
        if(failansResults) {
          //判断是否是本人答案
          if (failansResults[studnetUid]) {
              yield put({type:'updateOfflineAnses',payload:{anses:failansResults[studnetUid]}})
          }
        }
      }
      const {data}=yield call(getTestInfo,unitId,{...payload,examineeUid:studnetUid,identifier:idCard});
      if(data){
        const {testInfos,examinees}=data.data;
        yield put({type:'updateState',payload:{...data.data}})
        //判断是否有多个考试。true：转入select路径， false：转入examin确认考生信息
        if(testInfos){
          combineExtProperties(examinees,testInfos,{title:'',testFrom:'',testTo:'',isImediateTest:null},'testId')
          yield put({type:'updateState',payload:{examinees}})
          yield put(routerRedux.replace({pathname: '/select'}));
        }else {
          const {ansResults,ansDoubts,examinee,test,testItems,paperSects,unit,waitSeconds}=data.data;
          //判断乱序,并重新排序
          let newTestItems;
          if(examinee.testItemIds){
            let TestItems=new Array();
            for(let itemIndex of examinee.testItemIds){
              testItems&&testItems.map(testitem=>{
                  if(testitem.id==itemIndex){
                    TestItems.push(testitem)
                  }
                })
            }
            newTestItems=TestItems;
          }else if(!examinee.testItemIds){
            newTestItems=testItems;
          }
          if(examinee.itemSelSorts){
            newTestItems=newTestItems&&newTestItems.map(testitem=>{
              let newSel=new Array();
              if(examinee.itemSelSorts[testitem.id]){
                for(let selIndex of examinee.itemSelSorts[testitem.id]){
                  newSel.push(testitem.itemSels[parseInt(selIndex)-1])
                }
                testitem.itemSels=newSel;
              }
                return testitem
            })
          }

          //将试卷、考试信息存入localStroge里，防止刷新清除state
          yield call(setLocalData,'ansResults',JSON.stringify(ansResults))
          yield call(setLocalData,'ansDoubts',ansDoubts)
          yield call(setLocalData,'examinee',JSON.stringify(examinee))
          yield call(setLocalData,'test',JSON.stringify(test))
          yield call(setLocalData,'oldMaxLeaveCnt',test.maxLeaveCnt)
          yield call(setLocalData,'testItems',JSON.stringify(newTestItems))
          yield call(setLocalData,'unit',JSON.stringify(unit));
          yield call(setLocalData,'paperSects',paperSects);
          yield call(setLocalData,'waitSeconds',waitSeconds);
          yield call(setLocalData,'leaveCnt',examinee.leaveCnt);
          if(!studnetUid){
            yield call(setLocalData,'examineeUid',String(examinee.uid));
          }
          yield put(routerRedux.replace({pathname: '/examin'}));
        };
      }
    },
    *enterTest({payload},{call,put}){
      yield put({type:'updateState',payload:{waitSeconds:-1}})
     const examineeUid=yield call(getLocalData,'examineeUid');
      const {data}=yield call(enterTest,examineeUid);
      if(data){
        yield call(setLocalData,'countDown',String(data.data))
        yield call(setLocalData,'oldCountDown',String(data.data))
        yield put(routerRedux.replace({pathname: '/testing'}));
      }
    },

    //网页刷新，从localStroge取试题、已答答案
    *getTestPapers({payload},{call,put}){
     const newansResults=yield call(getLocalData,'ansResults');
     const newexaminee=yield call(getLocalData,'examinee');
     const newtest=yield call(getLocalData,'test');
     const newtestItems=yield call(getLocalData,'testItems');
     const newcountDown=yield call(getLocalData,'countDown');
      const oldcountDown=yield call(getLocalData,'oldCountDown');
     const newleave=yield call(getLocalData,'leaveCnt');
     const newansDoubts=yield call(getLocalData,'ansDoubts');
     const paperSects=yield call(getLocalData,'paperSects');
     const newFail=yield call(getLocalData,'failansResults');
     const failDoubt=yield call(getLocalData,'failansDoubts');
     const oldunit=yield call(getLocalData,'unit');
      const oldWaitSecond=yield call(getLocalData,'waitSeconds');
     const oldMaxLeaveCnt=yield call(getLocalData,'oldMaxLeaveCnt')
      const itemsIndex=yield call(getLocalData,'itemsIndex');
      //格式化处理
     let ansResults=JSON.parse(newansResults);
      let ansDoubts=newansDoubts;
     let examinee=JSON.parse(newexaminee)
     let test=JSON.parse(newtest)
     let testItems=JSON.parse(newtestItems)
     let countDown=parseInt(newcountDown);
     let leaveCnt=parseInt(newleave);
     let oldCountDown=parseInt(oldcountDown);
     const failansResults=JSON.parse(newFail);
     const failansDoubts=JSON.parse(failDoubt);
     const unit=JSON.parse(oldunit);
      const waitSeconds=parseInt(oldWaitSecond);
      yield put({type:'updateState',payload:{ansResults,oldMaxLeaveCnt:parseInt(oldMaxLeaveCnt),examinee,test,testItems,countDown,leaveCnt,ansDoubts,paperSects,failansResults,failansDoubts,oldCountDown,unit,waitSeconds,itemsIndex:parseInt(itemsIndex||0)}})
    },

    //倒计时，存入localstroge中，防止刷新重新开始
    *countDown({payload},{call,put}){
      yield call(setLocalData,'countDown',payload);
      yield put({type:'updateState',payload:{countDown:payload}});
    },
    *setitemsIndex({payload},{call,put}){
      yield call(setLocalData,'itemsIndex',payload);
      yield put({type:'updateState',payload:{itemsIndex:payload}});
    },
    *getLeaveSeconds({payload},{call,put}){
      const examineeUid=yield call(getLocalData,'examineeUid');
      const {data}=yield call(getLeaveSeconds,examineeUid);
      if(data){
        const newcountDown=yield call(getLocalData,'countDown');
        let countDown=parseInt(newcountDown);
        yield call(setLocalData,'countDown',String(countDown+parseInt(data.data)))
        yield put({type:'getTestPapers',payload:{}})
      }
    },

    //计算离开
    *increLeaveCnt({payload},{call,put}){
     if(payload.type){
       yield put(routerRedux.replace({pathname:payload.type}));
       yield put({type:'updateState',payload:{leaveVisible:false}})
     }else {
       const examineeUid=yield call(getLocalData,'examineeUid');
       const oldMaxLeaveCnt=yield call(getLocalData,'oldMaxLeaveCnt')
       const leaveCnt=yield call(getLocalData,'leaveCnt');
       if((parseInt(oldMaxLeaveCnt)-parseInt(leaveCnt))>0){
         let newLeaveCnt=parseInt(leaveCnt)+1;
         yield put({type:'updateState',payload:{leaveVisible:true,leaveCnt:newLeaveCnt,leaveWaitSecond:5}});
         const {data}=yield call(increLeaveCnt,examineeUid);
         yield call(setLocalData,'leaveCnt',newLeaveCnt)
         if(data){
           const datas=data.data
           yield call(setLocalData,'leaveCnt',parseInt(oldMaxLeaveCnt)-parseInt(datas))
           yield put({type:'updateState',payload:{leaveVisible:true,leaveCnt:parseInt(oldMaxLeaveCnt)-parseInt(datas),leaveWaitSecond:5}});
         }
       }else {
         //交卷
         yield put({type:'deployPaper'});
       }
     }
      //console.log({...oldTest,maxLeaveCnt:newLeaveCnt},JSON.stringify({...oldTest,maxLeaveCnt:newLeaveCnt}))
    },

    //保存答案
    *saveStudentAns({payload},{call,put}){
      const examineeUid=yield call(getLocalData,'examineeUid');
      const {data,err}=yield call(saveStudentAns,examineeUid,payload.itemIndex,payload);

      //如果保存失败，试题答案进入failansResults；
      if(err){
        if(err.message=='forceDeployed'){
          yield put({type:'updateState',payload:{btnIsShow:true,eventImg:'testOver.png',phtml:`<p style='margin: 0 auto;font-size: 0.6rem;font-weight: bold;text-align: center;color:#fff;width: 100%;position: absolute;left:0%;top: 50%;'>被强制交卷！</p>`}})
          yield put(routerRedux.replace({pathname:'/event'}));
        }
        const failanswer=yield call(getLocalData,'failansResults');
        let failansResults;
       if(failanswer){
         failansResults=JSON.parse(failanswer);
         failansResults={...failansResults,[examineeUid]:{...failansResults[examineeUid],[payload.itemIndex]:payload.studentAns}}
       }else {
         failansResults={[examineeUid]:{[payload.itemIndex]:payload.studentAns}};
       }
        yield call(setLocalData,'failansResults',JSON.stringify(failansResults));
      }
      const answer=yield call(getLocalData,'ansResults');
      let ansResults=JSON.parse(answer);
      ansResults={...ansResults,[payload.itemIndex]:payload.studentAns}
      yield call(setLocalData,'ansResults',JSON.stringify(ansResults));
      yield put({type:'getTestPapers',payload:{}})
    },

    //每3分钟上传一次未上传成功的答案
    *saveStudentAnses({payload},{call,put}){
      const examineeUid=yield call(getLocalData,'examineeUid');
      const newFail=yield call(getLocalData,'failansResults');
      const failansResults=JSON.parse(newFail);
      if(failansResults){
        //判断是否是本人答案
        if(failansResults[examineeUid]){
          const {data,err}=yield call(saveStudentAnses,examineeUid,failansResults[examineeUid]);
          if(err&&err.message=='forceDeployed'){
            yield put({type:'updateState',payload:{btnIsShow:true,eventImg:'testOver.png',phtml:`<p style='margin: 0 auto;font-size: 0.6rem;font-weight: bold;text-align: center;color:#fff;width: 100%;position: absolute;left: 0%;top: 50%;'>被强制交卷！</p>`}})
            yield put(routerRedux.replace({pathname:'/event'}));
          }
          //如果保存成功，清除failansResults;
          if(data){
            delete failansResults[examineeUid];
            let failLength=[...(Object.keys(failansResults)||[])].length;
            if(!failLength){
              yield call(removeLocalData,'failansResults');
            }else {
              yield call(setLocalData,'failansResults',failansResults);
            }
            yield put({type:'getTestPapers',payload:{}})
          }
        }
      }
    },
    //登录时上传未上传的答案和移机处理;
    *updateOfflineAnses({payload},{call,put}){
      const examineeUid=yield call(getLocalData,'examineeUid');
      const newFail=yield call(getLocalData,'failansResults');
      const failansResults=JSON.parse(newFail);

      const {data}=yield call(updateOfflineAnses,examineeUid,payload.anses);
      // if(data&&payload.type){
      //   notification.success({message:'成功导入本地答案！'})
      // }
      const answer=yield call(getLocalData,'ansResults');
      let ansResults=JSON.parse(answer);
      ansResults={...ansResults,...payload}
      yield call(setLocalData,'ansResults',JSON.stringify(ansResults));

      //清除本人答案
      if(failansResults&&failansResults[examineeUid]){
        delete failansResults[examineeUid];
        let failLength=[...(Object.keys(failansResults)||[])].length;
        if(!failLength){
          yield call(removeLocalData,'failansResults');
        }
      }
      yield put({type:'getTestPapers',payload:{}})
    },
    //标记疑问
    *saveStudentAnsDoubt({payload},{call,put,select}){
      const examineeUid=yield call(getLocalData,'examineeUid');
      const {data,err}=yield call(saveStudentAnsDoubt,examineeUid,payload.itemIndex,payload.isDoubt);
      if(err){
        if(err.message=='forceDeployed'){
          yield put({type:'updateState',payload:{btnIsShow:true,eventImg:'testOver.png',phtml:`<p style='margin: 0 auto;font-size: 0.6rem;font-weight: bold;text-align: center;color:#fff;width: 100%;position: absolute;left: 0%;top: 50%;'>被强制交卷！</p>`}})
          yield put(routerRedux.replace({pathname:'/event'}));
        }
        let doubts=yield call(getLocalData,'failansDoubts');
        if(doubts){
          let failDoubts=[...(doubts[examineeUid]||[])];
          if(failDoubts.length>0){
            if(payload.isDoubt){
              failDoubts.push(payload.itemIndex);
            }else {
              for(let i=0; i<failDoubts.length; i++) {
                if(failDoubts[i] == payload.itemIndex) {
                  failDoubts.splice(i, 1);
                  break;
                }
              }
            }
            yield call(setLocalData,'failansDoubts',failDoubts);
            yield put({type:'getTestPapers',payload:{}})
          }
        }
      }
      let ansDoubts=yield call(getLocalData,'ansDoubts');
      if(payload.isDoubt){
        ansDoubts.push(payload.itemIndex);
      }else {
        ansDoubts=ansDoubts.filter(value=>value!=payload.itemIndex);
      }
      yield call(setLocalData,'ansDoubts',ansDoubts);
      yield put({type:'getTestPapers',payload:{}})
    },

    //上传未上传的疑问
    *saveStudentAnsDoubts({payload},{call,put,select}){
      const examineeUid=yield call(getLocalData,'examineeUid');
      const newFail=yield call(getLocalData,'failansDoubts');
      const failansDoubts=JSON.parse(newFail);
      if(failansDoubts){
        //判断是否是本人答案
        if(failansDoubts[examineeUid]){
          const {data,err}=yield call(saveStudentAnsDoubts,examineeUid,payload);
          if(err&&err.message=='forceDeployed'){
            yield put({type:'updateState',payload:{btnIsShow:true,eventImg:'testOver.png',phtml:`<p style='margin: 0 auto;font-size: 0.6rem;font-weight: bold;text-align: center;color:#fff;width: 100%;position: absolute;left: 0%;top: 50%;'>被强制交卷！</p>`}})
            yield put(routerRedux.replace({pathname:'/event'}));
          }
          //清除本人疑问
          if(failansDoubts&&failansDoubts[examineeUid]){
            delete failansDoubts[examineeUid];
            let failLength=[...(Object.keys(failansDoubts)||[])].length;
            if(!failLength){
              yield call(removeLocalData,'failansDoubts');
            }
          }
          yield put({type:'getTestPapers',payload:{}})
        }
      }
    },

    //交卷
    *deployPaper({payload},{call,put}){
      const examineeUid=yield call(getLocalData,'examineeUid');

      //跳转到提示页
      yield put({type:'updateState',payload:{handVisible:false,eventImg:'force.png',phtml:`<p style='margin: 0 auto;font-size: 0.6rem;font-weight: bold;text-align: center;color: #FF5500;width: 100%;position: absolute;left: 0;top: 69%;'>正在交卷请稍后.....</p>`}})
      yield put(routerRedux.replace({pathname:'/event'}));

      //交卷前判断还有没有未提交成功的答案
      const newFail=yield call(getLocalData,'failansResults');
      const failansResults=newFail?JSON.parse(newFail):null;
      let datas;
      if(failansResults){
        if(failansResults[examineeUid]){
          const {data}=yield call(saveStudentAnses,examineeUid,failansResults[examineeUid]);
          datas=data;
        }
      }
      //如果保存成功，清除failansResults;
      if(datas){
        yield call(removeLocalData,'failansResults');
        yield put({type:'getTestPapers',payload:{}})
      }
      const {data,err}=yield call(deployPaper,examineeUid);
      if(data){
        const {score}=data.data;
        yield put({type:'updateState',payload:{btnIsShow:true,eventImg:score!=null?((score/10)>75?'overimg.png':'over.png'):'testOver.png',phtml:score!=null?`<p style='margin: 0 auto;font-size: 0.6rem;font-weight: bold;text-align: center;color: #FF5500;position: absolute;right: 17%;top: 33%;'>${(score/10)}<span style='color:#666'>分</span></p>`:`<p style='margin: 0 auto;font-size: 0.6rem;font-weight: bold;text-align: center;color: #ffffff;width: 100%;position: absolute;left: -10%;top: 50%;'>考试结束！</p>`}})
      }else if(err){
        if(err.message=='forceDeployed'){
          yield put({type:'updateState',payload:{btnIsShow:true,eventImg:'testOver.png',phtml:`<p style='margin: 0 auto;font-size: 0.6rem;font-weight: bold;text-align: center;color:#fff;width: 100%;position: absolute;left: 0%;top: 50%;'>被强制交卷！</p>`}})
        }else {
          yield put({type:'updateState',payload:{eventImg:'testOver.png',phtml:`<p style='font-size: 40px;line-height: 30px;font-weight: bold;text-align: center;color: #eee;position: absolute;left: 21%;top: 50%;'>交卷失败！</p>`,deployBtn:true}})
        }
      }

    },

    //保存远程求助
    *sendHelpEvent({payload},{call,put,select}){
      const {data}=yield call(sendHelpEvent,payload);
      if(data){
        yield call(setLocalData,'helpEventUid',data.data);
        //跳转到等待也
        yield put(routerRedux.replace({pathname:'/eventWait'}));
      }
    },

    //获取求助事件
    *getReplyedHelpEvent({payload},{call,put}){
      const helpEventUid=yield call(getLocalData,'helpEventUid')
      const {data}=yield call(getReplyedHelpEvent,helpEventUid);
      if(data){
        if(data.data){
          const datas=data.data;
          yield put({type:'updateState',payload:{isReply:true,btnIsShow:true,eventImg:'force.png',phtml:`<p style='padding-top: 164px;width: 50%; margin: 0 auto;font-size: 16px;text-indent: 31px;line-height: 30px;font-weight: bold;'>${datas.replyContent}</p>`}})
          yield put(routerRedux.replace({pathname:'/event'}));
        }
      }
    },

  },

  reducers: {
    updateState(state, {payload}){
      return {...state, ...payload};
    },
  },

}

