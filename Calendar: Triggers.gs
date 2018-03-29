function calendar_checkDeadlines_TEST_AS_BOB() {
  config.debugEmail = 'bob+ccn@rupholdt.com';
  calendar_checkDeadlines()
}
function calendar_checkDeadlines() {
  //check event date vs deadlines, send notifications at
  //three days before deadline, 1 day before deadline and day after deadline
  var ss = SpreadsheetApp.openById(config.files.eventsCalendar);
  var spreadsheetUrl = ss.getUrl();
  var sheet = ss.getSheetByName(config.eventsCalendar.dataSheetName);
  var values = sheet.getDataRange().getValues();
  var tiers = ['GOLD','SILVER','BRONZE'];
  var tierDeadlines = {BRONZE:8, SILVER:9, GOLD:10};//column number for matching promo type
  var staffDataRange = SpreadsheetApp.openById(config.files.staffData).getDataRange()
  var staff = calendar_getStaff();//get all staff memebers
  var teamLeads = staff.filter(function(i){return i.isTeamLeader})//remove non-team leaders
  var teams = teamLeads.reduce(function (out, cur) {
    if(cur.isTeamLeader) out[cur.team] = {name:cur.name,email:cur.email};
    return out;
  },{});
  var today = getMidnight();//midnight, duh
  
  
  //if(config.debugEmail) today = new Date(today.setDate(today.getDate()-2))//debug to check past dates
  if(config.debugEmail) log('For date: '+fDate(today))
  
  
  for(var row=sheet.getFrozenRows(); row<values.length; row++) {
    var promoRequested = values[row][6].toLowerCase() == 'no' ? false : true;//possble values yes, no, n/a - only process if 'no'
    if(promoRequested) continue;//already requested (yes) or not needed (n/a), no need to continue
    
    //check each tier for a deadline match
    for(var t=0; t<tiers.length; t++){
      //bad form, the next bit assumes there really is a date in the columns that should never have anything but a date in them
      var promoType = tiers[t];
      var promoDeadline = values[row][tierDeadlines[promoType]];
      var dateDiffInDays = DateDiff.inDays(today, promoDeadline);
      if([-1,1,3].indexOf(dateDiffInDays) > -1){
        if(config.debugEmail) log('Row: '+(row+1)+' - '+promoType+' '+dateDiffInDays)//log days that match
        break;//matching tier found (there can only be one), stop checking and continue to send email 
      }
      //      if(config.debugEmail) log((row+1)+' - '+values[row][6]+' '+dateDiffInDays);continue//log the non-matching days too
    }//end for(tiers)



    
//    if(config.debugEmail) continue;//end for(rows) - don't send email, just log matches



    
    var eventDate      = values[row][3];
    var eventName      = values[row][4];
    var staffSponsor   = values[row][7];//this is the sponsoring team, not the person
    
    var to = teams && teams[staffSponsor] && teams[staffSponsor].email;
    var toName = teams && teams[staffSponsor] && teams[staffSponsor].name;
    to = to || vLookup('Communications Director', staffDataRange, 4, 8);///should make a function for this like getCommunicationsDirector()
    toName = toName || vLookup('Communications Director', staffDataRange, 4, 0);
    
    switch(dateDiffInDays){
        
      case -1: //one day past final (Bronze) deadline - sent to communications director - they've just missed the last chance for any promotion
        sheet.getRange(row+1, 7).setValue('N/A');//col 7 = PROMO REQUESTED
        calendar_updateEventStatus(row+1);
        var staffRange = SpreadsheetApp.openById(config.files.staffData).getDataRange();
        to = vLookup('Communications Director', staffRange, 4, 8);
        subject = config.eventsCalendar.emails.expired.subject;
        body = config.eventsCalendar.emails.expired.body;
        break;
        
      case 1: //day before promoType deadline - sent to team leader
        subject = Utilities.formatString(config.eventsCalendar.emails.oneDay.subject, promoType, eventDate, eventName);;
        body = config.eventsCalendar.emails.oneDay.body;
        break;
        
      case 3: //3 days before promoType deadline
        subject = Utilities.formatString(config.eventsCalendar.emails.threeDays.subject, promoType, eventDate, eventName);;
        body = config.eventsCalendar.emails.threeDays.body;
        break;
        
      default: 
        continue;//skip record for all other values
    }
    
    body = body
    .replace(/{recipient}/g,      toName )
    .replace(/{staffSponsor}/g,   staffSponsor )
    .replace(/{eventDate}/g,      fDate(eventDate) )
    .replace(/{eventName}/g,      eventName )
    .replace(/{promoType}/g,      promoType )
    .replace(/{promoDeadline}/g,  fDate(promoDeadline) )
    .replace(/{spreadsheetUrl}/g, spreadsheetUrl )
    .replace(/{formUrl}/g,        config.eventsCalendar.promoFormUrl )
    ;

    
    if(config.debugEmail) subject = '[ '+(row+1)+' ] '+subject    
    if(config.debugEmail) log('Email sent for '+subject)    


    
    MailApp.sendEmail({
      name: config.eventsCalendar.notifyFromName,
      to: config.debugEmail || to,
      subject: subject,
      htmlBody: body
    });
    
    
  }
}




















function onEdit_eventsCalendar(e) {
  //  log('onEdit_eventsCalendar')
  var range = e.range;//var range = SpreadsheetApp.getActive().getRange(a1Notation)
  
  //check for exit conditions
  var sheet = range.getSheet();
  if(sheet.getName() != config.eventsCalendar.dataSheetName) return;//only run on dataSheetName
  var col = range.getColumn();
  var width = range.getWidth();
  var colsInRange = Array.apply(null, Array(width)).map(function(c,i){return col+i;});//return array of col numbers across range like [2,3,4]
  if( colsInRange.indexOf(6) <0 && colsInRange.indexOf(7) <0 ) return;//edit was not in a column we are watching, skedaddle
  
  //ok, we're good to go
  var row = range.getRow();
  var height = range.getHeight();
  var data = sheet.getRange(row, 1, height, sheet.getLastColumn()).getValues();
  
  for(var r in data){//handle multi-row edits (like paste or move)
    var onWebCal = data[r][6-1].toUpperCase();
    var promoRequested = data[r][7-1].toUpperCase();
    if(onWebCal=="N/A" && promoRequested=="N/A"){
      var promoTypeRange = sheet.getRange(row+parseInt(r),3);
      promoTypeRange.setValue('N/A');//Promo Type
      blinkRange(promoTypeRange);
    }
  }
  
}

function calendar_dailyTrigger(){
  calendar_formatSheet();
  calendar_checkDeadlines();//run this before calendar_checkTeamSheetsForErrors() in case it affects the other sheets (don't know that it does)
  if(new Date().getDay() == 1)//only run on Mondays
    calendar_checkTeamSheetsForErrors();
}

function calendar_checkTeamSheetsForErrors() {//triggered
  //get staff
  //for each team leader
  //check the team sheet for errors in column C
  //notify person on sheet and cc team leader (if event owner)
  var ss = SpreadsheetApp.openById(config.files.eventsCalendar);
  var staff = calendar_getStaff();//get all staff memebers
  var teamLeads = staff.filter(function(i){return i.isTeamLeader})//remove non-team leaders
  for(var t in teamLeads){
    var team = teamLeads[t].team;
    var sheet = ss.getSheetByName(team);
    if( ! sheet){
      //oops!  This should not be. CHAD! We gots us a problem . . .
      MailApp.sendEmail({
        to       : config.errorNotificationEmail.join(','),
        subject  : Utilities.formatString('Error in %s on %s', ss.getName(), fDate()),
        htmlBody : Utilities.formatString('Unable to find sheet "%s" in <a href="%s">%s</a> for Team Lead "%s <%s>"', 
                                          team, ss.getUrl(), ss.getName(), teamLeads[t].name, teamLeads[t].email)
      })
      continue;
    }
    
    //sheet found, get data and check for errors
    var data = sheet.getDataRange().getValues();
    for(var row in data) {
      var promoRequested = data[row][2];
      if(promoRequested.toLowerCase() != "error") continue;//all good, next row please
      
      //else, let team leader know about the error
      var to = teamLeads[t].email;
      var sheetUrl = ss.getUrl() + "#gid=" + sheet.getSheetId();
      var subject = "Action required!";
      var body = Utilities.formatString("\
%s Leader:<br><br>One or more of the events on your team's Event Sponsorship Page contains incorrect or incomplete information. PROMOTION WILL NOT BE SCHEDULED FOR YOUR TEAM'S EVENT UNLESS YOU TAKE ACTION. Please visit your team's <a href='\
%s'>Event Sponsorship Page</a>, find the row(s) highlighted in red, and follow the instructions in the 'Promotion Status' column.<br><br>CCN Communications\
", team, sheetUrl);
      
      MailApp.sendEmail({
        name     : 'communications@ccnash.org',
        to       : to,
        subject  : subject,
        htmlBody : body
      });
    }//next row
  }//next teamlead    
}

