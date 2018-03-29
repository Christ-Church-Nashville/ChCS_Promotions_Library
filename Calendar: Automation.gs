function calendar_disableAutomation() {
  var owner = SpreadsheetApp.getActive().getOwner().getEmail();
  var user = Session.getActiveUser().getEmail();
  if( user != owner){
    Browser.msgBox('Disable Automation', "Sorry.  Automation can only be disabled by the sheet owner.\\nPlease ask "+owner+" to run this.", Browser.Buttons.OK);
    return;
  }

  deleteTriggerByHandlerName('calendar_dailyTrigger');
  
  Browser.msgBox('Disable Automation', "Automation has been disabled.\\nThe daily notifcations will not be sent until this is enabled again.", Browser.Buttons.OK);
}

function calendar_setupAutomation() {
  var owner = SpreadsheetApp.getActive().getOwner().getEmail();
  var user = Session.getActiveUser().getEmail();
  if( user != owner){
    Browser.msgBox('Enable Automation', "Sorry.  Automation can only be enabled by the sheet owner.\\nPlease ask "+owner+" to run this.", Browser.Buttons.OK);
    return;
  }
  
  //setup daily trigger
  deleteTriggerByHandlerName('calendar_dailyTrigger');//remove any existing triggers so we don't have conflicts
  ScriptApp.newTrigger('calendar_dailyTrigger').timeBased().everyDays(1).atHour(5).nearMinute(30).create();//would be nice to have the time set in config

  //setup onEdit trigger - not needed as this onEdit can run as a simple trigger instead
  //  deleteTriggerByHandlerName('onEdit_eventsCalendar');
  //  ScriptApp.newTrigger('onEdit_eventsCalendar').forSpreadsheet(SpreadsheetApp.getActive()).onEdit().create();//would be nice to have the time set in config

  Browser.msgBox('Enable Automation', 'Done!', Browser.Buttons.OK) 
}

