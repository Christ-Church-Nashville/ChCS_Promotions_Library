//.addItem("[ 2 ] Format Planning Calendar Data", "prepareNewYearsData")
function calendar_prepareNewYearsData() { //menu
  //mostly is NOT formatting but whatev, the menu action name should be updated
  var sheet = SpreadsheetApp.getActive().getSheetByName(config.eventsCalendar.dataSheetName);
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var startRow = sheet.getFrozenRows();
  var numRows = values.length;
  var numColumns = values[0].length;

  //populate LISTED ON WEB CAL and PROMO REQUESTED columns
  for(var i=startRow; i<numRows; i++) {
    if(values[i][5] || values[i][6]) continue;//something already set, next please!
    var val = values[i][2] == "N/A" ? 'N/A' : 'No';
    sheet.getRange(i + 1, 6).setValue(val);//LISTED ON WEB CAL
    sheet.getRange(i + 1, 7).setValue(val);//PROMO REQUESTED
  }
  
  calendar_combineSundayWeekCells();
//  calendar_setWeekNumbers();//set using arrayformula with weeknum instead
}

function calendar_combineSundayWeekCells() {
  //search EVENT TITLE column for 'Sunday Service'
  var sheet = SpreadsheetApp.getActive().getSheetByName(config.eventsCalendar.dataSheetName);
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var sundayRows = [];

  for(var i=4; i<values.length; i++)//skip three header rows
    if(values[i][4].indexOf("Sunday Service") > -1)
      sundayRows.push(i);
  
  var maxValue = sundayRows[sundayRows.length - 1];//the last entry

  for(var k = 0; k < sundayRows.length; k++) {
    var from = sundayRows[k]+1;//+1 0-based array offset
    var to   = sundayRows[k+1];//+1 next array index, gives us the row before the next Sunday
    var numRows = to - from +1;//number of rows
    if(from > maxValue) break;
    //sheet.getRange(from, 1, 1, 2).mergeVertically();//uh, merging a single row doesn't do anything, just skip (or end in this case)
    //else
    sheet.getRange(from, 1, numRows, 2).mergeVertically();
  }
}

//.addItem("[ 3 ] Apply Due Dates to New Data", "ApplyFormula")
function calendar_ApplyFormula(){ //menu -- also fixed by Restore Header
  var sheet = SpreadsheetApp.getActive().getSheetByName(config.eventsCalendar.dataSheetName);
  var values = sheet.getDataRange().getValues();
  //fix the WEEK column formula
  sheet.getRange('A3').setFormula('={"WEEK"; ArrayFormula( if(D4:D, WEEKNUM(D4:D), IFERROR(1/0)) ) }')
  //fix the Bronze, Silver, Gold column formulae
  sheet.getRange('I3:K3').setFormulas([[
    '={"Bronze";ArrayFormula(if(LEN(D4:D),if(GTE(D4:D, TODAY()+21), D4:D-21, "--"),IFERROR(1/0)))}',
    '={"Silver";ArrayFormula(if(LEN(D4:D),if(GTE(D4:D, TODAY()+42), D4:D-42, "--"),IFERROR(1/0)))}',
    '={"Gold";  ArrayFormula(if(LEN(D4:D),if(GTE(D4:D, TODAY()+70), D4:D-70, "--"),IFERROR(1/0)))}'
  ]]);
}

function calendar_updateEventStatus(row) {

  var ss = SpreadsheetApp.openById(config.files.eventsCalendar);
  var sheet = ss.getSheetByName(config.eventsCalendar.dataSheetName);
  var values = sheet.getDataRange().getValues();

  var listedOnWebCal = values[row][5].toLowerCase();
  var promoRequested = values[row][6].toLowerCase();
  var status = 
      promoRequested   == 'no'                             ? 'Awaiting promotion request'
      : promoRequested == 'yes' && listedOnWebCal == 'yes' ? 'Promotion Scheduled'
      : promoRequested == 'yes' && listedOnWebCal != "yes" ? 'Pending review'//no || n/a
      : null;//promoRequested == 'n/a'
  
  if(status) {
    sheet.getRange(row, 12).setValue(status);
  } else {
    sheet.getRange(row, 12).setValue('N/A');//status
    sheet.getRange(row, 3).setValue('N/A');//promo type
    sheet.getRange(row, 6).setValue('N/A');//web cal
  }

}

function calendar_getStaff() {//returns [{},{},...]

  var sheet = SpreadsheetApp.openById(config.files.staffData).getActiveSheet();
  var values = sheet.getDataRange().getValues();
  values = values.slice(sheet.getFrozenRows());//remove headers if any
  
  var staff = values.map(function(c,i,a){
    return {
      name         : [c[0], c[1]].join(' '),
      email        : c[8],
      team         : c[11],
      isTeamLeader : (c[12].toLowerCase()=='yes'),
      jobTitle     : c[4],
    };
  },[]);

  return staff;
}

function calendar_getTeamLeader(team) {
  var sheet = SpreadsheetApp.openById(config.files.staffData);
  var values = sheet.getDataRange().getValues();
  for(var v=sheet.getFrozenRows(); v<values1.length; v++)
    if(team == values[v][11] && values[v][12] == "Yes")
        return values[v][8] + ',' + values[v][0] + " " + values[v][1];//email, fl
}

