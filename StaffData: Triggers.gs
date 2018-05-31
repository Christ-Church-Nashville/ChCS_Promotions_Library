//function staffData_enableAutomation() {
//  var owner = SpreadsheetApp.getActive().getOwner().getEmail();
//  var user = Session.getActiveUser().getEmail();
//  if( user != owner){
//    Browser.msgBox('Enable Automation', "Sorry.  Automation can only be enabled by the sheet owner.\\nPlease ask "+owner+" to run this.", Browser.Buttons.OK);
//    return;
//  }
//  
//  deleteTriggerByHandlerName('onEdit_TRIGGERED');
//  deleteTriggerByHandlerName('staffFolders_TRIGGERED');
//  deleteTriggerByHandlerName('sortByLastName_TRIGGERED');
//  ScriptApp.newTrigger('onEdit_TRIGGERED').forSpreadsheet(SpreadsheetApp.getActive()).onEdit().create();
//  ScriptApp.newTrigger('staffFolders_TRIGGERED').timeBased().everyDays(1).atHour(0).create();
//  ScriptApp.newTrigger('sortByLastName_TRIGGERED').timeBased().everyDays(1).atHour(0).create();
//
//  Browser.msgBox('Enable Automation', 'Done!', Browser.Buttons.OK) 
//}
//
//function staffData_disableAutomation() {
//  var owner = SpreadsheetApp.getActive().getOwner().getEmail();
//  var user = Session.getActiveUser().getEmail();
//  if( user != owner){
//    Browser.msgBox('Disable Automation', "Sorry.  Automation can only be disabled by the sheet owner.\\nPlease ask "+owner+" to run this.", Browser.Buttons.OK);
//    return;
//  }
//
//  deleteTriggerByHandlerName('onEdit_TRIGGERED');
//  deleteTriggerByHandlerName('staffFolders_TRIGGERED');
//  deleteTriggerByHandlerName('sortByLastName_TRIGGERED');
//  
//  Browser.msgBox('Disable Automation', "Automation disabled.  Triggers will not run.", Browser.Buttons.OK);
//}
