/*
.  Copy this all to your project
.  assumes config global var
.  uses: findSheetByNameOrCreate()
.    

SpreadsheetApp.getUi().createMenu('Log')
.addItem('Set logging to DEBUG', 'setLoggingHigh')
.addItem('Set logging to Normal', 'setLoggingNormal')
.addItem('Set logging to Critical Only', 'setLoggingCritical')
.addItem('Disable Logging', 'setLoggingOff')

*/
function setLoggingHigh()    {setLogging(2)}// log(foo,2) // detail logging, normally off
function setLoggingNormal()  {setLogging(1)}// log(foo,1) or log(foo) // normal logging
function setLoggingCritical(){setLogging(0)}// log(foo,0) // critical, always show
function setLoggingOff(){setLogging(-1)}//No logging - don't use this.
function setLogging(level){PropertiesService.getScriptProperties().setProperty('LOGGING_LEVEL', level)}

//function log(what, level){//there's already a log function and I don't want to replace all the places I'm using it so ...
function write(what, level){
  //and for when you want to reallly slow down a sheet:
  //conditional formatting rules to color matching threads applied to B1:B: 
  //for contrast use colors: Light GYBOP then Dark GYBOP
  //=$B1=LARGE(UNIQUE($B1:B),1)  -  #93c47d
  //=$B1=LARGE(UNIQUE($B1:B),2)  -  #fce8b2
  //=$B1=LARGE(UNIQUE($B1:B),...)  -  #a4c2f4, #f9cb9c, #8e7cc3, #6aa84f, #ffd966, #3c78d8
  //=$B1=LARGE(UNIQUE($B1:B),9)  -  #e69138
  //=$B1=LARGE(UNIQUE($B1:B),10)  -  #674ea7
  //and for errors - applied to A1:A (color red with white bold text)
  //=regexmatch($C:$C, "(?i)error|whatever")
  //or change B1 to the thread you want to follow and use =B1=B$1
  //or filter on the desired thread
  
  //Note to self: Don't run log from within log.  Bad things happen and the universe implodes and that takes a long time to restore from backup. You do have a backup?
  // Log levels 0-2
  // 0 - Critical Logs Only
  // 1 - Low Level Logs
  // 2 - All Logs
  // log(foo, 0) will always log
  
  //first, while in debug
  fireLog(what);
  
  if( ! config) throw 'Missing global config var';
  //  if(!config.debug) return;//comment out if not using config.debug, duh
  var thread = config.logThread;
  if(! thread){//tags all entries from this script instance with the same thread number
    thread = new Date().getTime();
    config.logThread = thread;
  }
  level = level || 1;//default to low
  var loggingLevel = config.loggingLevel;
  if( ! loggingLevel){
    loggingLevel = PropertiesService.getScriptProperties().getProperty('LOGGING_LEVEL')  || 42;//unrandomly high number
    config.loggingLevel = loggingLevel;
  }
  if(loggingLevel < level) return;//logging level 0 = critical only
  
  var sheet = findSheetByNameOrCreate( (config.sheets && config.sheets.log) || 'Log');//var sheet = SpreadsheetApp.getActiveSheet()//typehint
  var maxLogEntries = config.maxLogEntries || 1000; //keeps the log from getting to slow especially when using conditional formatting on it
  
  if(typeof what == 'object') what = JSON.stringify(what);

  sheet.appendRow([new Date(),thread,what]);

  if(sheet.getMaxRows() > sheet.getLastRow())//remove blank lines
    sheet.deleteRows(sheet.getLastRow()+1, sheet.getMaxRows()-sheet.getLastRow())
  if(sheet.getMaxRows()>(maxLogEntries*1.1))//trim log when 10% over max size
    sheet.deleteRows(1, sheet.getMaxRows()-maxLogEntries)
}

function findSheetByNameOrCreate(name, index) {
  //find the named sheet 
  //or create it
  //return sheet object
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if(sheet) return sheet;
  index = index || ss.getSheets().length;//default to end
  sheet = ss.insertSheet(name, index);
  
  return sheet;
}

