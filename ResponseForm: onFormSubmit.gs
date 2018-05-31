/*
IMPORTANT
IMPORTANT
IMPORTANT

Changes to this file require a new version be added
and the library version be updated to match 
on the Promotion Request Form bound script currently residing at
https://script.google.com/macros/d/MIdcfOOQEetqr_DZrJx6nEAKL4B2H1EEm/edit?uiv=2&mid=ACjPJvEI4eHceU8aAd8hsDrJqKFMUIiHSlptaI_rzkcib-XK8hcNmtcLNRb4QNrj67P-Jy4Jc5GYQ0c6N9Zgb2wM412YDljjTl4Wnm3N6k8q_pkPk6J9zek3e3vejQTIn5cQqF_uYr59_Vs

IMPORTANT
IMPORTANT
IMPORTANT
*/

function responseForm_onFormSubmit_TEST() {
  //NOTE: This *simulates* a form submission.  Columns that are not part of the form WILL be passed using this method
  //var dataRange = SpreadsheetApp.getActiveSheet().getDataRange();
  var dataRange = SpreadsheetApp.openById('1TyM-eFeWQN2Im28kPRx7hzANLGO5xw3VhXUQp5OI81s').getDataRange();
  var data = dataRange.getValues();
  var headers = data[0];
  //  for (var row=1; row < data.length; row++) {//all rows - overkill much?
  var row=4;//0-based
  var e = {};
  e.values = data[row].filter(Boolean);//remove blanks
  e.range = dataRange.offset(row,0,1,data[0].length);
  e.namedValues = {};
  // Loop through headers to create namedValues object
  // NOTE: all namedValues are arrays.
  for (var col=0; col<headers.length; col++)
    e.namedValues[headers[col]] = [data[row][col]];
  // Pass the simulated event to onFormSubmit
  responseForm_onFormSubmit(e);
  //}
}

function responseForm_onFormSubmit(e) {
  //hmmm, this calls a function that acts on the entire datasheet, not just the new row.  Bad form but functional as it's fast enough to leave it be for now. 2018-11-28 --Bob
  responseForm_updateEventsPromotionCalendarMatchingEvents(e);
  
  //ignore this...///implement this later?
  //  var lock = LockService.getPublicLock();// Get a public lock on this script
  //  lock.waitLock(60*1000);// Wait for up to 1 minute for other processes to finish.
  //  //do stuff
  //  //do stuff
  //  //do stuff
  //  lock.releaseLock();// Release the lock so that other processes can continue.
}

function responseForm_updateEventsPromotionCalendarMatchingEvents_TEST(){ responseForm_updateEventsPromotionCalendarMatchingEvents(true); }
function responseForm_updateEventsPromotionCalendarMatchingEvents(e) {
  responseForm_getPRFColumns();//populate config.responseForm.columns
  
  //typehint//var e = {};e.namedValues = {};e.range = SpreadsheetApp.getActiveRange();e.triggerUid = '';e.values = [];e.authMode = ScriptApp.AuthMode.CUSTOM_FUNCTION;
  var isTestMode = e===true;
  var isRunFromTrigger = e.triggerUid ? true : false;
  //get response sheet
  var responseSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(config.responseForm.dataSheetName);
  if ( ! responseSheet) throw 'Unable to find sheet named "'+config.responseForm.dataSheetName+'".';
  var responseSheetValues = responseSheet.getDataRange().getValues();
  
  //get CCN Events Promotion Calendar spreadsheet - IT'S S A SHEET, NOT A CALENDAR
  var calendarSS = SpreadsheetApp.openByUrl(config.responseForm.files.promotionCalendarSpreadsheetURL);//leftover from original code
  if ( ! calendarSS) throw 'Unable to find CCN Events Promotion Calendar spreadsheet.  Expected to find it at "'+config.responseForm.files.promotionCalendarSpreadsheetURL+'"';
  var calendarSheet = calendarSS.getSheetByName(config.responseForm.files.promotionCalendarSheetName);///this could be made a config setting
  if ( ! calendarSheet) throw 'Unable to find sheet named "'+config.responseForm.files.promotionCalendarSheetName+'" on '+(calendarSS.getName())+' spreadsheet';
  var calendarValues = calendarSheet.getDataRange().getValues();
  
  var errors = [];
  var warnings = [];
  var recordsFound = [];
  
  for (var i=1; i<responseSheetValues.length; i++){//i==1 to skip header row
    //check for "errors" first
    var eventDate = responseSheetValues[i][config.responseForm.columns.startDate-1];
    if ( ! eventDate){
      errors.push('No event date found, line ' + (i+1) + ' of '+config.responseForm.dataSheetName+' sheet.  Skipping this row.');
      continue;
    }
    if ( ! (eventDate instanceof Date)){
      errors.push('Date ' + eventDate + ' on row ' + (i+1) + ' of '+config.responseForm.dataSheetName+' sheet is not a valid date.  Skipping this row.');
      continue;
    }
    
    var eventTitle = responseSheetValues[i][config.responseForm.columns.title-1].trim();
    if ( ! eventTitle){
      warnings.push('No event title found, line ' + (i+1) + ' of '+config.responseForm.dataSheetName+' sheet.  Skipping this row.');
      continue;
    }
    var eventTitleWords = eventTitle
    .trim()//remove leading and trailing whitespace
    .replace(/[^a-zA-Z\d\s]/g, '')//remove non-alphanumeric characters except whitespace - note: \W allows underscores so don't use it here, not that it's all that likely but still
    .toLowerCase()//for simpler comparison
    .split(/\s+/);//split to array on whitespace (not just space in case there are multiple spaces or tabs or newlines)
    
    //find matching event on calendar sheet
    for (var j=3; j<calendarValues.length; j++){//j=3 skips header rows 0-2 - they aren't frozen and we can't count on them staying set since humans are involved so we just skip three
      //if (calendarValues[j][6] == 'Yes') continue; //ignore if column G has already been labeled YES -- This was here from before. Saving it in case it's needed later. 2018-11-28 --Bob
      
      //check for "errors" first
      var calendarEventDate = calendarValues[j][3];//column 4 is SHORT START DATE
      if ( ! calendarEventDate){
        errors.push('No event date found, line ' + (j+1) + ' of '+config.responseForm.dataSheetName+' sheet.  Skipping this row.');
        continue;
      }
      if (!(calendarEventDate instanceof Date)){
        errors.push('Date ' + calendarEventDate + ' on row ' + (j+1) + ' of '+config.responseForm.dataSheetName+' sheet is not a valid date.  Skipping this row.');
        continue;
      }
      
      var calendarEventTitle = calendarValues[j][4].trim();//column 5 is EVENT TITLE
      if ( ! calendarEventTitle){
        warnings.push('No event title found, line ' + (j+1) + ' of '+config.responseForm.dataSheetName+' sheet.  Skipping this row.');
        continue;
      }
      
      var calendarEventTitleWords = calendarEventTitle
      .trim()//remove leading and trailing whitespace
      .replace(/[^a-zA-Z\d\s]/g, '')//remove non-alphanumeric characters except whitespace - note: \W allows underscores so don't use it here, not that it's all that likely but still
      .toLowerCase()//for simpler comparison
      .split(/\s+/);//split to array on whitespace (not just space in case there are multiple spaces or tabs or newlines)      
      
      //compare eventTitle and calendarEventTitle if dates are within the allowed range
      var dayDiff = DateDiff.inDays(calendarEventDate, eventDate);
      if (dayDiff <= config.responseForm.maxEventDateDiff){
        //compare the longer list to the shorter list
        var shorterList = eventTitleWords.length <= calendarEventTitleWords.length ? eventTitleWords : calendarEventTitleWords;
        var longerList  = eventTitleWords.length <= calendarEventTitleWords.length ? calendarEventTitleWords : eventTitleWords;
        var matches = 0;
        for(var k=0; k<shorterList.length; k++)
          if(longerList.indexOf( shorterList[k] ) > -1)
            matches++;
        
        //        just messin with other ideas
        //        if(matches < 2) continue
        //        var wordsNotInShorterList = shorterList.filter(function(x) { return longerList.indexOf(x) < 0 })
        //        var wordsNotInLongerList = longerList.filter(function(x) { return shorterList.indexOf(x) < 0 })
        //        var diff = arrayDiff(shorterList, longerList);
        //        log('shorterList: '+shorterList);
        //        log('longerList: '+longerList);
        //        log('matches: '+matches);
        //        log('wordsNotInShorterList: '+wordsNotInShorterList);
        //        log('wordsNotInLongerList: '+wordsNotInLongerList);
        //        log('diff: '+diff);
        //        return
        
        var matchPercent = matches / shorterList.length;
        if (matchPercent > config.responseForm.matchThresholdPercent){
          recordsFound.push([
            'Title on this spreadsheet: ' + eventTitle,
            'Title on CCN Events Promotion Calendar: ' + calendarEventTitle,
            'Percent Match: ' + (matchPercent*100) + '% (' + matches + ' out of ' + shorterList.length + ' possible words)',
            'Row on this spreadsheet: ' + (i+1),
            'Row on CCN Events Promotion Calendar: ' + (j+1),
            'Date on this spreadsheet: ' + eventDate,
            'Date on CCN Events Promotion Calendar: ' + calendarEventDate,
            'Date difference (# days): ' + dayDiff
          ]);
          
          if ( ! isTestMode)
            calendarSheet.getRange(j+1,7).setValue('Yes');
          
        }//end matchPercent
      }//end dayDiff
    }//next calendar value
  }//next response sheet value
  
  if( ! isRunFromTrigger){ //build response html only if run manually
    //if 0, No Records; if 1, 1 Record; else n Records - just to be gramatically more preciserer
    var html = '<h1>'+(recordsFound.length==0 ? 'No' : recordsFound.length)+' Matching Record'+(recordsFound.length==1 ? '' : 's')+'</h1>';
    
    if(isTestMode) html += '<h3 style="color:red">TEST MODE - NO CHANGES MADE</h3>'
    
    for (var r in recordsFound){
      for (var rr in recordsFound[i])
        html += recordsFound[r][rr] + '<br>';
      html += '<br>';
    }
    
    if(warnings.length){
      html += '<h2>Warnings</h2><br>';
      for (var w in warnings)
        html += warnings[w] + '<br>';
    }
    
    if(errors.length){
      html += '<h2>Errors</h2><br>';
      for (var err in errors)
        html += errors[err] + '<br>';
    }
  }
  //show response
  var modal = HtmlService.createHtmlOutput(html).setWidth(800).setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(modal, 'Results');
}

function responseForm_getPRFColumns(){
  var ss = SpreadsheetApp.openById(config.files.responseForm);
  var responseSheet = ss.getSheetByName(config.responseForm.dataSheetName);
  if ( ! responseSheet) throw 'Unable to find sheet named "'+config.responseForm.dataSheetName+'".';
  
  //  var responseSheetValues = responseSheet.getDataRange().getValues();
  //  var headers = responseSheetValues.shift()
  //  log(headers)
  
  //  for(var col=1;col<responseSheet.getLastColumn();col++){
  //    var cell = responseSheet.getRange(1, col)
  //    log(cell.getValue())
  //  }
  
  var namedRanges = ss.getNamedRanges();
  var cols = {};
  for (var n in namedRanges){
    var namedRange = namedRanges[n];
    if(namedRange.getRange().getRow()==2){
      cols[namedRange.getName()] = namedRange.getRange().getColumn()
    }
  }
  
  //now assign them to existing config vars
  config.responseForm.columns.cost                  = cols.EventCost;
  config.responseForm.columns.email                 = cols.Email;
  config.responseForm.columns.endDate               = cols.EventEnd;
  config.responseForm.columns.eventAbout            = cols.WhatIsThisEventAbout;
  config.responseForm.columns.eventFor              = cols.EventFor;
  config.responseForm.columns.location              = cols.EventLocation;
  config.responseForm.columns.name                  = cols.Name;
//  config.responseForm.columns.registration          = cols.RegistrationType;//old code - use RegistrationType now
  config.responseForm.columns.registrationType      = cols.RegistrationType;
  config.responseForm.columns.registrationLocation  = cols.RegistrationLocation; 
  config.responseForm.columns.registrationDeadline  = cols.RegistrationDeadline; 
  config.responseForm.columns.startDate             = cols.EventStart;
  config.responseForm.columns.timestamp             = cols.Timestamp;//or cols.DateSubmitted;
  config.responseForm.columns.title                 = cols.EventTitle;
  config.responseForm.columns.update                = cols.Update;
  config.responseForm.columns.tier                  = cols.SelectedTier;//will likely need this added somewhere. not used yet
//  config.responseForm.columns.dateDue               = cols.DateDue;
  //  config.responseForm.columns.daysDiffDeadline      = cols.DaysDiffDeadline;
  //  config.responseForm.columns.publicityNotes        = cols.OtherNotesForPublicity;
  //  config.responseForm.columns.requestedAssets       = cols.RequestedAssets;
  config.responseForm.columns.shortStartDate        = cols.ShortStartDate;

  //  log(config.responseForm.columns);
}

