function announcements_runAllFormattingFunctions_upcomingWeek(doc) {
  doc = doc || DocumentApp.openById(config.files.announcements.upcoming);
  announcements_format_upcoming_font(doc);//sets normal font and spacing
  announcements_format_upcoming_highlightEventName(doc);
  //  announcements_format_upcoming_font(doc);//again??
  announcements_format_boldBetweenSquareBrackets(doc);
  announcements_format_unHighlightStaffNames(doc);
  announcements_format_removeEmptyParagraphs(doc);
  announcements_format_titleAndSubtitle(doc);//and set para style so it appears on the outline
}

function announcements_format_titleAndSubtitle(doc){//for use on rotation docs, not master or archive
  doc = doc || DocumentApp.openById(config.files.announcements.upcoming);//var doc = DocumentApp.getActiveDocument()//typehint
  var body = doc.getBody();

  var re_ordinalSunday = /^ *(?:First|Second|Third|Fourth|Fifth) *Sunday *of *the *month *$/i;
  var re_ordinalSunday_string = escapeGasRegExString(re_ordinalSunday);
  var ordinalElement = body.findText(re_ordinalSunday_string);
  if(ordinalElement){
    var ordinalParagraph = ordinalElement.getElement().getParent();
    ordinalParagraph.asParagraph().setHeading(DocumentApp.ParagraphHeading.HEADING2);
    ordinalParagraph.setAttributes(config.announcements.format.subtitle)
  }

  var titleElement = body.findText(config.announcements.sundayPagePattern);
  if(titleElement){
    var titleParagraph = titleElement.getElement().getParent();
    titleParagraph.asParagraph().setHeading(DocumentApp.ParagraphHeading.TITLE)
    titleParagraph.setAttributes(config.announcements.format.title)
  }

  
}

function announcements_format_upcoming_font(doc) {
  doc = doc || DocumentApp.openById(config.files.announcements.upcoming);//var doc = DocumentApp.openById(id)
  var body = doc.getBody();
  body.editAsText().setFontFamily('Lato');
  body.editAsText().setFontSize(9);
  body.editAsText().setForegroundColor('#58585a');
  var p = body.getParagraphs();
  for (i = 0; i < p.length; i++) {
    p[i].setLineSpacing(1.5).setSpacingAfter(0);
  }
}

function announcements_format_upcoming_highlightEventName(doc) {//and set bold
  doc = doc || DocumentApp.openById(config.files.announcements.upcoming);
  var body = doc.getBody();
  var para = body.getParagraphs();
  var startTag = "[\[]";
  var endTag = "[|]";
  var highlightStyle = {};
  highlightStyle[DocumentApp.Attribute.BACKGROUND_COLOR] = '#FCFC00';
  for (var i in para) {
    var from = para[i].findText(startTag);
    var to = para[i].findText(endTag, from);
    if ((to != null && from != null) && ((to.getStartOffset()) - (from.getStartOffset() + startTag.length) > 0)) {
      para[i].editAsText().setBold(from.getStartOffset() + 2, to.getStartOffset() - 2, true);
      para[i].editAsText().setBackgroundColor(from.getStartOffset() + 2, to.getStartOffset() - 2, "#FCFC00");
    }
  }
}

function announcements_format_boldBetweenSquareBrackets(doc) {
  doc = doc || DocumentApp.openById(config.files.announcements.upcoming);
  var body = doc.getBody();
  var para = body.getParagraphs();
  var startTag = "[\[]";
  var endTag = "[\]]";
  var i = 0;
  for (i in para) {
    var from = para[i].findText(startTag);
    var to = para[i].findText(endTag, from);
    if ((to != null && from != null) && ((to.getStartOffset()) - (from.getStartOffset() + startTag.length) > 0)) {
      para[i].editAsText().setBold(from.getStartOffset(), to.getStartOffset(), true);
    }
  }
}

function announcements_format_unHighlightStaffNames(doc) {
  doc = doc || DocumentApp.openById(config.files.announcements.upcoming);
  var body = doc.getBody();
  var para = body.getParagraphs();
  var startTag = "[;]";
  var endTag = "[\]]";
  var highlightStyle = {};
  highlightStyle[DocumentApp.Attribute.BACKGROUND_COLOR] = '#FFFFFF';
  var i = 0;
  for (i in para) {
    var from = para[i].findText(startTag);
    var to = para[i].findText(endTag, from);
    if ((to != null && from != null) && ((to.getStartOffset()) - (from.getStartOffset() + startTag.length) > 0)) {
      para[i].editAsText().setBold(from.getStartOffset() + 1, to.getStartOffset() - 1, true);
      para[i].editAsText().setBackgroundColor(from.getStartOffset() + 1, to.getStartOffset() - 1, "#FFFFFF");
    }
  }
}

//function announcements_format_removeEmptyParagraphs_DUPLICATE(doc) {
//  doc = doc || DocumentApp.openById(config.files.announcements.upcoming);
//  var body = doc.getBody();
//  var paras = body.getParagraphs();
//  for (var i in paras) {
//    if (paras[i].getText() === "") {
//      if (paras[i].findElement(DocumentApp.ElementType.HORIZONTAL_RULE) === null)
//        if (paras[i].findElement(DocumentApp.ElementType.PAGE_BREAK) === null)
//          try{ paras[i].removeFromParent(); } catch(e){/*because you can't remove the last paragraph and this was simpler than real code*/};
//    }
//  }
//}

function announcements_emailStaff() {
  var doc = SpreadsheetApp.openById(config.files.staffData);
  var html = '<!DOCTYPE html><head><title>Select Names</title><script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script></head><body>';
  html += '<script> function sendEmailsSuccess(){ google.script.host.close(); } function sendEmails(){ var ea=[]; var ei=0; $(\'select[name=e1] option:selected\').each(function(){ ea[ei]=$(this).attr(\'value\'); ei++ }); $(\'select[name=e2] option:selected\').each(function(){ ea[ei]=$(this).attr(\'value\'); ei++ }); google.script.run.withSuccessHandler(sendEmailsSuccess).announcements_emailStaff_submit(JSON.stringify(ea)); } </script>';
  var sheet = doc.getActiveSheet();
  var range = sheet.getRange(3, 1, sheet.getLastRow() - 2, 2);
  var ra = range.getDisplayValues();
  
  var hselect = '<option value="-1"> </option>';
  for (var ri = 0; ri < ra.length; ri++) {
    hselect += '<option value="' + ri + '"> ' + ra[ri][0] + ' ' + ra[ri][1] + '</option>';
  }
  
  html += 'Executive Assistant: <select name="e1">' + hselect + '</select><br/>';
  html += 'Media Director: <select name="e2">' + hselect + '</select><br/>';
  html += '<input type="button" value="Send E-mails" onClick="javascript:{sendEmails();}"/></body></html>';
  var output = HtmlService.createHtmlOutput(html);
  output.setTitle('Select Users to send E-mails');
  DocumentApp.getUi().showSidebar(output);
  
}

function announcements_emailStaff_submit(jea) {
  var doc_url = DocumentApp.openById(config.files.announcements.upcoming).getUrl();
  var folder_url = DriveApp.getFolderById(config.files.slides.slidesParent).getUrl();
  
  var ea = JSON.parse(jea);
  var doc = SpreadsheetApp.openById(config.files.staffData);
  var sheet = doc.getActiveSheet();
  var range = sheet.getRange(3, 9, sheet.getLastRow() - 2, 1);
  var ra = range.getDisplayValues();
  var range2 = sheet.getRange(3, 1, sheet.getLastRow() - 2, 2);
  var ra2 = range2.getDisplayValues();
  
  var s = '';
  for (var ei = 0; ei < ea.length; ei++) {
    if (ea[ei] != '-1') {
      var i = parseInt(ea[ei]);
      s += 'VALUE=' + ra[i][0] + ';';
    }
  }
  
  //Executive Assistant
  if (ea[0] != '-1') {
    var subject = 'This Sunday\'s Announcements have just been updated';
    var body = ra2[ea[0]][0] + ' ' + ra2[ea[0]][1] + ', FYI this Sunday\'s announcements have just been updated, due to a last minute addition approved by Hunter.';
    var htmlBody = ra2[ea[0]][0] + ' ' + ra2[ea[0]][1] + ', FYI <a href="' + doc_url + '">this Sunday\'s announcements</a> have just been updated, due to a last minute addition approved by Hunter.';
    var to = ra[ea[0]][0];
    MailApp.sendEmail({
      to: to,
      subject: subject,
      body: body,
      htmlBody: htmlBody
    });
  }
  
  if (ea[1] != '-1') {
    var subject = 'This Sunday\'s Announcements have just been updated';
    var body = ra2[ea[1]][0] + ' ' + ra2[ea[1]][1] + ', FYI this Sunday\'s Service Slides have just been updated, due to a last minute addition approved by Hunter.';
    var htmlBody = ra2[ea[1]][0] + ' ' + ra2[ea[1]][1] + ', FYI <a href="' + folder_url + '">this Sunday\'s Service Slides</a> have just been updated, due to a last minute addition approved by Hunter.';
    var to = ra[ea[1]][0];
    MailApp.sendEmail({
      to: to,
      subject: subject,
      body: body,
      htmlBody: htmlBody
    });
  }
  //MailApp.sendEmail("w2kzx80@gmail.com", "TPS reports", s);
}

