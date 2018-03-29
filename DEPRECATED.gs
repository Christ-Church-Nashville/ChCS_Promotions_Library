//function insertParagraph(fromOffset, toOffset, makePara, rowNumber){
//  //from/to offsets are the bounds of the page containing the correct date announcements
//  log('--insertParagraph('+fromOffset+', '+toOffset+', "'+makePara+'", '+rowNumber+')')
//  var body = getMasterBody();//  var body = DocumentApp.openById(id).getBody()
//}
//
//function insertParagraph_DEPRECATED(fromOffset, toOffset, makePara, rowNumber){
//  //from/to offsets are the bounds of the page containing the correct date announcements
//  log('--insertParagraph('+fromOffset+', '+toOffset+', "'+makePara+'", '+rowNumber+')')
//  var body = getMasterBody();//  var body = DocumentApp.openById(id).getBody()
//  var foundParagraph;
//  var searchText = ' '+rowNumber+' ';//avoid false positive (like row 4 in row 42)
//  
//  log('fromOffset: '+fromOffset)
//  log('toOffset: '+toOffset)
//  
//  ///this is all or nothing - it either updates or inserts but not both
//  ///need to check each and insert if missing or ipdate if found
//  ///or remove all, then reinsert
//  //ah, it used to do them all, then was changed to insert onluy the first
//  //so update or insert makes sense now
//  //the remainedr are added by addEventToSundays()
//  
//  //search for children for matching row number and replace if found
//  //remember, the doc is in reverse order so from > to
//  for(var j=--toOffset; j<=fromOffset; j++){
//    var child = body.getChild(j);
//    var txt = child.asText().getText();
//    if(txt.indexOf(searchText) > -1){
//      log('j: '+j+' - txt: '+txt)
//      foundParagraph = true;
//      //child.asText().setBackgroundColor('#fff2cc')//debug
//      child.asText().replaceText('.*', makePara);//just replace the text, no need to delete and re-add
//      if(config.responseForm.subtitlesList.indexOf(txt) > -1) responseForm_applyStyleForSubTitle(child);
//      else applyStyleCurrent(child);
//    }
//  }
//  
//  //If makePara not found, append new paragraph at end of day
//  if( ! foundParagraph){
//    log('NOT foundParagraph...')
//    for(var k=fromOffset; k>=toOffset; k--){//from the end or adding paragraphs will mess with the offset
//      var child = body.getChild(k);
//      if(child.asParagraph().findElement(DocumentApp.ElementType.PAGE_BREAK)){
//        //        var color = child.getForegroundColor();//var color = getColorOfCurrent(k);//expensive
//        child.asText().setBackgroundColor('#fff2cc')//debug
//        log('Inserting at '+k)
//        body.insertParagraph(k, makePara);
//        applyStyleCurrent(body.getChild(k));
//      }
//    }
//  }
//  
//}
//
//function addEventToSundays_TEST(){
//  addEventToSundays(new Date('2017-12-31'), "[ Blargl | | Gold Row 4 | | Bob Rupholdt ] 01.01;", 4);
//}
//function addEventToSundays(date, makeParaForSunday, rowNumber){
//  log('--addEventToSundays('+fDate(date)+', '+makeParaForSunday+', '+rowNumber+')')
//  
//  date = new Date(date);
//  log(fDate(date))
//  var fromStr = Utilities.formatDate(date, 0, "'[' MM.dd '] Sunday Announcements'");
//  log('fromStr: '+fromStr)
//  
//  date.setDate(date.getDate() - 7);
//  log(fDate(date))
//  var toStr = Utilities.formatDate(date, 0, "'[' MM.dd '] Sunday Announcements'");
//  log('toStr: '+toStr)
//  return
//  
//  var body = getMasterBody();//  var body = DocumentApp.openById(id).getBody()
//  var fromOffset, toOffset;
//  log('body.getNumChildren(): '+body.getNumChildren())
//  
//  var fromOffset = searchInMaster(fromStr)
//  var toOffset = searchInMaster(toStr)
//  log('Offsets: '+fromOffset+' : '+toOffset)      
//
////  if(fromOffset && toOffset)
////    insertParagraph(fromOffset, toOffset, makeParaForSunday, rowNumber);
//  //else do nothing
//}
//
//function deleteParagraphsByRowIdentifier(prefix){//prefix like 'Silver Row 9'
////  prefix = prefix || 'Silver Row 9'///dev
//  if( ! prefix) throw 'Prefix is required';
//
//  var body = getMasterBody();//var body = DocumentApp.openById(id).getBody()
//  var paragraphs = body.getParagraphs();
//
//  for(var p in paragraphs){
//    var para = paragraphs[p];
//    var hit =  para.findText(prefix);
//    if(hit)
//      hit.getElement().getParent().removeFromParent();
//  }
//
//}
//
//

//function getPromoStartDate_DEPRECATED(date){
//  log( '--getPromoStartDate('+fDate(date)+')' )
//  date = getUpcomingSunday(date);
//  date.setDate(date.getDate() -(config.responseForm.deadline * 7));//deadline is in weeks
//  log('promoStartDate returned: '+fDate(date));
//  return date;
//}

//function getPromoEndDate_TEST_DEPRECATED(){log(fDate(getPromoEndDate(new Date('2018/02/15 17:00:00'))))}
//function getPromoEndDate_DEPRECATED(date){
//  log( '--getPromoEndDate('+fDate(date)+')' )
//  date = new Date(date);
//  date.setDate(date.getDate() -7);//get the Sunday before
//  date = getUpcomingSunday(date);
//  log('promoEndDate returned: '+fDate(date));
//  return date;
//}

//function getMinimumPromoStartDate_DEPRECATED(){
//  log( '--getMinimumPromoStartDate('+fDate(date)+')' )
//  var date = getUpcomingSunday();
//  date.setDate(date.getDate() +config.responseForm.minimumPromoStartDate);
//  log('minimumPromoStartDate returned: '+fDate(date));
//  return date;
//}

//function getPromoStartDate_TEST(){log(getPromoStartDate(new Date(), 'gold'))}
//function getPromoStartDate(date, tier){
//  return dateAdd(getUpcomingSunday(date), 'day', -1 * config.responseForm.deadlines[tier.toUpperCase()])
//  log( '--getPromoStartDate('+fDate(date)+')' )
//  date = getUpcomingSunday(date);
//  date.setDate(date.getDate() - config.responseForm.deadlines[tier.toUpperCase()]);
//  log('promoStartDate returned: '+fDate(date));
//  return date;
//}

//function getPromoEndDate_TEST(){log(fDate(getPromoEndDate(new Date('2018/02/15 17:00:00'))))}
//function getPromoEndDate(date){
//  log( '--getPromoEndDate('+fDate(date)+')' )
//  date = new Date(date);
//  date.setDate(date.getDate() -7);//get the Sunday before
//  date = getUpcomingSunday(date);
//  log('promoEndDate returned: '+fDate(date));
//  return date;
//}

//function getMinimumPromoStartDate(){
//  log( '--getMinimumPromoStartDate('+fDate(date)+')' )
//  var date = getUpcomingSunday();
//  date.setDate(date.getDate() +config.responseForm.minimumPromoStartDate);
//  log('minimumPromoStartDate returned: '+fDate(date));
//  return date;
//}

//function calendar_checkDeadlines_DEPRECATED() {
//  /*
//  
//  This version checks the promo type and sends email only for the selected tier and below.
//  
//  */
//  //check event date vs deadlines, send notifications at
//  //three days before deadline, 1 day before deadline and day after deadline
//  var ss = SpreadsheetApp.openById(config.files.eventsCalendar);
//  var sheet = ss.getSheetByName(config.eventsCalendar.dataSheetName);
//  var values = sheet.getDataRange().getValues();
//  var promoTypes = {BRONZE:8, SILVER:9, GOLD:10};//column number for matching promo type
//  
//  var today = getMidnight();//midnight, duh
//
//
//  
////                if(config.debugEmail) today = new Date(today.setDate(today.getDate()-1))//debug to check past dates
//
//  
//  
//  for(var row=sheet.getFrozenRows(); row<values.length; row++) {
//    var promoRequested = values[row][6].toLowerCase() == 'yes';
//    if(promoRequested) continue;//already requested, no need to continue
//    
//    var promoType = values[row][2].toUpperCase();
//    //var promoDeadline  = values[row][promoTypes[promoType]] || null;//nope, this grabs only the assigned promotype and we need to check all the way down to bronze
//    var promoDeadline, dateDiffInDays;
//    switch(promoType){ //bad form, the next bit assumes there really is a date in the columns that should never have anything but a date in them
//      case 'GOLD'   :
//        promoDeadline = values[row][promoTypes.GOLD];
//        dateDiffInDays = DateDiff.inDays(today, promoDeadline);
//        if([-1,1,3].indexOf(dateDiffInDays) > -1){
//          log('Row: '+(row+1)+' - '+promoType+' '+dateDiffInDays)
//          break;
//        }
//      case 'SILVER' :
//        promoDeadline = values[row][promoTypes.SILVER];
//        dateDiffInDays = DateDiff.inDays(today, promoDeadline);
//        if([-1,1,3].indexOf(dateDiffInDays) > -1){
//          log('Row: '+(row+1)+' - '+promoType+' '+dateDiffInDays)
//          break;
//        }
//      case 'BRONZE' :
//        promoDeadline = values[row][promoTypes.BRONZE];
//        dateDiffInDays = DateDiff.inDays(today, promoDeadline);
//        if([-1,1,3].indexOf(dateDiffInDays) > -1){
//          log('Row: '+(row+1)+' - '+promoType+' '+dateDiffInDays)
//          break;
//        }
//      default://skip this row, no valid promotion type found 
//        if(promoType != 'N/A')
//          log('.        Row: '+(row+1)+' "'+promoType+'" '+fDate(promoDeadline)+' '+dateDiffInDays)
//        continue;
//    }
//if(config.debugEmail)     continue;//for
//if(config.debugEmail) return;
////log('Row: '+row+' - '+DateDiff.inDays(today, promoDeadline));continue
//
//    var eventDate      = values[row][3];
//    var eventName      = values[row][4];
//    var staffSponsor   = values[row][7];//this is the sponsoring team, not the person
//    var spreadsheetUrl = ss.getUrl();
//    var to, subject, body;
//    
//    //    if(promoDeadline){//if valid date, go for it, else can't do anything
//    //    if(promoRequested && Object.keys(promoDeadlines).length){//if valid date, go for it, else can't do anything
//    if(dateDiffInDays){
//
//      ///debug - for calendar_checkDeadlines_TEST_AS_BOB()
//      ///debug - for calendar_checkDeadlines_TEST_AS_BOB()
//      ///debug - for calendar_checkDeadlines_TEST_AS_BOB()
//      
//      //list specific row values
////      if(config.debugEmail && [105, 106, 118, 119, 139, 140].indexOf(row+1) >-1){
////        log('\n\
////Row  : '+(row+1)+'\n\
////Type : '+promoType+'\n\
////Diff : '+dateDiffInDays+'\n\
////Date : '+fDate(promoDeadline)+'\n')
////continue;
////      }
//      
//      //      log(ss.getUrl());return
//
//      //list matching rows
////      if(config.debugEmail){
////        if([-1,1,3].indexOf(dateDiffInDays) >-1){
////          //send email
////          log('\n\
////Row  : '+(row+1)+'\n\
////Type : '+promoType+'\n\
////Diff : '+dateDiffInDays+'\n\
////Date : '+fDate(promoDeadline)+'\n')
////        }
////        continue;
////      }
//      
//      ///end debug
//      ///end debug
//      ///end debug
//      
//      var staff = calendar_getStaff();//get all staff memebers
//      var teamLeads = staff.filter(function(i){return i.isTeamLeader})//remove non-team leaders
//      //      log(teamLeads);return
//      var teams = teamLeads.reduce(function (out, cur) {
//        if(cur.isTeamLeader) out[cur.team] = {name:cur.name,email:cur.email};
//        return out;
//      },{});
//      //      log(teams)
//      //      log(staffSponsor)
//      //      log(teams[staffSponsor])
//      to = teams && teams[staffSponsor] && teams[staffSponsor].email;
//      to = to || vLookup('Communications Director', SpreadsheetApp.openById(config.files.staffData).getDataRange(), 4, 8);///should make a function for this getCommunicationsDirector()
//
//      switch(DateDiff.inDays(today, promoDeadline)){
//          
//        case -1: //one day past final (Bronze) deadline - sent to communications director - they've just missed the last chance for any promotion
//          sheet.getRange(row+1, 7).setValue('N/A');//col 7 = PROMO REQUESTED
//          calendar_updateEventStatus(row+1);
//          var staffRange = SpreadsheetApp.openById(config.files.staffData).getDataRange();
//          to = vLookup('Communications Director', staffRange, 4, 8);
//          subject = "Attention: a final promotion deadline has lapsed"
//          body = "\
//This is an automated notice that the \
//{promoType} deadline for \
//{eventName} has lapsed without action by the staff sponsor, \
//{staffSponsor}";
//          break;
//          
//        case 1: //day before promoType deadline - sent to team leader
//          subject = Utilities.formatString("Reminder: %s deadline for [%s] %s", promoType, eventDate, eventName);
//          body = "\Hi \
//{recipient}<br><br>This is an automated reminder that the \
//{promoType} \
//promotion deadline for your team's event, [ \
//{eventDate} ] \
//{eventName}, is tomorrow. This is the last reminder for a {promoType} promotion for your event.<br><br>If you would like to schedule promotion for your team's event please submit a <a href='\
//{formUrl}\'>{promoType} Promotion Request</a> or schedule a <a href='https://calendly.com/chad_barlow/promo'>Promotion Planning Meeting</a> by \
//{promoDeadline}. <br><br>Need more information? Visit your team's <a href='\
//{spreadsheetUrl}'>Event Sponsorship Page</a> or reply to this email.<br><br><b>N.B. Team Leader, please forward this email to the appropriate person on your team who you would like to initiate a promotion request!</b><br><br>Chad\
//";
//          break;
//          
//        case 3: //3 days before promoType deadline
//          subject = Utilities.formatString("Reminder: %s deadline for [%s] %s", promoType, eventDate, eventName);
//          body = "Hi \
//{recipient}<br><br> This is an automated reminder that the \
//{promoType} promotion deadline for your team's event, [ \
//{eventDate} ] \
//{eventName}, is tomorrow. <br><br>If you would like to request \
//{promoType} promotion for your team's event, please submit a <a href='\
//{formUrl}\
//'>Promotion Request</a> or schedule a <a href='https://calendly.com/chad_barlow/promo'>Promotion Planning Meeting</a> by \
//{promoDeadline}. If you do not want to request \
//{promoType} promotion for this event, you may ignore this email. <br><br> Need more information? Visit your team's <a href='\
//{spreadsheetUrl}'>Event Sponsorship Page</a> or reply to this email.<br><br><b>N.B. Team Leader, please forward this email to the appropriate person on your team who you would like to initiate a promotion request!</b><br><br>Chad\
//";
//          break;
//          
//        default: continue;//skip record for all other values
//      }
//      
//      body = body
//      .replace(/{recipient}/g,      to )
//      .replace(/{staffSponsor}/g,   staffSponsor )
//      .replace(/{eventDate}/g,      fDate(eventDate) )
//      .replace(/{eventName}/g,      eventName )
//      .replace(/{promoType}/g,      promoType )
//      .replace(/{promoDeadline}/g,  fDate(promoDeadline) )
//      .replace(/{spreadsheetUrl}/g, spreadsheetUrl )
//      .replace(/{formUrl}/g,        config.eventsCalendar.promoFormUrl )
//      ;
//      
//      MailApp.sendEmail({
//        name: config.eventsCalendar.notifyFromName,
//        to: config.debugEmail || to,
//        subject: subject,
//        htmlBody: body
//      });
//      
//    }
//    
//  }
//}
