function dev_foo(){
  //replace with dev settings
  config.files.announcements.master   = '1zurmirBdDMeVZZbLmZ9G2N34IqwE7rVr9Zl1PVe6DUQ'//master
  config.files.announcements.twoWeeks = '17lGNRU42GIp8XvGEkcgQWiDKNhAbHqoldYwECj_6vB4'//draft
  config.files.announcements.oneWeek  = '1pAVbEckirpCiCd8KRlAryeWjIWr2l9-WyIp7m-Sg2PQ'//next sunday
  config.files.announcements.upcoming = '1RWPP7sD29OrUNKMqExlJIqDvAkrLL-7YT2jm1kCpvJM'//this sunday
  
  //  var doc = DocumentApp.openById(config.files.announcements.master)
  //  announcements_format_removeEmptyParagraphs(doc)
  
  announcements_rotateContent();
//  announcements_moveThisToMaster();//this week returned to master
//  announcements_moveNextToThis();//next week to this week
//  announcements_moveDraftToNext();//draft to next week
//  announcements_moveMasterToDraft();//master to draft
//  announcements_moveOldestToArchive();//archive oldest sunday - should this be older than today-x weeks?
//  return
  
  //  var doc = DocumentApp.openById(config.files.announcements.upcoming)
  //  announcements_runAllFormattingFunctions_upcomingWeek(doc)
  
  ///////// now make it format the header properly (it assumes it will already be correct - or, maybe it's using default page styles and all is well?)
  ///////// now make it format the header properly (it assumes it will already be correct - or, maybe it's using default page styles and all is well?)
  ///////// now make it format the header properly (it assumes it will already be correct - or, maybe it's using default page styles and all is well?)
  ///////// now make it format the header properly (it assumes it will already be correct - or, maybe it's using default page styles and all is well?)
  ///////// now make it format the header properly (it assumes it will already be correct - or, maybe it's using default page styles and all is well?)
  
    
  
  //prepend fake docs with 'FAKE '
  var docs = [
    config.files.announcements.master, config.files.announcements.upcoming, 
    config.files.announcements.oneWeek, config.files.announcements.twoWeeks
  ];
  for(var d in docs){
    var doc = DriveApp.getFileById(docs[d]);
    doc.setName(doc.getName().replace(/^(?:FAKE)? */,'FAKE '))
  }
}
  
  
//  var formatting_DEV = {
//    master     : announcements_format_master(), //  announcements_moveThisToMaster()
//    draft      : announcements_formatDocument(), //  announcements_moveMasterToDraft()
//    oneWeekOut : announcements_runAllFormattingFunctions_oneWeekOut(), //  announcements_moveDraftToNext()
//    upcoming   : announcements_runAllFormattingFunctions_upcomingWeek(), //  announcements_moveNextToThis()
//    archive    : announcements_format_archive(), //  announcements_moveOldestToArchive()
//  }
      
      
