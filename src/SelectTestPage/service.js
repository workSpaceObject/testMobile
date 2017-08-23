import {urlpre} from '../utils/Constants';
import {get,post,fileUpload} from 'request';

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
export async function getLeaveSeconds(examineeUid){
  return get(`${urlpre}/tc/getLeaveSeconds/${examineeUid}`);
}
//query params:studentAns
export async function saveStudentAns(examineeUid,itemIndex,params){
  return post(`${urlpre}/tc/saveStudentAns/${examineeUid}/${itemIndex}`,params,false);
}
//query params:studentAns
export async function deployPaper(examineeUid,itemIndex,params){
  return post(`${urlpre}/tc/deployPaper/${examineeUid}/${itemIndex}`,params,false);
}
export async function getAvailableTestsForHelp(){
  return get(`${urlpre}/tc/getAvailableTestsForHelp`);
}
export async function sendHelpEvent(testUid,helpEvent){
  return post(`${urlpre}/tc/sendHelpEvent/${testUid}`,helpEvent);
}
export async function getReplyedHelpEvent(helpEventUid){
  return get(`${urlpre}/tc/getReplyedHelpEvent/${helpEventUid}`);
}
