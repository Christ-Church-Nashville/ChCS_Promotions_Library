//function responseForm_showInstructions_MatchEvent(sheet){//options = {} with template var names
//  //sheetName = 
//  //  Gold : "Gold Raw Data 10_27 copy"
//  //  Silver : "Silver Raw Data 10_27 copy"
//  //  Bronze : "Bronze Raw Data 10_27 copy"
//  
//  var sheetName = sheet ? sheet.getName() : null;
//  
//  /// ok, soi this was outdated even befire I got the project.  Will need to e reviewed after all coding is complete
//  var template = "<h1>Instructions</h1> \
//<h2>Update Events Promotion Calendar scripts</h2> \
//<h3>Assumptions:</h3> \
//<ul> \
//  <li>This script must have a sheet named \"%s\"</li> \
//  <li>The CCN Events Promotion Calendar spreadsheet must be located at <a target='_blank' href='%s'>%s</a></li> \
//  <li>The CCN Events Promotion Calendar spreadsheet must have a sheet named \"Communications Director Master\"</li> \
//  <li>Data on the \"%s\" sheet begins in row 2</li> \
//  <li>Data on the \"Communications Director Master\" sheet begins in row 4</li> \
//  <li>On the \"%s\" sheet, the event title is located in column E, and the short start date is located in column F.  The short start date can be in the format M.DD or MM.DD</li> \
//  <li>On the \"Communications Director Master\" sheet, the event title is located in column E, the short start date is located in column D, and the promo req. is located in column G.  The short start date can be in the format M.DD or MM.DD</li> \
//</ul> \
//<h3>Notes:</h3> \
//<ul> \
//  <li>If matching events are found on the two sheets, column G of \"Communications Director Master\" will be updated to \"Yes\"</li> \
//  <ul> \
//    <li>Matching events are defined as two events with 75% matching words in the event title, located within +- 10 days of each other</li> \
//    <li>Capitalization and non-alphanumeric characters are ignored in order to make the search a little more liberal</li> \
//    <li>To change the date or percent match thresholds, update the first two lines of the code accordingly in the \"responseForm_updateEventsPromotionCalendarMatchingEvents_\" script.</li> \
//  </ul> \
//  <li>In Test mode, you'll only see a log of matching events, but no changes will be made to the spreadsheet.</li> \
//</ul> \
//<h3>Running the script each time the spreadsheet is edited or a form is submitted:</h3> \
//<ul> \
//  <li>To set up the script to run each time the spreadsheet is edited, in Script Editor, go to Edit -> Current Project's Triggers.  Click \"Add a new trigger\" and select \"responseForm_updateEventsPromotionCalendarMatchingEvents_onEdit\" from the drop-down menu.  Then, select \"From Spreadsheet\" and \"On Edit\".</li> \
//  <li>To set up the script to run each time a Google Form response is submitted, in Script Editor, go to Edit -> Current Project's Triggers.  Click \"Add a new trigger\" and select \"responseForm_updateEventsPromotionCalendarMatchingEvents_onFormSubmit\" from the drop-down menu.  Then, select \"From Spreadsheet\" and \"On Form Submit\".</li> \
//  <li>If an \"On Edit\" trigger is installed, script will be run each time the \"%s\" sheet is edited in columns E or F only.</li> \
//  <li>The script will run from your account regardless of who edits the spreadsheet or submits a form response.</li> \
//</ul> \
//";
//  if(sheetName){
//    var html = Utilities.formatString(template, sheetName, config.responseForm.files.promotionCalendarSpreadsheetURL, config.responseForm.files.promotionCalendarSpreadsheetURL, sheetName, sheetName, sheetName);
//  }else{
//    var html = 'Sorry!  I seem to have misplaced the instructions...';
//    err('Invalid sheet supplied for showInstructions_MatchEvent')
//  }
//
//  var modal = HtmlService.createHtmlOutput(html).setWidth(800).setHeight(600);
//  SpreadsheetApp.getUi().showModalDialog(modal, "Instructions");
//}
