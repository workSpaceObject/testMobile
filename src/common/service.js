import {urlpre} from '../utils/Constants';
import {get,post,fileUpload} from 'request';
import localforage from 'localforage';

//配置localStroge
localforage.config({
  driver      : localforage.LOCALSTORAGE, // Force WebSQL; same as using setDriver()
  name        : 'myApp',
});
export async function  setLocalData(key,value) {
  return localforage.setItem(key,value);
}
export async function  getLocalData(key) {

  return localforage.getItem(key);
}
export async function  removeLocalData(key) {

  return localforage.removeItem(key);
}
export async function clearLocalData() {

  return localforage.clear();
}


export async function getUnitSetting(){
  return get(`${urlpre}/tc/getUnitSetting`);
}
//query params:identifier
export async function login(params){
  return post(`${urlpre}/tc/login`,params,false);
}
export async function getTestInfo(unitId,params){
  return post(`${urlpre}/tc/getTestInfo/${unitId}`,params,false);
}
export async function enterTest(examineeUid) {
  return get(`${urlpre}/tc/enterTest/${examineeUid}`)
}
export async function getLeaveSeconds(examineeUid){
  return get(`${urlpre}/tc/getLeaveSeconds/${examineeUid}`);
}
export async function increLeaveCnt(examineeUid){
  return get(`${urlpre}/tc/increLeaveCnt/${examineeUid}`,null,false)
}
//query params:studentAns
export async function saveStudentAns(examineeUid,itemIndex,params){
  return post(`${urlpre}/tc/saveStudentAns/${examineeUid}/${itemIndex}`,params,false,false);
}
export async function saveStudentAnses(examineeUid,params) {
  return post(`${urlpre}/tc/saveStudentAnses/${examineeUid}`,params,true,false);
}
export async function updateOfflineAnses(examineeUid,params) {
  return post(`${urlpre}/tc/updateOfflineAnses/${examineeUid}`,params,true,false);
}
//query params:studentAns
export async function saveStudentAnsDoubt(examineeUid,itemIndex,isDoubt){
  return post(`${urlpre}/tc/saveStudentAnsDoubt/${examineeUid}/${itemIndex}/${isDoubt}`,null,false,false);
}
export async function saveStudentAnsDoubts(examineeUid,doubts){
  return post(`${urlpre}/tc/saveStudentAnsDoubts/${examineeUid}`,doubts,false,false);
}
//query params:studentAns
export async function deployPaper(examineeUid){
  return post(`${urlpre}/tc/deployPaper/${examineeUid}`,null,false,false);
}
export async function sendHelpEvent(helpEvent){
  return post(`${urlpre}/tc/sendHelpEvent`,helpEvent);
}
export async function getReplyedHelpEvent(helpEventUid){
  return get(`${urlpre}/tc/getReplyedHelpEvent/${helpEventUid}`);
}
