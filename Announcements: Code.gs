/******************************************************************************

Recurring content directives should be enclosed in two sets of angle brackets:
<< first, last, 04.22, before fifth >>

Multiple directives can be included and each will be processed.
Directives can duplicate content so use care.
e.g.: << fifth, last >> will give you two entries if there is a fifth Sunday

Only the first set of options in angle brackets (<< >>) is processed. 
Additional sets are considered part of the content.

Commas are optional but help with readability.
Extra spaces are ignored.

Valid options are:
<< first, second, third, fourth, fifth, last >>
Shown when the week ordinal matches the directive.
"Fifth" will not be shown if the month has no fifth Sunday.  Use "last" for this.
"Last" will be shown on the Fourth or Fifth as appropriate.

<< before fifth >>
Shown on the fourth Sunday only when there is a fifth Sunday in the month.

<< 04.22, 10.28 >>
Shown on the exact date only.
If the date given is not a Sunday, it will not be shown.
Note that the format requires the leading zero if the month or day is a single digit.

*****************************************************************************

*/

function announcements_master_insertMonth(){///consider adding UI prompts
  //Note: This adds weeks for the next month. 
  //If the current month is missing Sundays, it adds them instead
  var doc = DocumentApp.openById(config.files. announcements.master);
  var body = doc.getBody();
  //find last sunday
  var latestInsertedSundayRange = body.findText(config.announcements.sundayPagePattern);
  if(! latestInsertedSundayRange) throw 'Error finding previous Sunday.  Unable to continue.';
  var insertIndex = body.getChildIndex(latestInsertedSundayRange.getElement().getParent());
  var latestSundayShortcode = latestInsertedSundayRange.getElement().getParent().getText().match(/\d{2}\.\d{2}/)[0];//we know there's a match so get the data, no checks needed
  var latestInsertedSundayDate = announcements_getDateFromShortcode(latestSundayShortcode);
  //insertWeeksEndDate: finish the current month or add the next month
  var insertWeeksEndDate = latestInsertedSundayDate.getMonth() == dateAdd(latestInsertedSundayDate, 'week', 1).getMonth()
  ? announcements_getLastSundayOfMonth( latestInsertedSundayDate )                       //last Sunday of this month
  : announcements_getLastSundayOfMonth( dateAdd(latestInsertedSundayDate, 'month', 1) ); //last Sunday of next month
  
  var weeksToAdd = Math.round( ( insertWeeksEndDate.getTime() - latestInsertedSundayDate.getTime() ) / ( 7*24*60*60*1000 ) );//date diff / 1 week
  announcements_master_insertWeeks(weeksToAdd);
}


function announcements_master_insertWeeks(numWeeks){///occasionally adds one week too many
  numWeeks = numWeeks || 1;
  var doc = DocumentApp.openById(config.files. announcements.master);
  var body = doc.getBody();

  announcements_format_master_fixPageBreaksAndHeadings();//ensure everything is formatted correctly before we begin
  
  //find latest sunday
  var latestInsertedSundayRange = body.findText(config.announcements.sundayPagePattern);
  if(! latestInsertedSundayRange) throw 'Error finding previous Sunday.  Unable to continue.';
  var insertIndex = body.getChildIndex(latestInsertedSundayRange.getElement().getParent());
  var latestSundayShortcode = latestInsertedSundayRange.getElement().getParent().getText().match(/\d{2}\.\d{2}/)[0];//we know there's a match so get the data, no checks needed
  var latestInsertedSundayDate = announcements_getDateFromShortcode(latestSundayShortcode);

  for(var i=1; i<=numWeeks; i++){
    doc = DocumentApp.getActiveDocument();//have to do it this way or it errors with "too many changes"
//    doc = DocumentApp.openById(config.files. announcements.master);///try this again now that things have changed
    body = doc.getBody();
    var dateToInsert = new Date(new Date(latestInsertedSundayDate).setDate(latestInsertedSundayDate.getDate()+(7*i)));
    var newPageTitle = Utilities.formatDate(dateToInsert, Session.getScriptTimeZone(), "'[' MM.dd '] Sunday Announcements'");
    //add content in reverse at the insertIndex so we don't have to recalculate the index repeatedly
    //new page
    body.insertPageBreak(insertIndex);//inserts a pagebreak wrapped by a paragraph
    //add recurring content
    announcements_insertRecurringContent(dateToInsert, insertIndex);
    //add page subtitle (ordinal Sunday)
    body.insertParagraph(insertIndex, getSundayOfMonthOrdinal(dateToInsert) + ' Sunday of the month')
    .setHeading(DocumentApp.ParagraphHeading.HEADING2);
    //add page title
    body.insertHorizontalRule(insertIndex);
    var pageTitle = body.insertParagraph(insertIndex, newPageTitle)
    .setHeading(DocumentApp.ParagraphHeading.HEADING1)//uses heading1 font settings, no need to add them here
    //    pageTitle.setAttributes(config.announcements.format.future);//should use default styles
    doc.setCursor(doc.newPosition(pageTitle, 0));//was for debug but I find it handy to end up at the top of the document
    doc.saveAndClose();//to avoid the "too many changes" error, close the doc then reopen it to add the next week
  }//next week
  
}

function announcements_insertRecurringContent(date, childIndex) {
  date = date || new Date(); ///debug
  var doc = DocumentApp.openById(config.files. announcements.master);
  var body = doc.getBody();
  var recurringContent = announcements_getRecurringContent();//{} with items parsed by directives i.e.: {first=[Paragraph],third=[Paragraph],date:{"2018-03-04":[Paragraph],}, ...}
  //  Logger.log(recurringContent);return;

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Keys in recurringContent, present only when there are matching paragraphs, data is an array:
  // beforeFifth (fourth Sunday in a month with 5 Sundays), 
  // first, second, third, fourth, fifth, 
  // last (fourth or fifth Sunday), 
  // date (an object with date keys like '2018-04-22' which then contain an array of paragraphs), 
  // noMatchingDirective (in list but no known directive match)
  
  var dateOrdinal = getSundayOfMonthOrdinal(date).toLowerCase();//like: 'first'
  var isNextSundaySameMonth = date.getMonth() == dateAdd(date, 'week', 1).getMonth();//only false on the last Sunday of the month
  var isBeforeFifth = dateOrdinal=='fourth' && isNextSundaySameMonth;//only true if it's the fourth Sunday and there is a fifth Sunday
  var isLast = ! isNextSundaySameMonth;//only true on the last Sunday of the month
  
  //check in this order to avoid duplicates: specific date, beforeFifth, last, ordinal

  if(recurringContent.date){
    var pageDate = Utilities.formatDate(date, 0, 'yyyy-MM-dd');
    for(var d in recurringContent.date)//p like 2018-04-22
      if(pageDate == d)//if current page date matches recurringContent.date
        for(var p in recurringContent.date[d])
          announcements_insertParagraphCopy(body, recurringContent.date[d][p], childIndex);
  }

  if(recurringContent.beforeFifth && isBeforeFifth){
    for(var p in recurringContent.beforeFifth)
      announcements_insertParagraphCopy(body, recurringContent.beforeFifth[p], childIndex);
  }

  if(recurringContent.last && isLast){
    for(var p in recurringContent.last)
      announcements_insertParagraphCopy(body, recurringContent.last[p], childIndex);
  }

  if(recurringContent[dateOrdinal]){
    for(var p in recurringContent[dateOrdinal])
      announcements_insertParagraphCopy(body, recurringContent[dateOrdinal][p], childIndex);
  }
  
  //and we aren't doing anything with recurringContent.noMatchingDirective as we assume it's either a new directive or a typo

}

function announcements_insertParagraphCopy(body, paragraph, childIndex){
  var directivePattern = /<<.*?>>/;
  var para = body.insertParagraph(childIndex++, paragraph.copy());
  //para.replaceText(directivePattern, '');//this doesn't work?? no error, just no change
  para.setText(para.getText().replace(directivePattern, ' '));//replace directive with a single space
}

function announcements_getRecurringContent(){
  //get start and end indices for recurring content
  var body = DocumentApp.openById(config.files. announcements.master).getBody();
  var recurringContent = [];
  var recurringContentRange = body.findText('(?i)\\[ RECURRING CONTENT ]');//this grabs the first one found, not there there should be more than one
  var recurringContentStart = body.getChildIndex(recurringContentRange.getElement().getParent());//the range is a text element, get its parent's index
  var recurringContentEnd   = body.getChildIndex(body.findElement(DocumentApp.ElementType.PAGE_BREAK, recurringContentRange).getElement().getParent())//get the index of the next pagebreak (hard breaks only)
  //Note: recurringContentEnd could use the first date page as the final index if there ever needs to be hard pages in the recurring content section
  
  //iterate over elements in found range collecting announcements, skipping blank paragraphs
  for(var i=recurringContentStart+1; i<=recurringContentEnd; i++){//+1 to skip the page title [ RECURRING CONTENT ]
    var text = body.getChild(i).asParagraph().getText();
    if(text)
      recurringContent.push(body.getChild(i));//if it's not blank, store the element
  }
  
  //arrange announcements by type in an object
  var output = {};
  for(var i in recurringContent) {
    //extract directives found between << angle braces >>
    var paragraph = recurringContent[i].asParagraph(); //var paragraph = body.findElement(elementType).getElement().asParagraph()
    var text = paragraph.getText();
    var directive = text.match(/<< *(.*?) *>>/);//returns the directive, trimmed, without the enclosures
    ///consider: var directives = directive.replace('before fifth', 'beforeFifth').split(' ') then use directives.indexOf('first') - naw: prefer regex simplicity
    if(!directive) continue;//a directive is required or we skip it
    directive = directive[1];//directive 0 = '<<directive>>' while directive[1] = 'directive' without the enclosures
    
    var beforeFifth = directive.match(/before *fifth/i);//check this first or it will get caught by nth Sunday test
    var beforeFifth = beforeFifth || directive.match(/when *a *fifth *Sunday *exists/i);//this is temporary to match old format
    directive = directive.replace(/before *fifth/i, '').replace(/when *a *fifth *Sunday *exists/i, '');//remove these so "fifth" doesn't trigger a false match later
    //<<announcement should be appended on the fourth Sunday of the month when a fifth Sunday exists in the same month>>
    //<<before fifth>>
    if(beforeFifth){
      if( ! output.beforeFifth) output.beforeFifth = [];
      output.beforeFifth.push(paragraph);
    }
    
    var ordinalSunday = directive.match(/(?:first|second|third|fourth|fifth|last)/gi);//note: this can have mutiple matches
    // <<announcement should be appended on the first Sunday of the month>> 
    // <<first>>, <<second>>, <<last>>, <<first Sunday>>, etc
    if(ordinalSunday){
      for(var o in ordinalSunday){//for each matching ordinal
        var oSunday = ordinalSunday[o].toLowerCase();
        if( ! output[oSunday]) output[oSunday] = [];//like: output['first'] = []
        output[oSunday].push(paragraph);
      }
    }
    
    var specificSunday = directive.match(/\d{2}\.\d{2}/g);//matches "03.10" - multiple possible
    //<<announcement should be appended on 03.04, 10.28>>
    //<<03.04, 10.28>> or [03.04] but not 3.04, 03-04
    if(specificSunday && specificSunday.length){
      for(var s in specificSunday){
        var dayt = Utilities.formatDate(announcements_getDateFromShortcode(specificSunday[s]), Session.getScriptTimeZone(), "yyyy-MM-dd");
        if( ! output.date) output.date = {};
        if( ! output.date[dayt]) output.date[dayt] = [];
        output.date[dayt].push(paragraph);
      }
    }
    
    //if nothing else caught it, then stick it here
    if( ! output.noMatchingDirective) output.noMatchingDirective = [];
    output.noMatchingDirective.push(paragraph);
    ///maybe notify someone... ////what think ye, chad? 
    
  }
  
//  Logger.log(output);
  return output;
}

function announcements_getDateFromShortcode(shortcode){//shortcode = '03.10' or contains such
  var monthDay = shortcode.split('.');
  if( ! monthDay.length == 2) throw 'Invalid shortcode';
  var month = monthDay[0]-1;
  var day   = monthDay[1];
  var year  = parseInt(month) < new Date().getMonth()+1 //of month < current month
  ? new Date().getFullYear()+1 // it's next year
  : new Date().getFullYear();  // else it's this year
  
  return new Date(year, month, day);
}

function announcements_getLastSundayOfMonth(date){
  date = new Date(date);
  date.setMonth( date.getMonth() +1 );//add a month
  date.setDate(0);//subtract one day for last day of previous month
  date.setDate( date.getDate() - date.getDay() );//subtract current day to get to Sunday prior
  
  return date;
}

function announcements_compareStrings(s1, s2) {
  var sa1 = s1.split(' ');
  var sa2 = s2.split(' ');
  var s1cnt = 0;
  var s1l = sa1.length;
  var s1i = 0;
  var sa1tmp = [];
  for (s1i = 0; s1i < s1l; s1i++) {
    if (sa1[s1i].match(/.*[a-z]{2}.*/i)) {
      sa1tmp[s1cnt] = sa1[s1i].replace(/[^a-z]+/i, '');
      s1cnt++;
    }
  }
  sa1 = sa1tmp;
  var s2cnt = 0;
  var s2cntm = 0;
  var s2i = 0;
  var s2l = sa2.length;
  for (s2i = 0; s2i < s2l; s2i++) {
    if (sa2[s2i].match(/.*[a-z]{2}.*/i)) {
      sa2[s2i] = sa2[s2i].replace(/[^a-z]/i, '');
      s2cnt++;
      for (s1i = 0; s1i < s1cnt; s1i++) {
        if (sa2[s2i] == sa1[s1i]) s2cntm++;
      }
    }
  }
  if (s1cnt < s2cnt) return s2cntm / s1cnt;
  return s2cntm / s2cnt;
}

