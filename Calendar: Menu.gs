function makeMenu_eventsCalendar(){ ///convert to new format
  SpreadsheetApp.getUi().createMenu("[ Custom Menu ]")
  ////these should be reassessed as they don't all do what they once did
  ////[ 1 ] doesn't exist
  ////[ 2 ] doesn't do any formatting except to merge the WEEK column
  ////[ 3 ] is an arrayformula now - the action just fixes the formulas now
  ////[ 4 ] well, this might be the same but I think it might should be different than it is
  .addItem("[ 1 ] Import Planning Calendar Data (this script is not yet written)", "PL.nada")///not written yet
  .addItem("[ 2 ] Format Planning Calendar Data", "PL.calendar_prepareNewYearsData")
  .addItem("[ 3 ] Apply Due Dates to New Data", "PL.calendar_ApplyFormula")////this is a formula on the sheet now - not needed here
  .addItem("[ 4 ] Populate Bulletin Schedule Based on Previous Year's Schedule", "PL.calendar_repopulateBulletins")

  .addSeparator()
  .addItem("Format Sheet", "PL.calendar_formatSheet")
  .addSubMenu(
    SpreadsheetApp.getUi().createMenu('Format...')
    .addItem("Hide Old Rows", "PL.calendar_hideRows")
    .addItem("Delete Empty Rows", "PL.calendar_removeEmptyRows")
    .addItem("Set Border Color", "PL.calendar_colorBorders")
    .addItem("Set Weeks Format", "PL.calendar_setWeeksFormat")
    .addItem("Set Events Format", "PL.calendar_setEventsFormat")
  )

  .addSeparator()
  .addSubMenu(
    SpreadsheetApp.getUi().createMenu('Tools')
    .addItem('Restore Header', 'PL.calendar_restoreHeader')
    .addItem('Backup Header', 'PL.calendar_backupHeader')
    .addSeparator()
    .addItem('Enable Automation', 'PL.calendar_setupAutomation')//note: do NOT run this from the library, use a proxy function ala: function setupAutomation(){PL.setupAutomation_responseForm()}
    .addItem('Disable Automation', 'PL.calendar_disableAutomation')//note: do NOT run this from the library, use a proxy function ala: function disableAutomation(){PL.disableAutomation_responseForm()}
  )
  
  .addSeparator()
  .addItem("Check Deadlines", "PL.calendar_checkDeadlines")
  .addItem("Check for Errors", "PL.calendar_checkTeamSheetsForErrors")
  
  
  ///dev options - remove on golive
  .addSeparator()
  .addItem('Refresh Custom Menu - DEV','PL.makeMenu_eventsCalendar')

  .addToUi();
}

function nada(){}