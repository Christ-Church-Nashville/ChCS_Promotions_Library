/*

New Form Submission Sheet Setup Instructions

Save a copy of this sheet then go to Tools > Script Editor
From there, select Run > Run function -> runMeToGrantPermissions
This only needs to be done once.  Subsequent runs will seem to do nothing.

Look for the line that starts with "var documentConfig" and set the values to match your needs.
dataSheetName : The name of the sheet where form submissions are added
rowPrefix : The nickname to distinguish events from this sheet.  Example: 'Gold Row'
deadline  : The number of weeks before an event that the form must be submitted
minimumPromoStartDate : Not normally used, it overrides the default of 21 days
logSheetName : The name of the sheet used to record data changes

From the spreadsheet's menu, select [ Custom Menu ] -> Tools -> Enable Automation
This enables the triggers that automate updates and new submissions.

From the spreadsheet menu, go to Form -> Edit form
Make changes to the header as needed.

That's it!  You're new sheet is ready to go.  

*/

