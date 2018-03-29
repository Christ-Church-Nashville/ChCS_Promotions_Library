//um these are all referenced only in deprecated code

//function responseForm_applyStyleForSubTitle(element){
//  log('--applyStyleForSubTitle(element)')
//  element
//  .setAttributes(config.responseForm.format.subtitle)
//  .setHeading(DocumentApp.ParagraphHeading.HEADING2);
//}

//function responseForm_applyStyleCurrent(element){
//  log('--responseForm_applyStyleCurrent(element)')
//  var style = config.responseForm.format.current;
//  element.setForegroundColor("#ff0000").setAttributes(style);
//  responseForm_setTitleStyle(element);
//}

//function responseForm_applyStyleWithColor(element, color){
//  log('--applyStyleWithColor(element, "'+color+'")')
//  var style = config.responseForm.format.current;
//  element.setForegroundColor(color).setAttributes(style);
//  responseForm_setTitleStyle(element);
//}

//function responseForm_setTitleStyle(element){
//  /// I'm not sure what the purpose of this is.  It should be set using default styles or headings
//  log('--responseForm_setTitleStyle(element)')
//
//  var text = element.asText().getText();//var element = DocumentApp.openById(id).getBody().getChild(childIndex)
//  var startIndex, endIndex;
//  for(var j=0; j<text.length; j++){
//    //need the first matched set of [], can't use indexOf as '[[]]' would fail with mismatched set - not that it should EVER look like that
//    //could use a regex but this works
//    if(text[j] == "[") startIndex = j;
//    if(startIndex && text[j] == "]"){
//      endIndex = j;
//      break;
//    }
//  }
//  
//  if(startIndex && endIndex){
//    element.asText().setAttributes(startIndex, endIndex, {
//      FONT_FAMILY : "Lato",
//      FONT_SIZE   : 9,
//      BOLD        : true
//    });
//  }
//
//}

