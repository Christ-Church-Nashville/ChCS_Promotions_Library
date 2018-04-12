function fDate_LOCAL(date, format){ 
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'MM.dd')
}

/**
 * Check event date vs deadlines, send notifications at
 * three days before deadline, 1 day before deadline and day after deadline
 */

function calendar_checkDeadlines() {

  var ss = getBoundDocument();
  var spreadsheetUrl = ss.getUrl();
  var sheet = ss.getSheetByName(config.eventsCalendar.dataSheetName);
  var values = sheet.getDataRange().getValues();
  var TIERS = ['Gold','Silver','Bronze'];
  var TIER_DEADLINES = {Bronze: 8, Silver: 9, Gold: 10}; // column number for matching promo type
  
  // Get the staff data
  // ------------------
  
  var staffDataRange = SpreadsheetApp.openById(config.files.staffData).getDataRange();
  var staff = calendar_getStaff();
  
  //remove non-team leaders
  var teamLeads = staff.filter(function(i) {
    return i.isTeamLeader;
  })
  
  var teams = teamLeads.reduce(function (out, cur) {
    if (cur.isTeamLeader) {    
      out[cur.team] = {
        name:cur.name,
        email:cur.email
      };
    }
    return out;
  }, {});
  
  // Check each row
  // --------------
  
  var today = getMidnight();
  var startRowIndex = sheet.getFrozenRows();
  var numberOfRows = values.length;
//  var numberOfRows = 5;

  for (var rowIndex = startRowIndex; rowIndex < numberOfRows; rowIndex++) {
  
    var rowNumber = rowIndex + 1;
  
    //possble values: "yes", "no", "n/a", "error". Only process if 'no'
    
    var promoRequested = values[rowIndex][6].toLowerCase()
    
    if (promoRequested !== 'no') {
      bblogFine('promoRequested not "no", skip this row: ' + promoRequested + ' (' + rowNumber + ')')
      continue; 
    }
    
    // Check each tier for a deadline match
    // ------------------------------------
    
    for (var tiersIndex = 0; tiersIndex < TIERS.length; tiersIndex++) {
    
      var promoType      = TIERS[tiersIndex];
      var promoIndex     = TIER_DEADLINES[promoType];
      var promoDeadline  = values[rowIndex][promoIndex];
      
      bblogFine('rowNumber: ' + rowNumber + '/' + promoType)
      
      if (!(promoDeadline instanceof Date)) {
        bblogFine('promodeadline not date, skip this tier: ' + promoDeadline)
        continue;
      }
      
      var dateDiffInDays = DateDiff.inDays(today, promoDeadline);
      
      //if the data difference is not -1, 1 or 3 then move onto the next tier
      if ([-1, 1, 3].indexOf(dateDiffInDays) === -1) {
        bblogFine('dateDiffInDays ignored, skip this tier: ' + dateDiffInDays)      
        continue;
      }
        
      if (dateDiffInDays === -1 && promoType !== 'Bronze') {
        bblogFine('-1 dateDiffInDays ignored as not Bronze: ' + dateDiffInDays)            
        continue;
      }
      
      sendEmail();
            
    } // for each tier
    
  } // for each row
  
  return
  
  // Private Functions
  // -----------------
  
  function sendEmail() {
  
    // The is a large difference between the deadlines for the tiers so only one email per day will
    // ever get sent as only one deadline will match
  
    var eventDate      = values[rowIndex][3];
    var eventName      = values[rowIndex][4];
    var staffSponsor   = values[rowIndex][7];//this is the sponsoring team, not the person
    
    var to = teams && teams[staffSponsor] && teams[staffSponsor].email;
    to = to || vLookup('Communications Director', staffDataRange, 4, 8);//should make a function for this like getCommunicationsDirector()
        
    var toName = teams && teams[staffSponsor] && teams[staffSponsor].name;
    toName = toName || vLookup('Communications Director', staffDataRange, 4, 0);
    
    var body = '';
    var subject = '';
    
    bblogInfo('dateDiffInDays: ' + dateDiffInDays + ' (' + rowNumber + ')');
    
    switch (dateDiffInDays) {
        
      case -1: //one day past final (Bronze) deadline - sent to communications director - they've just missed the last chance for any promotion
      
        sheet.getRange(rowNumber, 7).setValue('N/A');//col 7 = PROMO REQUESTED
//        calendar_updateEventStatus(rowNumber);
        var staffRange = SpreadsheetApp.openById(config.files.staffData).getDataRange();
        to = vLookup('Communications Director', staffRange, 4, 8);
        subject = config.eventsCalendar.emails.expired.subject;
        body = config.eventsCalendar.emails.expired.body;
        break;
        
      case 1: //day before promoType deadline - sent to team leader
        
        subject = Utilities.formatString(config.eventsCalendar.emails.oneDay.subject, promoType, fDate_LOCAL(eventDate), eventName);;
        body = config.eventsCalendar.emails.oneDay.body;
        break;
        
      case 3: //3 days before promoType deadline
      
        subject = Utilities.formatString(config.eventsCalendar.emails.threeDays.subject, promoType, fDate_LOCAL(eventDate), eventName);;
        body = config.eventsCalendar.emails.threeDays.body;
        break;
        
      default: 
        throw new Error('Bad date difference');
    }
    
    body = body
      .replace(/{recipient}/g,      toName )
      .replace(/{staffSponsor}/g,   staffSponsor )
      .replace(/{eventDate}/g,      fDate_LOCAL(eventDate) )
      .replace(/{eventName}/g,      eventName )
      .replace(/{promoType}/g,      promoType )
      .replace(/{promoDeadline}/g,  Utilities.formatDate(promoDeadline, Session.getScriptTimeZone(), 'E, MMMM d') )
      .replace(/{spreadsheetUrl}/g, spreadsheetUrl )
      .replace(/{formUrl}/g,        config.eventsCalendar.promoFormUrl );  

    MailApp.sendEmail({
      name: config.eventsCalendar.notifyFromName,
      to: to,
      subject: subject,
      htmlBody: body
    });
  
    bblogInfo('Email sent (' + rowNumber + '). Subject: ' + subject + '\nto: ' + to + '\nbody: ' + body); 

  } // calendar_checkDeadlines.sendEmail()
  
} // calendar_checkDeadlines()

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
        subject  : Utilities.formatString('Error in %s on %s', ss.getName(), fDate_LOCAL()),
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

