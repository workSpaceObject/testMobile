import {urlpre} from '../utils/Constants';
import {get,post,fileUpload} from 'request';

export async function getUnitSetting(){
  return get(`${urlpre}/ts/getUnitSetting`);
}
//query params:identifier
export async function login(params){
  return post(`${urlpre}/ts/login`,params,false);
}
export async function getTestInfo(params){
  return post(`${urlpre}/ts/getTestInfo`,params,false);
}
export async function getLeaveSeconds(examineeUid){
  return get(`${urlpre}/ts/getLeaveSeconds/${examineeUid}`);
}
//query params:studentAns
export async function saveStudentAns(examineeUid,itemIndex,params){
  return post(`${urlpre}/ts/saveStudentAns/${examineeUid}/${itemIndex}`,params,false);
}
//query params:studentAns
export async function deployPaper(examineeUid,itemIndex,params){
  return post(`${urlpre}/ts/deployPaper/${examineeUid}/${itemIndex}`,params,false);
}
export async function getAvailableTestsForHelp(){
  return get(`${urlpre}/ts/getAvailableTestsForHelp`);
}
export async function sendHelpEvent(testUid,helpEvent){
  return post(`${urlpre}/ts/sendHelpEvent/${testUid}`,helpEvent);
}
export async function getReplyedHelpEvent(helpEventUid){
  return get(`${urlpre}/ts/getReplyedHelpEvent/${helpEventUid}`);
}
