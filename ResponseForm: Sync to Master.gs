//function responseForm_syncToMaster(range){//range should be one or more full rows
//  //log('--responseForm_syncToMaster('+range.getA1Notation()+')')
//  responseForm_getPRFColumns();//populate config.responseForm.columns
//  var values = range.getValues()[0];
//  if(! values.length) throw 'Missing data';
//  
//  var eventDate = values[config.responseForm.columns.startDate -1];//EVENT START DATE / TIME
//  var shortDate = Utilities.formatDate(eventDate, 0, "MM.dd");
//  var formatedStringDate = getFormatedDateForEvent(eventDate);
//  //  var rowNumberToWork = Utilities.formatString("| %s %s |", config.responseForm.rowPrefix, range.getRow());
//  var rowNumberToWork = Utilities.formatString("Row %s", range.getRow());
//  
//  var makePara = Utilities.formatString(
//    //'[ EVENT TITLE | Gold Row 4 | YOUR NAME ] 03.11; WHAT IS THIS EVENT ALL ABOUT?\\n >> Sunday, March 11 at 5:00pm at EVENT LOCATION; Register by EVENT REGISTRATION; Cost is EVENT COST'
//    '[ %s | %s | %s ] %s; %s\n >> %s at %s; Register by %s; Cost is %s', 
//    values[config.responseForm.columns.title -1] || 'x',//Barefoot Republic
//    rowNumberToWork,//Row 3
//    values[config.responseForm.columns.name -1] || '?',//Chad Barlow
//    shortDate || 'x',//Mon Jun 18 2018 09:00:00 GMT-0400 (EDT); 
//    values[config.responseForm.columns.eventAbout -1] || 'x',//We are excited to announce that...
//    formatedStringDate || 'x',//06.18
//    values[config.responseForm.columns.location -1] || 'x',//Christ Church campus
//    values[config.responseForm.columns.RegistrationType -1] || 'None',//Register by x
//    values[config.responseForm.columns.cost -1] || 'Free'//Cost is 250
//  );
//  //[ Barefoot Republic  | Row 3 | Chad Barlow ] 06.18; We are excited to announce that our church is participating in Barefoot Republic kids camp this June! This is a multicultural kids summer camp that facilitates Christ-centered relationships among kids of different racial, cultural, and economic backgrounds. >> Monday, June 18 at 1:00pm at Christ Church campus; Register by None; Cost is 250
//  
//  var makeParaForSunday = Utilities.formatString(
//    //'[ EVENT TITLE | Row 4 | YOUR NAME ] 03.11;'
//    '[ %s | %s | %s ] %s;',
//    values[config.responseForm.columns.title-1], rowNumberToWork, values[config.responseForm.columns.name-1], shortDate
//  );
//  
//  //get event dates
//  //promoStartDate is the latter of the earliest start date and the eventPromoStartDate (calcuated from the config.responseForm.deadline weeks)
//  var eventPromoStartDate = dateAdd(getUpcomingSunday(eventDate), 'week', -1 * config.responseForm.deadline[values[config.responseForm.columns.tier-1].toUpperCase()])//cryptic much?
//  var minimumPromoStartDate = dateAdd(getUpcomingSunday(new Date()), 'week', 3);//3 weeks from Sunday
//  var promoStartDate = eventPromoStartDate.getTime() < minimumPromoStartDate.getTime()
//  ? minimumPromoStartDate
//  : eventPromoStartDate;
//  var promoEndDate = dateAdd(getUpcomingSunday(eventDate), 'week', -1)
//
//  var stringFromFind = fDate(promoStartDate, "'[' MM.dd '] Sunday Announcements'");
//  var stringToFind   = fDate(promoEndDate,   "'[' MM.dd '] Sunday Announcements'");
//  //  log('stringFromFind: '+stringFromFind)
//  //  log('stringToFind: '+stringToFind)
//  var location = values[config.responseForm.columns.location-1];
//  var rowNumber = range.getRow();
//  
//  //simplified - responseForm_addEventToMaster(promoStartDate, promoEndDate, stringToFind, stringFromFind, makePara, makeParaForSunday, shortDate, location, rowNumber);
//  responseForm_addEventToMaster(stringToFind, stringFromFind, makePara, makeParaForSunday, rowNumber);
//}
//
//function responseForm_addEventToMaster_TEST(){
//  responseForm_addEventToMaster(
//    "[ 06.17 ] Sunday Announcements","[ 05.13 ] Sunday Announcements",
//    "[ Barefoot Republic  | Row 3 | Chad Barlow ] 06.18; We are excited to announce that our church is participating in Barefoot Republic kids camp this June! This is a multicultural kids summer camp that facilitates Christ-centered relationships among kids of different racial, cultural, and economic backgrounds. \
//>> Monday, June 18 at 1:00pm at Christ Church campus; Register by None; Cost is 250",
//    "[ Barefoot Republic  | Row 3 | Chad Barlow ] 06.18;",
//    3);
//}
////function responseForm_addEventToMaster(promoStartDate, promoEndDate, stringToFind, stringFromFind, makePara, makeParaForSunday, shortDate, location, rowNumber){
//function responseForm_addEventToMaster(stringToFind, stringFromFind, makePara, makeParaForSunday, rowNumber){
//  /*
//  IMPORTANT: If Master does not have pages for the event date in question, the event is skipped.
//  */
//  var body = getMasterBody();//var body = DocumentApp.openById(id).getBody()
//  var fromOffset, toOffset;
//  
//  //remove existing paragraph if found
//  //  config.responseForm.rowPrefix = config.responseForm.rowPrefix || 'Gold Row'///no more tier name, just row
//  var searchText = Utilities.formatString("\\| Row %s \\|", rowNumber);//like: "| Row 4 |"
//  responseForm_removeFromMaster(searchText);//removes any paragraph with the matching row identifier (the searchtext)
//  
//  //Master is in reverse order thus fromOffset > toOffset (when from and to are date-centric)
//  var fromOffset = searchInMaster(stringFromFind);//last match in document order, last in date sequence
//  var toOffset   = searchInMaster(stringToFind);//first match in document order, first in date sequence
//  //body.getChild(fromOffset).setAttributes({BACKGROUND_COLOR:'#ff0000'});return;///debug
//  
//  if( ! (fromOffset && toOffset)){
//    var missing = !(fromOffset && toOffset) ? 'fromOffset & toOffset' 
//    : fromOffset ? 'toOffset' : 'fromOffset';
//    write( Utilities.formatString('Unable to add event.  Missing %s.\nfromOffset: %s - toOffset: %s', 
//                                  missing, (fromOffset || 'missing'), (toOffset || 'missing')) );
//    return;
//  }
//   
//  //add event to all pages between fromOffset and toOffset
//  for(var x=toOffset; x<fromOffset+1; x++){
//    var elem = body.getChild(x);
//    if( elem.asText().getText().match(/^\[ *\d{2}\.\d{2} *]/) ){//found page start
//      //elem.setAttributes({BACKGROUND_COLOR:'#ff00ff'})//highlight page title - purple
//      var firstPara = body.getChild(x+2);//+1 for hrule, +1 for nth Sunday
//      //firstPara.setAttributes({BACKGROUND_COLOR:'#00ffff'});//highlight elem to insert before
//      var para = x==fromOffset ? makePara : makeParaForSunday;//use long version on last entry (which is the first match)
//      body
//      .insertParagraph((x+3), para)//+1 for hrule, +1 for nth Sunday, +1 more, erm, because (maybe for itself like a 0-based element?)
//      .setAttributes(config.responseForm.format.current);
//      //.setAttributes({BACKGROUND_COLOR:'#00ffff'});///debug - cyan
//      fromOffset++;
//    }
//    
//  }
//  
//}
//
//function responseForm_syncRowToMaster(){
////  log('--responseForm_syncRowToMaster')
//  responseForm_getPRFColumns();//populate config.responseForm.columns
//  var activeRange = SpreadsheetApp.getActiveRange();
//  var sheet = activeRange.getSheet();
//  var range = sheet.getRange(activeRange.getRow(), 1, 1, sheet.getLastColumn());
//  
//  if(sheet.getName() !== config.responseForm.dataSheetName){
//    SpreadsheetApp.getActive().getSheetByName(config.responseForm.dataSheetName).activate();
//    SpreadsheetApp.flush();//display the correct sheet first
//    Browser.msgBox('Sync to Master', 'This only works from the "'+config.responseForm.dataSheetName+'" sheet.', Browser.Buttons.OK)
//    return;
//  }
//  
//  if( range.getRow() <= sheet.getFrozenRows() || range.getValues()[0][0]=='' ){
//    Browser.msgBox('Sync to Master', "Select a cell or row with an event and try again.", Browser.Buttons.OK)
//    return;
//  }
//  
//  if(activeRange.getHeight()>1) {
//    Browser.msgBox('Sync to Master', "Can not process multiple rows with this option.\\nSelect a single cell or row and try again.", Browser.Buttons.OK)
//    return;
//  }
//  
////  log(config.responseForm.columns);return
////  {"cost":13,"endDate":11,"eventAbout":18,"location":12,"name":6,"registration":14,"startDate":9,"timestamp":1,"title":10}
//  
//  range.offset(0, config.responseForm.columns.update-1, 1, 1).setValue(null);//clear the update field
//  //  var values = range.getValues()[0];
//  //  responseForm_syncToMaster(values);
//  
//  responseForm_syncToMaster(range);
//}
//
//function responseForm_syncAllToMaster(){
//  //log('--responseForm_syncAllToMaster')
//  responseForm_getPRFColumns();//populate config.responseForm.columns
//  var sheet = SpreadsheetApp.getActiveSheet();
//  if(sheet.getName() !== config.responseForm.dataSheetName){
//    SpreadsheetApp.getActive().getSheetByName(config.responseForm.dataSheetName).activate();
//    SpreadsheetApp.flush();//display the correct sheet first
//    Browser.msgBox('Sync to Master', 'This only works from the "'+config.responseForm.dataSheetName+'" sheet.', Browser.Buttons.OK)
//    return;
//  }
//  
//  var values = sheet.getDataRange().getValues();
//  
//  for(var v in values){
//    if(v+1 <= sheet.getFrozenRows()) continue;//skip headers
//    var rowRange = sheet.getRange((parseInt(v)+1), 1, 1, sheet.getLastColumn())
//    var action = values[v][config.responseForm.columns.update-1];
//    
//    //provide visual evidence of progress
//    rowRange.setBorder(true, true, true, true, false, false, '#ffdd00', SpreadsheetApp.BorderStyle.SOLID_THICK);
//    SpreadsheetApp.flush();
//    Utilities.sleep(300);//visual pause
//    
//    switch(action){
//      case '➕': responseForm_syncToMaster(rowRange); break;
//      case '❎': 
//        //        if( ! config.responseForm.rowPrefix) throw 'Missing config.responseForm.rowPrefix'
//        var text = Utilities.formatString("\\| Row %s \\|", rowRange.getRow());
//        responseForm_removeFromMaster(text);
//        break;
//    }
//    
//    rowRange.offset(0, config.responseForm.columns.update-1, 1, 1).setValue(null);//clear the update field
////    rowRange.setBackground(null);//could get current backgrounds and restore them if it's needed
//    rowRange.setBorder(false, false, false, false, false, false);
//    SpreadsheetApp.flush();
//  }
//}
//
//function responseForm_removeFromMaster_TEST(){
//  var row = 3;
//  responseForm_removeFromMaster('\\| Row '+row+' \\|')
//}
//function responseForm_removeFromMaster(text){
////  log('--responseForm_removeFromMaster('+text+')')
//  
//  var body = getMasterBody();//var body = DocumentApp.openById(id).getBody()
//  var searchText = text;
//  log('searchText: '+searchText)
//  var counter = 0;
//  
//  var hit = body.findText(searchText);
//  while (hit != null) {
//    counter++;
//    //    if(config.live) //delete things
//    hit.getElement().getParent().removeFromParent();//sayonara
//    //    else{ //change the highlight color instead
//    //      var color = hit.getElement().getParent().getAttributes()["BACKGROUND_COLOR"] == "#ffff00"
//    //      ? "#ff00ff" : "#ffff00";//toggles between yellow and purple
//    //      hit.getElement().getParent().setAttributes({"BACKGROUND_COLOR":color})
//    //    }
//    
//    hit = body.findText(searchText, hit);//next hit
//  }
//  //  log((config.live?'Removed ':'Highlighted ')+counter+' paragraphs.');
//}
