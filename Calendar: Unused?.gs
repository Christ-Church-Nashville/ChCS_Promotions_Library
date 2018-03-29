//function calendar_setWeekNumbers_DEPRECATED() {
//  ///
//  var sheet = SpreadsheetApp.getActive().getSheetByName(config.eventsCalendar.dataSheetName);
//  var values = sheet.getDataRange().getValues();
//  for(var i=sheet.getFrozenRows(); i < values.length; i++) {
//    var dateFromSheet = values[i][3];
//    sheet.getRange(i + 1, 1).setValue(Utilities.formatDate(dateFromSheet, config.timeZone, 'w'));
//  }
//}


//.addItem("[ 4 ] Populate Bulletin Schedule Based on Previous Year's Schedule", "repopulateBulletins")
function calendar_repopulateBulletins() { //menu
  ////this collects bulletin names for calendar_makeRepeat() which is probably unused
  // so there's really no reason for it to run either
  // Since I'm keeping the other script just-in-case, I'll leave this one too
  // --Bob 20181208
  //note: based on the menu action name, perhaps this is used during new yeat processing.
  
  var sheet = SpreadsheetApp.getActive().getSheetByName(config.eventsCalendar.dataSheetName);
  var range = sheet.getRange(sheet.getFrozenRows()+1, 2, sheet.getLastRow()-sheet.getFrozenRows());
  var bulletins = range.getValues()
  .reduce(function(bulletins,name){
    if(name[0]) bulletins.push(name[0]);
    return bulletins;
  },[]);
  
  calendar_makeRepeat(bulletins, sheet.getFrozenRows()+1);//readFrom...uh, was 6.  But I don't know why it would be so --Bob
}

function calendar_makeRepeat(arr, readFrom) {
  ////this appears to be doing nothing
  // at one time it made the bulletin names repeat but that was likely before the bulletin names were merged vertically
  // the script runs but makes no changes as there should never be a matcihng condition.
  // I'll leave it here in case there is a use for it that I'm unaware of
  // --Bob 20181208
  var sheet = SpreadsheetApp.getActive().getSheetByName(config.eventsCalendar.dataSheetName);
  var range = sheet.getDataRange();
  var values = range.getValues();
  var k = 0;
  var startFrom = 0;

  //gets the first row with data inb col 1
  for(var j = readFrom; j <= values.length; j++) {
    if(range.getCell(j, 1).getValue()) {
      var startFrom = j;
      break;
    }
  }
  
  while(k < 52) {//yeah, only if there really /are/ 52... otherwise infinite loop
    if(startFrom > values.length) return;//happens during recursion
    if(range.getCell(startFrom, 1).getValue()) {
      range.getCell(startFrom, 2).setValue(arr[k]);
      k++
    }
    startFrom++;
  }
  calendar_makeRepeat(arr, startFrom)
}

