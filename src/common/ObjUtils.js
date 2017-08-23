export function getPropertyValue(item,property) {
  property = property.replace(/\[(\w+)\]/g, '.$1');//数组处理。
  property = property.replace(/^\./, '');  //去掉开始的点。
  var ps = property.split('.');
  let v=item;
  for(let p of ps){
    v=v[p];
    if(!v){
      return ;
    }
  }
  return v;
}

export function timeForamt(seconds){
  var hours=parseInt(seconds/3600);
  var minutes=parseInt((seconds-3600*hours)/60);
  var ses=seconds-3600*hours-minutes*60;

  return (hours<10?'0':'')+hours+':'+(minutes<10?'0':'')+minutes+':'+(ses<10?'0':'')+ses;

}
// export  function timeForamt(secdons){
//   let timeFormat = '';
//   if(secdons<60){
//     timeFormat='00 : '+'00 : '
//   }else if(secdons<3600){
//     timeFormat='00 : ';
//   }
//
//
//
//   return timeFilter(timeFormat,secdons);;
// }
// function timeFilter(timeFormat,secdons){
//   if (secdons<60){
//     let sec
//     sec = (secdons<10)?'0'+secdons :secdons
//     timeFormat = timeFormat + sec
//     return timeFormat
//   }
//   else if(secdons<3600){
//     let min
//     min = Math.floor(secdons/60)
//     timeFormat = timeFormat + (min<10?'0'+min:min)+ ' : '
//     timeFilter(timeFormat,secdons-min*60)
//   }
//   else{
//     let hour
//     hour = Math.floor(secdons/3600)
//     timeFormat = (hour<10?'0'+hour:hour) + ' : '
//     timeFilter(timeFormat,secdons-hour*3600)
//   }
// }
