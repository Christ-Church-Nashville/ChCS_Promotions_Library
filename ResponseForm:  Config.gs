//config.responseForm = {
//
//  changeLog : {
//    logSheetName : 'ChangeLog',//defaults to 'ChangeLog'
//  },
//  
//  dataSheetName : 'Incoming_Data',
//  subtitlesList : "First Sunday of the month,Second Sunday of the month,Third Sunday of the month,Fourth Sunday of the month,Fifth Sunday of the month",//lazy lazy lazy
//  files : {
//    masterAnnouncementsID : '1vt_yq2YiswCeZ_yt7oJVAgfBs8x86sYktBiC2COErcE',
//    ///implement: masterAnnouncementsID : PropertiesService.getScriptProperties().getProperty('masterAnnouncementsID'),
//    //promotionCalendarSpreadsheetID : '1d0-hBf96ilIpAO67LR86leEq09jYP2866uWC48bJloc',///should use config.files.eventsCalendar
//    promotionCalendarSpreadsheetURL : 'https://docs.google.com/spreadsheets/d/1d0-hBf96ilIpAO67LR86leEq09jYP2866uWC48bJloc/edit',
//    ///promotionCalendarSpreadsheetURL should really come from DriveApp.getFileById(config.files.eventsCalendar).getUrl()
//    promotionCalendarSheetName : 'Communications Director Master',
//  },
//  
//  deadline:{//in days
//    Gold   : 8,
//    Silver : 6,
//    Bronze : 3,
//  },
//
//  columns : {/* this is now populated by responseForm_getPRFColumns() only when needed */ },
//  
//  changeLog : {
//    watchSheets  : [],//passed by calling script - could default to '.+' to match all sheets
//    logSheetName : 'ChangeLog',
//  },
//  
//  //for fuzzy logic matching
//  matchThresholdPercent : 0.75,
//  maxEventDateDiff : 10,
//  
//  format : {
//    subtitle : {
//      HORIZONTAL_ALIGNMENT : DocumentApp.HorizontalAlignment.RIGHT,
//      FONT_SIZE      : 9,
//      FONT_FAMILY    : 'Lato',
//      LINE_SPACING   : 1.5,
//      SPACING_BEFORE : 10,
//      SPACING_AFTER  : 10,
//      ITALIC         : true,
//    },
//    current : {
//      HORIZONTAL_ALIGNMENT : DocumentApp.HorizontalAlignment.LEFT,
//      FONT_SIZE      : 9,
//      FONT_FAMILY    : 'Lato',
//      LINE_SPACING   : 1.5,
//      SPACING_BEFORE : 15,
//      SPACING_AFTER  : 15,
//      ITALIC         : false,
//    },
//    normalText_USE_CURRENT_INSTEAD : {//this matches the current DocumentApp.ParagraphHeading.NORMAL settings
//      HORIZONTAL_ALIGNMENT : DocumentApp.HorizontalAlignment.LEFT,
//      HEADING              : DocumentApp.ParagraphHeading.NORMAL,
//      INDENT_END           : 0,
//      INDENT_START         : 0,
//      INDENT_FIRST_LINE    : 0,
//      LINE_SPACING         : 1.5,
//      SPACING_BEFORE       : 12,
//      SPACING_AFTER        : 0,
//      FOREGROUND_COLOR     : '#585858',
//      BACKGROUND_COLOR     : '#ffffff',
//      //      BACKGROUND_COLOR : '#00ff00',//green //dev
//    },
//  },
//  
//};
