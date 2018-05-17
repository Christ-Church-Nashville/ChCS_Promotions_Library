//function makeMenu_responseForm(){
//  
//  SpreadsheetApp.getUi().createMenu('[ Custom Menu ]')
//  .addItem('Sync  to Master - single event', 'PL.responseForm_syncRowToMaster')
//  .addItem('Sync  to Master - all marked rows', 'PL.responseForm_syncAllToMaster')
//  .addSeparator()
//  
//  .addItem("Update Events Promotion Calendar for Matching Events - TEST", 'PL.responseForm_updateEventsPromotionCalendarMatchingEvents_TEST')
//  .addItem("Update Events Promotion Calendar for Matching Events", 'PL.responseForm_updateEventsPromotionCalendarMatchingEvents')
//  .addItem("Matching Events Instructions", 'PL.responseForm_showInstructions_MatchEvent')
//  .addSeparator()
//  
//  .addSubMenu(
//    SpreadsheetApp.getUi().createMenu('Tools')
//    .addItem('Enable Automation', 'PL.responseForm_setupAutomation')//note: do NOT run this from the library, use a proxy function
//    .addItem('Disable Automation', 'PL.responseForm_disableAutomation')//note: do NOT run this from the library, use a proxy function
//  )
//  
//  ///dev options - remove on golive
//  .addSeparator()
//  .addItem('Refresh Custom Menu','PL.makeMenu_promo')
//  
//  .addToUi();
//  
//}
