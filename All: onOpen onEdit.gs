function onOpen() {

  var boundDoc = getBoundDocument();//var boundDoc = SpreadsheetApp.getActive();//typehint
  if (!boundDoc) return;//no bound document so nothing to do

  switch (boundDoc.getId()){
  
    case config.files.staffData              : makeMenu_staffData(); break;
    case config.files.responseForm           : makeMenu_responseForm(); break;
    case config.files.eventsCalendar         : makeMenu_eventsCalendar(); break;
    case config.files.announcements.master   : makeMenu_announcements_master(); break;
    case config.files.announcements.twoWeeks : makeMenu_announcements_twoWeeksHence(); break;
    case config.files.announcements.oneWeek  : makeMenu_announcements_oneWeekHence(); break;
    case config.files.announcements.upcoming : makeMenu_announcements_upcomingWeek(); break;
    case config.files.announcements.archive  : makeMenu_announcements_archive(); break;
    case config.files.hootsuite              : makeMenu_hootsuite(); break;
  }
}

function onEdit(e) {

  var boundDoc = getBoundDocument();//var boundDoc = SpreadsheetApp.getActive();//typehint
  if( ! boundDoc) return;//no bound document so nothing to do

  switch(boundDoc.getId()){
    case config.files.staffData              : onEdit_staffData(e); break;
    case config.files.responseForm           : onEdit_responseForm(e); break;
    case config.files.eventsCalendar         : onEdit_eventsCalendar(e); break;
  }
}

