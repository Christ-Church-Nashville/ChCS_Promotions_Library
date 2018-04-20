function toast(what){
  if(typeof what == 'object') what = JSON.stringify(what);
  SpreadsheetApp.getActive().toast(what);
}

function fDate(date, format){//returns the date formatted with format, default to today if date not provided
  date = date || new Date();
  format = format || "MM/dd/yy";
  return Utilities.formatDate(new Date(date), Session.getScriptTimeZone(), format)
}

function hasTrigger(handlerName){ // Check for a trigger based on the name of the function it excecutes
  var triggers = ScriptApp.getProjectTriggers();
  for (var t=0; t < triggers.length; t++){
    if (triggers[t].getHandlerFunction() == handlerName){ // Found the trigger we're looking for
      return true;
    }
  }
  return false;
}

function deleteTriggerByHandlerName(handlerName){ // Delete a trigger based on the name of the function it excecutes

  var allTriggers = ScriptApp.getProjectTriggers(),
      deleted = false;
      
  for (var i=0; i < allTriggers.length; i++){
    if (allTriggers[i].getHandlerFunction() == handlerName){ // Found the trigger we're looking for
      ScriptApp.deleteTrigger(allTriggers[i]);
      deleted = true;
      //break;//might be more than one, keep looking
    }
  }
  return deleted;
}

function getFormatedDateForEvent(date){
  log( '--getFormatedDateForEvent('+fDate(date)+')' )
  //var formattedDate = Utilities.formatDate(date, 0, "EEEE, MMMM d 'at' h:mma")
  var formattedDate = Utilities.formatDate(date, config.timeZone, "EEEE, MMMM d 'at' h:mma")
  //for compatability with old script output, lowercase the meridiem
  return formattedDate.replace(/[A,P]M$/, function(l){ return l.toLowerCase() });
  //or just //return formattedDate.replace('PM', 'pm').replace('AM', 'am');
}

function getUpcomingSunday_TEST() {
  //these should all be the same date (time will be diff on the default)
  //  log('default: '+fDate(getUpcomingSunday()))
  //  log('not sunday: '+getUpcomingSunday(new Date('2017/11/20')))
  //  log('sunday: '+getUpcomingSunday(new Date('2017/11/19')))
  
  //  log( fDate( getUpcomingSunday(new Date('2017/12/29')) ) )
  //  log( fDate( getUpcomingSunday(new Date('2018/01/01')) ) )
  //  log( fDate( getUpcomingSunday(new Date('2018/01/02')) ) )
  //  log( fDate( getUpcomingSunday(new Date('2018/01/07')) ) )
  
  var date = new Date()
  date.setHours(23,0,0,0);
  log(date)
  log( fDate( getUpcomingSunday(date) ) )
  
}
function getUpcomingSunday(date, skipTodayIfSunday) {
  //return the next Sunday, which might be today
  //skipTodayIfSunday skips this Sunday and returns next week Sunday
  log( '--getUpcomingSunday('+(date ? fDate(date) : 'null')+')' )
  date = new Date(date || new Date());//clone the date so as not to change the original
  date.setHours(0,0,0,0);
  if( skipTodayIfSunday || date.getDay() >0)//if it's not a Sunday...
    date.setDate(date.getDate() -date.getDay() +7);//subtract days to get to Sunday then add a week
  log('upcomingSunday returned: '+fDate(date));
  return date;
}

function assignDeep(target, varArgs) {
  //note: this is destructive to target
  //if you need to retain target, copy it first
  //  log( '--assignDeep(target, varArgs)' )
  //  log( 'assignDeep('+target+', '+varArgs+')' )
  'use strict';
  if (target == null)
    throw new TypeError('Cannot convert undefined or null to object');
  
  var to = Object(target);
  
  for (var i=1; i<arguments.length; i++) {
    var nextSource = arguments[i];
    if (nextSource != null) {
      for (var nextKey in nextSource) {
        // Avoid bugs when hasOwnProperty is shadowed (https://tinyurl.com/y86gpoum)
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          if (typeof to[nextKey] === 'object' 
              && to[nextKey] 
              && typeof nextSource[nextKey] === 'object' 
              && nextSource[nextKey]) {                        
            assignDeep(to[nextKey], nextSource[nextKey]);
          } else {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
  }
  return to;
};

function docReplace_SAMPLE(input, output) {
  var re = new RegExp(output,"g");
  var body = getMasterBody();//  var body = DocumentApp.openById(id).getBody()
  //replace text
  body.replaceText(input, output);
  
  //set bold
  var text = body.getText();
  var index;
  while(true){
    index = re.exec(text)
    if(index == null){break}
    body.editAsText().setBold(index.index, output.length + index.index, true);
  }
}

function searchInMaster(str){//find first occurence of str
  log('--searchInMaster('+str+')')
  str = str.replace(/\[/, '\\[').replace(/\./, '\\.');
  //really should replace all regex reserved chars but we only need find like "[ 04.22 ] Sunday Announcements"
  var body = getMasterBody();//  var body = DocumentApp.openById(id).getBody()
  var fromOffset, toOffset;
  
  var hit = body.findText(str);
  
  return hit 
  ? body.getChildIndex( hit.getElement().getParent() )
  : null;
  
  //old method  
  //  for(var m=0; body.getNumChildren(); m++){
  //    var child = body.getChild(m);
  //    if(child.getType() === DocumentApp.ElementType.PARAGRAPH){
  //      var txt = child.asText().getText();
  //      if(txt.indexOf(str) > -1)
  //        return m;
  //    }
  //  }
}

function getMasterBody(){
  //usage: var body = getMasterBody();//  var body = DocumentApp.openById(id).getBody()
  try{
    var masterDoc = DocumentApp.openById(config.responseForm.files.masterAnnouncementsID);
  }catch(e){
    err('Unable to open Master Announcements file.  Check permissions and be sure it has been set in config.responseForm.files.masterAnnouncementsID')
    throw 'Unable to open Master Announcements file.';
  }
  return masterDoc.getBody();
}

function highlightElementsContaining(text, color){
  //  color = null //remove highlight
  text = text || 'Silver Row 9';///debug
  var body = getMasterBody();//var body = DocumentApp.openById(id).getBody()
  var searchText = '(?i)\\[.* '+text+' .*';//gets the whole paragraph, case insensitive
  var searchText = '.*'+text+'.*';//gets the whole paragraph, case insensitive
  
  var hit = body.findText(searchText);//for testing, case insensitive
  while (hit != null) {
    log(hit.getElement().getParent().getAttributes()["BACKGROUND_COLOR"])
    
    var color = color!==undefined ? color : //allows for explicitly null color but toggle color for undefined
    (hit.getElement().getParent().getAttributes()["BACKGROUND_COLOR"] == "#ffff00"
     ? "#ff00ff" : "#ffff00");//toggles between yellow and purple
    
    hit.getElement().getParent().setAttributes({"BACKGROUND_COLOR":color})
    hit = body.findText(searchText, hit);//next hit
  }
}

function getSundaysBetween_TEST(){
  var sundays = getSundaysBetween(new Date('2017-12-17'), new Date('2018-01-01') ); 
  for(var d in sundays) log( fDate(sundays[d]) )
    }
function getSundaysBetween(fromDate, toDate){
  log('--getSundaysBetween('+(fromDate ? fDate(fromDate) : 'oops')+', '+(toDate ? fDate(toDate) : 'oops')+')')
  if(fromDate > toDate) throw ' Invalid date range: From > To';
  var fromDate = getUpcomingSunday(fromDate);//should already be a Sunday but this makes certain of it
  var tempDate = new Date(fromDate);
  var dates = [];
  while(tempDate <= toDate){
    dates.push(new Date(tempDate));
    tempDate.setDate(tempDate.getDate() + 7);//
  }
  
  return dates;
}

function regexEscape(str) {
  return (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
};

function removeMultipleLineBreaks(element) {
  if (!element) {
    element = DocumentApp.openById('0BwqqMAWnXFBhMiJjM6FZakw9b1k').getBody(); // set document id of merged doc
  }
  var parent = element.getParent();
  // Remove empty paragraphs
  if (element.getType() == DocumentApp.ElementType.PARAGRAPH 
      && element.asParagraph().getText().replace(/\s/g, '') == '') {
    if (!(parent.getType() == DocumentApp.ElementType.BODY_SECTION 
          && parent.getChildIndex(element) == parent.getNumChildren() - 1)) {
      element.removeFromParent();
    }
    // Remove duplicate newlines in text
  } else if (element.getType() == DocumentApp.ElementType.TEXT) {
    var text = element.asText();
    var content = text.getText();
    var matches;
    // Remove duplicate carriage returns within text.
    if (matches = content.match(/\r\s*\r/g)) {
      for (var i = matches.length - 1; i >= 0; i--) {
        var match = matches[i];
        var startIndex = content.lastIndexOf(match);
        var endIndexInclusive = startIndex + match.length - 1;
        text.deleteText(startIndex + 1, endIndexInclusive);
      }
    }
    // Grab the text again.
    content = text.getText();
    // Remove carriage returns at the end of the text.
    if (matches = content.match(/\r\s*$/)) {
      var match = matches[0];
      text.deleteText(content.length - match.length, content.length - 1);
    }
    // Remove carriage returns at the start of the text.
    if (matches = content.match(/^\s*\r/)) {
      var match = matches[0];
      text.deleteText(0, match.length - 1);
    }
    // Recursively look in child elements
  } else if (element.getNumChildren) {
    for (var i = element.getNumChildren() - 1; i >= 0; i--) {
      var child = element.getChild(i);
      removeMultipleLineBreaks(child);
    }
  }
}

function dates_TEST() {
  var d1 = new Date(2018,0,10,0);
  var d2 = new Date(2018,0,11,1);
//  var d = Math.ceil((d2 - d1) / (24 * 3600 * 1000))
  var d = DateDiff.inDays(d1, d2)
  Logger.log(d)
}

var DateDiff = (function(ns) {

  // Get the number of whole days
  ns.inDays = function(d1, d2) {  
    checkParams(d1, d2)    
    return Math.floor((d2 - d1) / (24 * 3600 * 1000))
  }
  
  ns.inWeeks = function(d1, d2) {  
    checkParams(d1, d2)        
    return parseInt((d2 - d1)/(24 * 3600 * 1000 * 7));
  }
  
  ns.inMonths = function(d1, d2) {
  
    checkParams(d1, d2)    
    
    var d1Y = d1.getFullYear();
    var d2Y = d2.getFullYear();
    var d1M = d1.getMonth();
    var d2M = d2.getMonth();
    
    return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
  }
  
  inYears: function(d1, d2) {
    checkParams(d1, d2)    
    return d2.getFullYear() - d1.getFullYear();
  }
  
  function checkParams(d1, d2) {
    if (!(d1 instanceof Date) || !(d2 instanceof Date)) {
      throw new Error('DateDiff - bad args. d1: ' + d1 + ', d2:' + d2)
    }
  }
  
  return ns;
  
})(DateDiff || {})

function arrayDiff(arr1, arr2) {
  var newArr = arr1.concat(arr2);
  function check(item){ if (arr1.indexOf(item) === -1 || arr2.indexOf(item) === -1) return item; }
  return newArr.filter(check);
}

/**
* Add time to a date in specified interval
* Negative values work as well
*
* @param {date} javascript datetime object
* @param {interval} text interval name [year|quarter|month|week|day|hour|minute|second]
* @param {units} integer units of interval to add to date
* @return {date object} 
*/
function dateAdd(date, interval, units) {
  date = new Date(date); //don't change original date
  switch(interval.toLowerCase()) {
    case 'year'   :  date.setFullYear(date.getFullYear() + units);            break;
    case 'quarter':  date.setMonth   (date.getMonth()    + units*3);          break;
    case 'month'  :  date.setMonth   (date.getMonth()    + units);            break;
    case 'week'   :  date.setDate    (date.getDate()     + units*7);          break;
    case 'day'    :  date.setDate    (date.getDate()     + units);            break;
    case 'hour'   :  date.setTime    (date.getTime()     + units*60*60*1000); break;
    case 'minute' :  date.setTime    (date.getTime()     + units*60*1000);    break;
    case 'second' :  date.setTime    (date.getTime()     + units*1000);       break;
    default       :  date = undefined; break;
  }
  return date;
}

function dateDiff(metric, fromDate, toDate) {	
  metric = metric.toLowerCase();	
  var time = toDate - fromDate;	
  var interval = {
    weeks:604800000, week:604800000, w:604800000, 
    days:86400000,   day:86400000,   d:86400000, 
    hours:3600000,   hour:3600000,   h:3600000, 
    minutes:60000,   minute:60000,   n:60000, 
    seconds:1000,    second:1000,    s:1000,
  };
  
  return Math.floor( time/interval[metric]);
}

function deleteEmptyRowsInData(sheet){
  //sheet = sheet || SpreadsheetApp.getActiveSheet()
  var values = sheet.getDataRange().getValues();
  var newValues = [];
  for( n=0; n<values.length; ++n )
    if(values[n].join().replace(/,/g,'')){ newValues.push(values[n]) };
  sheet.getDataRange().clear();
  sheet.getRange(1,1,newValues.length,newValues[0].length).setValues(newValues);
}

function removeExtraRows(sheet){
  //sheet = sheet || SpreadsheetApp.getActiveSheet()
  var maxRows = sheet.getMaxRows();
  //var lastRow = sheet.getLastRow();//does not work with arrayformula
  var lastRow = getLastPopulatedRow(sheet);
  if (maxRows-lastRow > 0)
    sheet.deleteRows(lastRow+1, maxRows-lastRow);
}

function removeExtraColumns(sheet){
  //note: this method does not work when arrayformula extends to end of sheet
  //sheet = sheet || SpreadsheetApp.getActiveSheet()
  var maxColumns = sheet.getMaxColumns();
  //var lastColumn = sheet.getLastColumn();//does not work with arrayformula
  var lastColumn = getLastPopulatedColumn(sheet);
  if (maxColumns-lastColumn > 0)
    sheet.deleteColumns(lastColumn+1, maxColumns-lastColumn);
}

function getLastPopulatedRow(sheet) {
  var values = sheet.getDataRange().getValues();
  for (var i=values.length-1; i>0; i--)
    if(values[i].join('').length) return ++i;
  return 0; // or 1 depending on your needs
}

function getLastPopulatedColumn(sheet) {
  var values = sheet.getDataRange().getValues();
  values = Object.keys(values[0]).map(function(c) { return values.map(function(r) { return r[c]; }); });//transpose cols to rows
  for (var i=values.length-1; i>0; i--)
    if(values[i].join('').length) return ++i;
  return 0; // or 1 depending on your needs
}

function vLookup(needle, range, searchOffset, returnOffset){
  if (typeof searchOffset == 'undefined') searchOffset = 0;// what column to search, default to first
  if (typeof returnOffset == 'undefined') returnOffset = 1;// what column to return, default to second
  var haystack = range.getValues();
  for(var i=0; i<haystack.length; i++) {
    if(haystack[i][searchOffset] && haystack[i][searchOffset].toLowerCase() == needle.toLowerCase()) {
      return haystack[i][returnOffset];
    }
  }
}

function getMidnight(date){
  date = date || new Date();//set default today if not provided
  date = new Date(date);//don't change original date
  date.setHours(0,0,0,0);//set time to midnight
  return date;
}

function getIdFromUrl(url) {
  return url.match(/[-\w]{25,}/)[0];//this one *might* give false positives and google might changes things too but it works even if the user only gives you the ID thus is preferred by moi
  return url.match(/\/d\/(.{25,})\//)[1];//this is great for files but doesn't work for all google urls
}

function getSundayOfMonthOrdinal(date) {
  var dayOfMonth = date.getDate();
  var ordinals = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
  return ordinals[Math.floor(dayOfMonth / 7)];
}

function isOwner(file){
  file = file
  || (SpreadsheetApp && SpreadsheetApp.getActiveSpreadsheet())
  || (DocumentApp && DocumentApp.getActiveDocument());
  
  if( ! file) return false;
  return file.getOwner().getEmail() == Session.getActiveUser().getEmail();
}

function getBoundDocument(){
  return (SpreadsheetApp && SpreadsheetApp.getActive())
  || (DocumentApp && DocumentApp.getActiveDocument())
  || null;
}

function listFileRevisions(file){//enable the Drive SDK
  /*
  This was an attempt to restore from a revision, however, the Drive API can not manipulate revs on GSuite files, only list them
  */
  file = file || getBoundDocument();
  var revisions = Drive.Revisions.list(file.getId());
  if (revisions.items && revisions.items.length > 0) {
    for (var i in revisions.items) {
      var revision = revisions.items[i];
      var date = new Date(revision.modifiedDate); 
      Logger.log('ID: %s, Date: %s', revision.id, date.toLocaleString());
    }
  } else {
    Logger.log('No revisions found.');
  }
}

function escapeGasRegExString_TEST(){ log(escapeGasRegExString(/{[te|st]}/g, '1123'.split(''), '1{'.split(''))) }
function escapeGasRegExString(re, escapeCharsArrOpt, ignoreCharsArrOpt){
  
  var charsToReplace = '{[|';

  charsToReplace = charsToReplace.split('');
  if(escapeCharsArrOpt)//add user supplied values
    charsToReplace = charsToReplace.concat(escapeCharsArrOpt);
  if(ignoreCharsArrOpt)//remove user supplied values
    charsToReplace = charsToReplace
    .filter(function(e){return this.toString().indexOf(e)<0;}, ignoreCharsArrOpt);
  
  var str = re.toString()
  .replace(/^\//,'')//remove opening /
  .replace(/\/[imgus]*$/,'');//remove closing / and any flags

  log(charsToReplace)
  for(var c in charsToReplace){
    Logger.log(charsToReplace[c])
    Logger.log( new RegExp(charsToReplace[c].replace('\[','\\['),'g').toString() )
//    str = str.replace(new RegExp(charsToReplace[c].replace('\[','\\['),'g'), '\\$&')
    str = str.replace(charsToReplace[c], '\\$&')
  }
  
  return str;
}









