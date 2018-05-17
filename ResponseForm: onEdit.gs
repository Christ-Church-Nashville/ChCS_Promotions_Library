////typehint
////  var e={};
////  e.authMode=ScriptApp.AuthMode.LIMITED;
////  e.user=Session.getActiveUser();
////  e.source=SpreadsheetApp.getActive();
////  e.range=SpreadsheetApp.getActiveRange();
////  e.value='';
////  e.oldValue='';
//
//function responseForm_clearSetupWarning_DEBUG(){CacheService.getUserCache().remove('responseForm_onEditWarning')}
//
////function responseForm_onEdit(e){
//function onEdit_responseForm(e){
//  //check to see if installed onEdit is running
//  responseForm_checkTriggeredOnEditIsRunning_responseForm(e);//must run from both the simple and installed onEdit triggers
//}
//
//function onEdit_responseForm_Triggered(e){
//  var owner = SpreadsheetApp.getActive().getOwner().getEmail();
//  var user = Session.getActiveUser().getEmail();
//  if( user != owner){
//    var badTrigger = deleteTriggerByHandlerName('onEdit_responseForm_Triggered');
//    if(badTrigger){
//      write('ERROR: onEdit_responseForm_Triggered run as '+Session.getActiveUser().getEmail()+' which is not the owner.  Trigger will be deleted from the user\'s account.')
//      err('onEdit_responseForm_Triggered was run under an incorrect account. : "'+Session.getActiveUser().getEmail())+'" The offending trigger has been removed.';
//    }
//    return;
//  }
//  
//  responseForm_getPRFColumns();
//  if(e.range.getColumn() == config.responseForm.columns.update)
//    return;
//  
//  //verify the trigger is running as we need to be able to send notifications
//  responseForm_checkTriggeredOnEditIsRunning_responseForm(e);//must run from both the simple and installed onEdit triggers
//  responseForm_changeLog(e);//Want this running even if the installed trigger isn't.
//  responseForm_markRowForUpdateToMaster(e);
//}
//
//function responseForm_markRowForUpdateToMaster(e){
//  responseForm_getPRFColumns();
//  //if data in a watched column is changed, mark for update so the user knows.
////  log('markRowForUpdateToMaster')
//  var sheet = e.range.getSheet();
//  var row = e.range.getRow();
////  log('col: '+e.range.getColumn())
//  
//  //only run on datasheet
//  if(sheet.getName() !== config.responseForm.dataSheetName) return;
//  
//  //run only for specified columns
//  if([
//    config.responseForm.columns.email,
//    config.responseForm.columns.title,
//    config.responseForm.columns.startDate,
//    config.responseForm.columns.endDate,
//    config.responseForm.columns.location,
//    config.responseForm.columns.cost,
//    config.responseForm.columns.registration,
//    config.responseForm.columns.eventFor,
//    config.responseForm.columns.eventAbout
//  ].indexOf( e.range.getColumn() ) <0) return;
//  
//  //If there's no data in the timestamp col, not a real boy, er, row so walk, don't run --Sorry, it's like 2am and time to retire --Bob
//  var timestampCell = sheet.getRange(row, config.responseForm.columns.timestamp);
//  if( ! timestampCell.getValue() ) return;
//  
//  //check the rows update
//  var updateCell = sheet.getRange(row, config.responseForm.columns.update);
//  //if empty, mark it for update
//  if( ! updateCell.getValue()) updateCell.setValue('➕');
//  //if not empty, and not the update value, prompt to replace?  naw, not this round
//  
//}
//
//function responseForm_checkTriggeredOnEditIsRunning_responseForm(e){
//  //if the warning flag is set, no need to check since they've already been told
//  var wasWarned = CacheService.getUserCache().get('responseForm_onEditWarning');
//  if (wasWarned) return;
//  
//  var reprieveTime = 5*60;// time (in seconds) to wait before showing future warnings
//  var warningTitle = 'Setup Required';
//  var warningPrompt = "Oops!  Looks like the script that watches for changes is missing.\\n\
//Please run Tools -> Enable Automation from the custom menu.\\n\
//This message will show up whenever you make a change to the sheet until you complete the setup.\\n\\n\
//To save your sanity, I won't tell you again for a bit if you click the OK button.";
//  
//  // check for any other reason NOT to run
//  //  if(onEditExitConditions(e)) return;// on second thought, always run this bit
//  
//  if(e && e.authMode && e.authMode === ScriptApp.AuthMode.FULL){
//    //Running in FULL authMode, store the OnEditTriggerIsRunning flag for simple mode to check
//    CacheService.getUserCache().put('responseForm_OnEditTriggerIsRunning', true, 3);
//    log('Put cache check')
//  }else{
//    //onEdit running as simple
//    Utilities.sleep(1500);//give the triggered version a chance to store the flag
//    log('Read cache check')
//    var wasFlagSetByTrigger = CacheService.getUserCache().get('responseForm_OnEditTriggerIsRunning');
//    if( ! wasFlagSetByTrigger){ //trigger did NOT run hence no flag was set
//      var ok = Browser.msgBox(warningTitle, warningPrompt, Browser.Buttons.OK_CANCEL);
//      if( ok != 'ok') return;// they didn't hit OK so we tell them again next time
//      CacheService.getUserCache().put('responseForm_onEditWarning', true, reprieveTime); //they did hit OK so we'll not nag them for a bit
//    }
//  }
//}
