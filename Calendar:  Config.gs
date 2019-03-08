try{

  config.eventsCalendar = {
  
    dataSheetName  : 'Communications Director Master',
    notifyFromName : 'Chad Barlow <chbarlow@gmail.com>',//should this be communications@ccnash.org?
    promoFormUrl   : 'https://docs.google.com/forms/d/e/1FAIpQLSdin9MFXdUjCNqDsy3Th5a82-wgvGlIl6668NUmIggLSFULeg/viewform',
    formUrls : {///this has been replaced
      //      Bronze : 'http://example.org/BronzeFormURL-update-this-in-config.eventsCalendar',///
      //      Silver : 'http://example.org/SilverFormURL-update-this-in-config.eventsCalendar',///
      //      Gold   : 'http://example.org/GoldFormURL-update-this-in-config.eventsCalendar',///
    },
    
    emails : {
    
      expired : { //one day past final (Bronze) deadline - sent to communications director - they've just missed the last chance for any promotion
        subject : "Attention: a final promotion deadline has lapsed",
        body : "\
This is an automated notice that the \
{promoType} deadline for \
{eventName} has lapsed without action by the staff sponsor, \
{staffSponsor}",
      },
      
      oneDay : { //day before promoType deadline - sent to team leader
        subject : "Reminder: %s deadline for [ %s ] %s",
        body : "\Hi \
{recipient},<br><br>This is an automated reminder that the \
{promoType} \
promotion deadline for your team's event, [ \
{eventDate} ] \
{eventName}, is tomorrow. This is the last reminder for a {promoType} promotion for your event.<br><br>If you would like to schedule promotion for your team's event please submit a <a href='\
{formUrl}\'>{promoType} Promotion Request</a> or schedule a <a href='https://calendly.com/chadbarlow/promo'>Promotion Planning Meeting</a> by \
{promoDeadline}. If you do not want to request \
{promoType} promotion for this event, you may ignore this email. </b><br><br>Chad<br><br>--<br>P.S. If appropriate, please forward this email to the team member responsible for initiating a promotion request. <br><br> Need more information? Visit your team's <a href='\
{spreadsheetUrl}'>Event Sponsorship Page</a> or reply to this email.\
",
      },
      
      threeDays : { //3 days before promoType deadline
        subject : "Reminder: %s deadline for [ %s ] %s",
        body : "Hi \
{recipient},<br><br> This is an automated reminder that the \
{promoType} promotion deadline for your team's event, [ \
{eventDate} ] \
{eventName}, is in three days. <br><br>If you would like to request \
{promoType} promotion for your team's event, please submit a <a href='\
{formUrl}\
'>Promotion Request</a> or schedule a <a href='https://calendly.com/chadbarlow/promo'>Promotion Planning Meeting</a> by \
{promoDeadline}. If you do not want to request \
{promoType} promotion for this event, you may ignore this email. </b><br><br>Chad<br><br>--<br>P.S. If appropriate, please forward this email to the team member responsible to initiating a promotion request. <br><br> Need more information? Visit your team's <a href='\
{spreadsheetUrl}'>Event Sponsorship Page</a> or reply to this email.\
",
      },
      
    },
  };
  
//  if(config.debug) config.errorNotificationEmail.push('bob+ccn-library-calendar@rupholdt.com');///debug - uncomment to let developer receive errors
//  if(config.debug) config.errorNotificationEmail = ['bob+ccn-library-calendar@rupholdt.com'];///during development, don't pester chad = turn off at golive
  
}
catch(e) { err('Unable to set config.eventsCalendar') }
