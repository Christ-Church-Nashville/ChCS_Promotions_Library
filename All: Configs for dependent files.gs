/*
Below are the intial config files for each dependent file in the ChCS Workflow
These are here as both a backup of the originals and a reference to implement more pages


*******************************************************************
//MASTER SUNDAY ANNOUNCEMENTS

var documentConfig = {
  //no doc-specific config options at this time  
};

///// NO CHANGES BEYOND THIS POINT /////
///// NO CHANGES BEYOND THIS POINT /////
///// NO CHANGES BEYOND THIS POINT /////

//push config options to library
PL.updateConfig({announcements:documentConfig});

//local functions passed to library functions
function runMeToGrantPermissions(){}
function onOpen(){ PL.onOpen() }
function insertWeeks(){PL.announcements_master_insertWeeks()}
function masterToArchive(){PL.announcements_masterToArchive()}

function dumpConfig(){PL.dumpConfig()}

//END MASTER SUNDAY ANNOUNCEMENTS
*******************************************************************

*/
