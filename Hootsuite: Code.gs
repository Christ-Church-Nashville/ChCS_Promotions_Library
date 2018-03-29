function makeMenu_hootsuite() {
  SpreadsheetApp.getUi().createMenu("[ Custom Menu ]")
  .addItem("Add Recurring Events", "PL.hootsuite_importRecurringEvents")
  .addItem("Delete All Rows", "PL.hootsuite_deleteRows")
  .addItem("Save to Drive", "PL.hootsuite_saveAsCSV")
  .addToUi();
}

function hootsuite_deleteRows() {
  var sheet = SpreadsheetApp.getActive().getSheetByName("Current Month");
  var start, end;
  sheet.deleteRows(2, sheet.getLastRow() -1);
}

//var ui = SpreadsheetApp.getUi();
function hootsuite_saveAsCSV() {///yeah, this doesn't work
  //the developer got this from: https://gist.github.com/mderazon/9655893

  ////Hey Chad, do you need this in drive or can it download to your local system when you need it?
  //why not link to the download url instead? show link in a madal window
  //uses the doc name - sheet name
  //Utilities.formatString('https://docs.google.com/spreadsheets/d/%s/export?format=%s&gid=%s', sheet.getParent().getId(), 'csv', sheet.getSheetId())//csv|pdf|odt|doc
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var folder = DriveApp.getFoldersByName("My Drive");//or specify a folder/fodlername in config and use that
  for (var i in sheets.length) {//this will create a file for each sheet but they all have the same name, derp
    var sheet = sheets[i];
    var fileName = 'Upload to Hootsuite.csv';// don't forget the .csv extension
    var csvFile = convertRangeToCsvFile_(sheet);// convert all available sheet data to csv format
    DriveApp.createFile(fileName, csvFile);// create a file in the Docs List with the given name and the csv data
  }
  Browser.msgBox("File has been saved to Google Drive as '" + fileName + "'");///this should supply a link, use a modal
}

function hootsuite_convertRangeToCsvFile_(sheet) {
  var activeRange = sheet.getDataRange();
  try {
    var data = activeRange.getValues();
    
    // loop through the data in the range and build a string with the csv data
    if (data.length > 1) {
      var csv = "";
      for (var row = 1; row < data.length; row++) {
        var str1 = data[row][1].replace(/[\u2018\u2019]/g, "'");//left and right single quotes to regular single quotes
        csv += '"' + data[row][0] + '","' + str1 + '","' + data[row][2] + '"\r\n';
      }
      var csvFile = csv;
    }
    
    return csvFile;
    
  } catch (err) {
    Logger.log(err);
    Browser.msgBox(err);
  }
}

function hootsuite_importRecurringEvents() {
  hootsuite_insertRecurringContent_(31); //number of days to search for announcement date ///maybe should use month.days
}

function hootsuite_insertRecurringContent_(daysToSearch) {
  ///move to config
  //  var ss = SpreadsheetApp.openById(config.files.hootsuite);
  //  var ss = SpreadsheetApp.getActive();
  var announcementsFile = DocumentApp.openById(config.files.announcements.master); //source file
  var sheet = SpreadsheetApp.getActive().getSheetByName("Current Month");
  if (!sheet) throw 'Error opening sheet "Current Month" in ' + SpreadsheetApp.getActive().getName()
  
  var NUM_EXECUTIONS = getNumExecutions_();
  var BASE_DATE = new Date("January 21, 2018");
  var DATE_FOR_THIS_EXECUTION = new Date(BASE_DATE.getYear(), BASE_DATE.getMonth(), BASE_DATE.getDate() + (7 * NUM_EXECUTIONS));
  
  var body = announcementsFile.getBody();
  var numChildren = body.getNumChildren();
  var pageBreakCounter = 0;
  var insertIndex = 0;
  var recurringContentParagraphs = [];
  
  for (var i = 0; i < numChildren; ++i) {
    var child = body.getChild(i);
    var childType = child.getType();
    if (childType == DocumentApp.ElementType.PAGE_BREAK) {
      ++pageBreakCounter;
      continue;
    }
    if (childType == DocumentApp.ElementType.PARAGRAPH) {
      var paragraph = child.asParagraph();
      var paragraphNumChildren = paragraph.getNumChildren();
      if (pageBreakCounter == 0) {
        var text = paragraph.getText();
        if ((text != "[ RECURRING CONTENT ]") && (text != "")) {
          //ui.alert(child.asParagraph().getText());
          //return;
          var paraText = child.asParagraph().getText();
          if (paraText.indexOf("??>>??") == -1) {
            recurringContentParagraphs.push(child.asParagraph());
          }
        }
      }
      if (pageBreakCounter > 1) {
        insertIndex = i;
        break;
      }
      var foundPageBreak = false;
      for (var j = 0; j < paragraphNumChildren; ++j) {
        var paragraphChild = paragraph.getChild(j);
        var paragraphChildType = paragraphChild.getType();
        if (paragraphChildType == DocumentApp.ElementType.PAGE_BREAK) {
          ++pageBreakCounter;
          foundPageBreak = true;
          break;
        }
      }
      if (foundPageBreak) continue;
    }
  }
  //ui.alert(recurringContentParagraphs);
  //return;
  
  var content = []
  for (var i = 0; i < recurringContentParagraphs.length; ++i) {
    var paragraph = recurringContentParagraphs[i];
    var text = paragraph.editAsText();
    var textAsString = text.getText();
    var criteriaString = "";
    var foundStartChar = 0;
    var foundEndChar = 0;
    for (var j = 0; j < textAsString.length; ++j) {
      if (textAsString[j] == "<") {
        foundStartChar += 1;
      }
      if (textAsString[j] == ">") {
        foundEndChar += 1;
      }
      if ((foundStartChar == 2) && (foundEndChar <= 2)) {
        criteriaString += textAsString[j];
      }
      if (foundEndChar == 2) {
        break;
      }
    }
    // ui.alert(criteriaString);
    criteriaString = criteriaString.toLowerCase().replace(/ /g, ""); //flexibility with capitalization and spaces   
    Logger.log(criteriaString);
    var fullDate = new Date();
    var todaysDate = new Date(fullDate.getYear(), fullDate.getMonth(), fullDate.getDate());
    var currentMonth = new Date(fullDate.getYear(), fullDate.getMonth());
    //ui.alert(criteriaString);
    //return;
    if (criteriaString.indexOf("first sunday of the month".replace(/ /g, "")) != -1) {
      //ui.alert("In If 1");
      
      for (var d = 0; d < daysToSearch; ++d) {
        var date = new Date(todaysDate.getYear(), todaysDate.getMonth(), todaysDate.getDate() + d);
        if (date.getDay() == 0) {
          if (date.getDate() / 7 <= 1) {
            var dateFormated = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getYear() + " 6:00:00";
            if (dateFormated != undefined) {
              var arr5 = paragraph.getText().split(";");
              var extractedPara = arr5[1];
              extractedPara = extractedPara.trim();
              sheet.appendRow([dateFormated, extractedPara]);
            }
          }
        }
      }
    } else if (criteriaString.indexOf("second sunday of the month".replace(/ /g, "")) != -1) {
      // ui.alert("In If 2");
      
      for (var d = 0; d < daysToSearch; ++d) {
        var date = new Date(todaysDate.getYear(), todaysDate.getMonth(), todaysDate.getDate() + d);
        if (date.getDay() == 0) {
          if ((date.getDate() / 7 > 1) && (date.getDate() / 7 <= 2)) {
            var dateFormated = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getYear() + " 6:00:00";
            if (dateFormated != undefined) {
              var arr5 = paragraph.getText().split(";");
              var extractedPara = arr5[1];
              extractedPara = extractedPara.trim();
              sheet.appendRow([dateFormated, extractedPara]);
            }
          }
        }
      }
    } else if (criteriaString.indexOf("third sunday of the month".replace(/ /g, "")) != -1) {
      // ui.alert("In If 3");
      
      for (var d = 0; d < daysToSearch; ++d) {
        var date = new Date(todaysDate.getYear(), todaysDate.getMonth(), todaysDate.getDate() + d);
        if (date.getDay() == 0) {
          if ((date.getDate() / 7 > 2) && (date.getDate() / 7 <= 3)) {
            var dateFormated = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getYear() + " 6:00:00";
            if (dateFormated != undefined) {
              var arr5 = paragraph.getText().split(";");
              var extractedPara = arr5[1];
              extractedPara = extractedPara.trim();
              sheet.appendRow([dateFormated, extractedPara]);
            }
          }
        }
      }
    } else if ((criteriaString.indexOf("fourth sunday of the month".replace(/ /g, "")) != -1) && (criteriaString.indexOf("fifth sunday exists in the same month".replace(/ /g, "")) != -1)) {
      // ui.alert("In If 4");
      
      for (var d = 0; d < daysToSearch; ++d) {
        var date = new Date(todaysDate.getYear(), todaysDate.getMonth(), todaysDate.getDate() + d);
        if (date.getDay() == 0) {
          if ((date.getDate() / 7 > 3) && (date.getDate() / 7 <= 4)) {
            var hasFifthSunday = false;
            for (var dd = date.getDate(); dd <= hootsuite_daysInMonth_(date.getMonth(), date.getYear()); ++dd) {
              var testForFifthSundayDate = new Date(date.getYear(), date.getMonth(), dd);
              Logger.log(testForFifthSundayDate);
              if ((testForFifthSundayDate.getDay() == 0) && (testForFifthSundayDate.getDate() / 7 > 4)) {
                hasFifthSunday = true;
                break;
              }
            }
            if (hasFifthSunday == false) {
              continue;
            }
            var dateFormated = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getYear() + " 6:00:00";
            if (dateFormated != undefined) {
              //ui.alert(paragraph.getText());
              // return;
              var arr5 = paragraph.getText().split(";");
              if (arr5[2] != undefined) {
                //ui.alert(arr5[2]);
                var extractedPara = arr5[2];
                extractedPara = extractedPara.trim();
                sheet.appendRow([dateFormated, extractedPara]);
              }
            }
          }
        }
      }
    } else if (criteriaString.indexOf("fourth sunday of the month".replace(/ /g, "")) != -1) {
      //ui.alert("In If 5");
      
      for (var d = 0; d < daysToSearch; ++d) {
        var date = new Date(todaysDate.getYear(), todaysDate.getMonth(), todaysDate.getDate() + d);
        if (date.getDay() == 0) {
          if ((date.getDate() / 7 > 3) && (date.getDate() / 7 <= 4)) {
            var dateFormated = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getYear() + " 6:00:00";
            if (dateFormated != undefined) {
              var arr5 = paragraph.getText().split(";");
              var extractedPara = arr5[1];
              extractedPara = extractedPara.trim();
              sheet.appendRow([dateFormated, extractedPara]);
            }
          }
        }
      }
    } else if (criteriaString.indexOf("last sunday of the month".replace(/ /g, "")) != -1) {
      // ui.alert("In If 6");
      for (var d = 0; d < daysToSearch; ++d) {
        var date = new Date(todaysDate.getYear(), todaysDate.getMonth(), todaysDate.getDate() + d);
        if ((date.getDay() == 0) && (hootsuite_daysInMonth_(date.getMonth()) - date.getDate() < 7)) {
          var dateFormated = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getYear() + " 6:00:00";
          if (typeof(dateFormated) == "undefined") {
            
          } else {
            var arr5 = paragraph.getText().split(";");
            //ui.alert(arr5);
            var extractedPara = arr5[1];
            extractedPara = extractedPara.trim();
            sheet.appendRow([dateFormated, extractedPara]);
            //ui.alert(dateFormated);
            //  ui.alert(paragraph.getText());
          }
        }
      }
      
    } else if (criteriaString.indexOf("should be appended on ".replace(/ /g, "")) != -1) {
      //ui.alert("In If 7");
      
      var specificDates = criteriaString.split("should be appended on ".replace(/ /g, ""))[1].split(",");
      for (var d = 0; d < specificDates.length; ++d) {
        var month = parseInt(specificDates[d].split(".")[0].replace(/\D/g, '')) - 1;
        var day = parseInt(specificDates[d].split(".")[1].replace(/\D/g, ''));
        var date = new Date(todaysDate.getYear(), month, day);
        if (date < todaysDate) {
          date = new Date(todaysDate.getYear() + 1, month, day);
        }
        var isWithinSearchRange = false;
        for (var dd = 0; dd < daysToSearch; ++dd) {
          if ((new Date(todaysDate.getYear(), todaysDate.getMonth(), todaysDate.getDate() + dd)).toDateString() == date.toDateString()) {
            //ui.alert(isWithinSearchRange);
            isWithinSearchRange = true;
            break;
          }
        }
        if (isWithinSearchRange == false) continue;
        
        
        var sunday = "";
        var day = date.getDay();
        if (day == 0) {
          if (date.getDate() / 7 <= 1) {
            sunday = "First Sunday of the month";
          } else if (date.getDate() / 7 <= 2) {
            sunday = "Second Sunday of the month";
          } else if (date.getDate() / 7 <= 3) {
            sunday = "Third Sunday of the month";
          } else if (date.getDate() / 7 <= 4) {
            sunday = "Fourth Sunday of the month";
          } else {
            sunday = "Fifth Sunday of the month";
          }
        }
        var dateFormated = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getYear() + " 6:00:00";
        
        if (dateFormated != undefined) {
          //ui.alert(dateFormated);
          var arr5 = paragraph.getText().split(";");
          //ui.alert(arr5[1]);
          if (arr5[1] == undefined) {
            var arr6 = paragraph.getText().split(">>");
            var extractedPara = arr6[1];
            extractedPara = extractedPara.trim();
            sheet.appendRow([dateFormated, extractedPara]);
          } else
            if (arr5[1] != undefined) {
              var extractedPara = arr5[1];
              extractedPara = extractedPara.trim();
              sheet.appendRow([dateFormated, extractedPara]);
            }
        }
      }
    } else {}
    //ui.alert(dateFormated);
    //ui.alert(paragraph.getText());
  }
  
  hootsuite_SortSpreadSheet();
}


function hootsuite_getNumExecutions_() {
  //well I'm certain this did somethig useful at some time, fairly certain anyway, but it seems to always return 0 these days since the property is never set
  var NUM_EXECUTIONS = PropertiesService.getScriptProperties().getProperty("HOOTSUITE_NUM_EXECUTIONS");
  if (NUM_EXECUTIONS == undefined)
    return 0;
  else
    return parseInt(NUM_EXECUTIONS);
}

function hootsuite_daysInMonth_(month, year) {
  switch (month) {
    case 0:
      return 31;
    case 1:
      if (year % 4 == 0) return 29;
      else return 28;
    case 2:
      return 31;
    case 3:
      return 30;
    case 4:
      return 31;
    case 5:
      return 30;
    case 6:
      return 31;
    case 7:
      return 31;
    case 8:
      return 30;
    case 9:
      return 31;
    case 10:
      return 30;
    case 11:
      return 31;
    default:
      throw "Invalid month number: " + month;
  }
}

function hootsuite_sortByDate(a, b) {
  if (new Date(a.date) < new Date(b.date)) return -1;
  else if (new Date(a.date) > new Date(b.date)) return 1;
  else return 0;
}


function hootsuite_SortSpreadSheet() {
  
  var sheetArray = [];
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  for (var i = 1; i < values.length; i++) {
    var row = "";
    var sheetDate = values[i][0];
    var typeIs = typeof sheetDate;
    if (typeIs != "object") {
      var arr6 = sheetDate.split(" ");
      arr7 = arr6[0].split(".");
      if (arr7[0].length == 1) {
        var month = "0" + arr7[0];
      } else {
        var month = arr7[0];
      }
      
      if (arr7[1].length == 1) {
        var day = "0" + arr7[1];
      } else {
        var day = arr7[1];
      }
      var newFormatedDate = arr7[2] + "-" + month + "-" + day;
      var newdate = new Date(newFormatedDate);
    } else {
      sheetDate = new Date(sheetDate).toISOString();
      //ui.alert("In Else");
      //ui.alert(sheetDate);
      //2017-11-05T
      var arr6 = sheetDate.split("T");
      //ui.alert(arr6[0]);
      newFormatedDate = arr6[0];
      var newdate = new Date(newFormatedDate);
      
      //ui.alert(newFormatedDate);
      //return;
      var newdate = new Date(newFormatedDate);
      
    }
    // ui.alert(newdate);
    sheetArray.push({
      date: newFormatedDate,
      dateForSheet: values[i][0],
      paragraph: values[i][1],
      registrationUrl: values[i][2]
    });
  }
  sheetArray.sort(hootsuite_sortByDate);
  
  var tempI = 1;
  for (data in sheetArray) {
    tempI++;
    
    sheet.getRange(tempI, 1).setValue(sheetArray[data].dateForSheet);
    sheet.getRange(tempI, 2).setValue(sheetArray[data].paragraph);
    sheet.getRange(tempI, 3).setValue(sheetArray[data].registrationUrl);
  }
}

