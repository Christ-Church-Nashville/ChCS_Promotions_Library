function makeMenu_announcements_master(){
  DocumentApp.getUi().createMenu('[ Custom Menu ]')
  .addItem('Add Week', 'PL.announcements_master_insertWeeks')
  .addItem('Add Month', 'PL.announcements_master_insertMonth')

  .addSeparator()
  .addItem('Archive', 'PL.announcements_masterToArchive')
//  .addItem('Setup Archive', 'PL.announcements_setup')

  .addSeparator()
  .addItem('Format Document', 'PL.announcements_format_master')

  .addSubMenu(
    DocumentApp.getUi().createMenu('Formatting...')
    .addItem('Remove Double Spaces', 'PL.announcements_format_doubleSpaceToSingle')
    .addItem('Remove Empty Paragraphs', 'PL.announcements_format_removeEmptyParagraphs')
    .addItem('Fix Page Breaks (and headings)', 'PL.announcements_format_master_fixPageBreaksAndHeadings')
    .addItem('Format Future Events', 'PL.announcements_format_master_formatEventsFuture')
    .addItem('Format Past Events', 'PL.announcements_format_master_formatEventsPast')
  )

  .addSeparator()
  .addItem('Automation', 'PL.announcements_setupAutomation_master')

  .addSubMenu(
    DocumentApp.getUi().createMenu('Instructions...')
    .addItem('Document Overview', 'PL.announcements_showInstructions_Document')
    .addItem('Recurring Content', 'PL.announcements_showInstructions_RecurringContent')
  )
//  .addSeparator()
//  .addSubMenu(
//    DocumentApp.getUi().createMenu('Dev...')
//    .addItem('Update Menu', 'announcements_makeMenu')
////    .addItem('test', 'test')
//  )

  .addToUi();

  ////Disabled! This will be moved to a global config 
  //check to see if the archive doc has been set, if not, warn and ask the to run Archive Setup
  //but build the menu first or there won't be one if the script times out waiting on the user to click OK
//  if( ! announcements_checkSetup()){
//    var archiveSetupWarning = CacheService.getUserCache().get('archiveSetupWarning');
//    if( ! archiveSetupWarning){
//      DocumentApp.getUi().alert('Setup Required', "\
//Archiving is disabled.\n\
//Run the Archive Setup from the [ Custom Menu ] to enable archiving.\n\
//\n(And since I'm so nice, I won't bug you about it for a couple hours.)\
//", DocumentApp.getUi().ButtonSet.OK);
//      CacheService.getUserCache().put('archiveSetupWarning', true, 2*60*60);
//    }
//  }    
}

function makeMenu_announcements_twoWeeksHence() {
  DocumentApp.getUi().createMenu('[ Custom Menu ]')  
  .addItem('Invite Staff Sponsors to Comment',                                                         'PL.announcements_sendMailFunction')
  .addSeparator()
  .addItem('Rotate Content',                                                                           'PL.announcements_rotateContent')//was announcements_transferText
  .addSeparator()
  .addItem('Copy This Sunday\'s Service Slides to This Sunday\'s \'Live Announcements Slides\' folder', 'PL.announcements_moveSlides')

// Submenu commented out by Chad on 05.13.18. Don't think we need this anymore. Can be deleted.
//  .addSubMenu(
////    DocumentApp.getUi().createMenu('➤ Rotate Content - Step by step')
////    .addItem('1 - Return This week to Master',       'PL.announcements_moveThisToMaster')
////    .addItem('2 - Move Next week to This week',      'PL.announcements_moveNextToThis')
////    .addItem('3 - Move Draft to Next Week',          'PL.announcements_moveDraftToNext')
////    .addItem('4 - Get new Master content for Draft', 'PL.announcements_moveMasterToDraft')
////    .addItem('5 - Archive oldest week from Master',  'PL.announcements_moveOldestToArchive')
// )
  
  .addSeparator()
  .addItem('Re-order Paragraphs',       'PL.announcements_reorderParagraphs')
  .addItem('Remove Short Start Dates',  'PL.announcements_removeShortStartDates')
  .addItem('Format',                    'PL.announcements_draft_callFunctions')
  .addItem('Populate Empty Paragraphs', 'PL.announcements_matchEvents')
  .addItem('Update Long Start Dates',   'PL.announcements_modifyDatesInBody')
  .addToUi();
}

function makeMenu_announcements_oneWeekHence(){
  DocumentApp.getUi().createMenu('[ Custom Menu ]')
  .addItem('Format All', 'PL.announcements_runAllFormattingFunctions_oneWeekOut')
  .addSeparator()
  .addItem('Format Font', 'PL.announcements_formatFont_oneWeek')
  .addItem('Format Paragraphs', 'PL.announcements_format_removeEmptyParagraphs')
  .addToUi();
}

function makeMenu_announcements_upcomingWeek(){
  DocumentApp.getUi().createMenu('[ Custom Menu ]')
  .addItem('Format', 'PL.announcements_runAllFormattingFunctions_upcomingWeek')
  .addItem('Move Service Slides', 'PL.announcements_moveSlides')
  .addItem('Email Staff', 'PL.announcements_emailStaff')
  .addToUi();
}

function makeMenu_announcements_archive(){
  DocumentApp.getUi().createMenu('[ Custom Menu ]')
  .addItem('Format', 'PL.announcements_format_archive')
  .addToUi();
}

