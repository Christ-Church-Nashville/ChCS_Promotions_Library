function announcements_getWeekTitles() {
  //get dates for next three Sundays
  var thisSunday = getUpcomingSunday(null, true);
  var nextSunday = dateAdd(thisSunday, 'week', 1);
  var draftSunday = dateAdd(thisSunday, 'week', 2);
  //get title for each date
  var thisSundayTitle = fDate(thisSunday, "[ MM.dd ] 'Sunday Announcements'");
  var nextSundayTitle = fDate(nextSunday, "[ MM.dd ] 'Sunday Announcements'");
  var draftSundayTitle = fDate(draftSunday, "[ MM.dd ] 'Sunday Announcements - Draft Document'");
  
  var out = {
    thisSunday  : thisSundayTitle,
    nextSunday  : nextSundayTitle,
    draftSunday : draftSundayTitle,
    dates:{
      thisSunday  : thisSunday,
      nextSunday  : nextSunday,
      draftSunday : draftSunday,
    }
  }

  return out;
}


/*

The announcements pages seem to need triggers - none of which exist
Instead of setting up a new trigger on each announcement page (draft, next week, this week), handle all actions from a central location (like this script)

*/


function announcements_analyse_DEV() {
  var Doc = DocumentApp.getActiveDocument();
    var totalElements = Doc.getNumChildren();
    var el=[]
    for( var j = 0; j < totalElements; ++j ) {
      var element = Doc.getChild(j);
      var type = element.getType();
      log(j+" : "+type)
    }
}






