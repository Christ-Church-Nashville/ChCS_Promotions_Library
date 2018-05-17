//function responseForm_changeLog(e) {
//  if( ! (config && config.responseForm) ) return;
//  ///todo: (someday, maybe, prob not)
//  ///add maxLogEntries test to trim the log when it gets to old/stale. Could be numRows or daysOld or sinceDate
//  ///record multi-cell edits (sans oldValue since it won't be available) 
//  
//  // source: https://gist.githubusercontent.com/hlecuanda/74cddfc3150dad1dc9266c952ae64194/raw/1dae41e1e2916e303203cbed6a94be8d52646613/Changelog.gs
//  // This script records changes to the spreadsheet on a "Changelog" sheet.
//  // "Timestamp", "Sheet", "Cell", "Column Label", "Row Label", "New Value", "Old Value", "Editor"
//  
//  // edit the following lines to suit your needs
//  // changes are only recorded from sheets listed below
//  // escape regular expression metacharacters as in \. \$ \+ \* \? \( \) \[ \]
//  // see http://en.wikipedia.org/wiki/Regular_expression
//  // use '.+' to include all sheets
//  var sheetsToWatch = config.responseForm.changeLog && config.responseForm.changeLog.watchSheets || [];
//  // name of the sheet where the changelog is stored
//  var changelogSheetName = config.responseForm.changeLog && config.responseForm.changeLog.logSheetName || "Changelog";
//  var timestamp = new Date();
//  var ss = e.source;
//  var sheet = e.range.getSheet();
//  var cell = e.range;//var cell = SpreadsheetApp.getActiveRange()
//  var multiCell = (cell.getWidth()>1 || cell.getHeight() > 1) ? true : false;//it's a multirange edit... just record the upper leftmost cell
//  var value = cell.getDisplayValue();
//  var oldValue = (multiCell ? 'Multi-cell Update' : e.oldValue || null)
//  var sheetName = sheet.getName();
//  var editor = Session.getActiveUser().getEmail() || 'unknown';
////  var editor = Session.getActiveUser() && Session.getActiveUser().getEmail() || 'unknown';
//  
//  // if it is the changelog sheet that is being edited, do not record the change
//  if (sheetName == changelogSheetName) return;
//  
//  // if the sheet name does not appear in sheetsToWatch, do not record the change
//  var matchFound = false;
//  for (var i=0; i<sheetsToWatch.length; i++)
//    if (sheetName.match(sheetsToWatch[i])) matchFound = true;
//  if( ! matchFound) return;
//  
//  var columnLabel = sheet.getRange(1, cell.getColumn()).getValue();
//  var rowLabel = sheet.getRange(cell.getRow(), 1).getValue();
//  
//  var changelogSheet = ss.getSheetByName(changelogSheetName);
//  if (!changelogSheet) {
//    // no changelog sheet found, create it as the last sheet in the spreadsheet
//    changelogSheet = ss.insertSheet(changelogSheetName, ss.getNumSheets());
//    changelogSheet.appendRow(["Timestamp", "Sheet", "Cell", "Column Label", "Row Label", "New Value", "Old Value", "Editor"]);
//    changelogSheet.setFrozenRows(1);
//  }
//  
//  changelogSheet.appendRow([
//    timestamp, 
//    sheetName, 
//    cell.getA1Notation(), 
//    columnLabel, 
//    rowLabel, 
//    value, 
//    oldValue,
//    editor
//  ]);
//  
//  
//  if(changelogSheet.getMaxRows() > changelogSheet.getLastRow())//remove blank rows at end
//  changelogSheet.deleteRows(changelogSheet.getLastRow()+1, changelogSheet.getMaxRows()-changelogSheet.getLastRow())
//  //var changelogSheet = SpreadsheetApp.getActiveSheet()
//  if(changelogSheet.getLastRow() > 1000*1.1)//cleanup changelog when 10% over limit
//    changelogSheet.deleteRows(changelogSheet.getFrozenRows()+1, changelogSheet.getLastRow()-1000);
//}
