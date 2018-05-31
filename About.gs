/*
Script ID
1y9ackD7MdSsUkiGd1Au7DvkAgYRn7vkraabnwv12WvIj9YEK1579k48F

Note: The Script ID will change if the file is copied (of course).
To get the current Script ID, make sure to save at least one version from File -> Manage versions
Then get the project key from File -> Project Properties and look for "Script ID"
Or just grab it from the URL if you know which part to use.)

HOW TO USE ///UPDATE ME

This is a shared library for use with the ChCS Promotions scripts.
To include this library in another script, select Resources >> Libraries from the menu (of the other script's Script Editor).
In the "Add a library" field, enter the Project key from above.
Select the most recent version from the list.
Change the idenitifier to "CCN".
Save the changes.

You can now access the shared methods using the identifier.
e.g.: PL.methodName()

================

How to setup a sheet to use this library
//assuming you've added the library as explained above...

//local config settings
var documentConfig = { 
dataSheetName : 'data sheet name',
rowPrefix : 'prefix for announcements - e.g.:Gold Row',
deadline  : 8,//weeks from Sunday next before promo start
//minimumPromoStartDate : 21,//defaults to 21 in library but can be overriden here
  changeLog : {
    logSheetName : 'ChangeLog',//defaults to 'ChangeLog'
  },
};
documentConfig.changeLog.watchSheets = [documentConfig.dataSheetName];
//push config options to library
PL.updateConfig(promo:{documentConfig});
//get merged config from library

//local functions using library functions
function onEdit(e){PL.onEdit_responseForm(e)}
function onEdit_Triggered(e){PL.onEdit_responseForm_Triggered(e)}


*/

