function doNothing(){}

function announcements_getWeekTitles_TEST(){
  Tools.log(announcements_getWeekTitles(),true)
}

/*

This script also makes use of the Bob's Tookit library
Script ID: 164wU-9TQb1vyEi_flrGutYZHANDSugIbkQflMRAu1zpHqX4ocuCpadHM

This is soely for debugging and error reporting and should not be used for production code.
Especially seeing as it might cease to exist unexpectedly - not that it should, just being cautious.
It can be accessed using the Tools identifier.

*/

function announcements_logAllProperties_DEV(){
  var user     = PropertiesService.getUserProperties().getProperties();
  try{ var doc = PropertiesService.getDocumentProperties().getProperties();}catch(e){/* No doc props in standalone script */}
  var script   = PropertiesService.getScriptProperties().getProperties();
  log( (Object.keys(user).length ? JSON.stringify(user) : 'No user props' ) + '\n\n');
  log( (doc && Object.keys(doc).length ? JSON.stringify(doc) : 'No document props' ) + '\n\n');
  log( Object.keys(script).length ? JSON.stringify(script) : 'No script props' );
}

function analyse_DEV(){
  var body = getMasterBody();//  var body = DocumentApp.openById(id).getBody()
  var elementCount = body.getNumChildren();
  log('elementCount: '+elementCount)
  var counter = 0;
  for(var i = 0; i < elementCount; i++) {
    var child = body.getChild(i);
    Logger.log(child.getType()+' - '+body.getChildIndex(child))
  }
}

function findText_TEST(searchText){
  searchText = searchText || 'findme';//case sensitive
  searchText = '(?i)'+searchText;

  var body = getMasterBody();//var body = DocumentApp.openById(id).getBody();//typehint
  var hit = body.findText(searchText);
  log(hit ? 'hit!' : 'miss!');
  
  while (hit != null) {
    log( (hit.isPartial() ? 'partial match' : 'full match') +' : '+ hit.getElement().asText().getText())

    var element = hit.getElement().asText();
    var start = hit.getStartOffset();
    var end = hit.getEndOffsetInclusive();
    element.setBackgroundColor(start, end, "#cc00cc");
    log('start: '+start+' - end: '+end)
    
//    hit.getElement().getParent().removeFromParent()



    hit = body.findText(searchText, hit);//next hit
  }

}

function getSheetDev_(){
  return SpreadsheetApp.openById(config.files.eventsCalendar).getActiveSheet();;
}


