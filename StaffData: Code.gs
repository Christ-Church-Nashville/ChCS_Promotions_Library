function makeMenu_staffData() {
  SpreadsheetApp.getUi().createMenu("[ Custom Menu ]")
  .addItem("Update Staff Folders in Google Drive", "PL.staffData_staffFolders")
  .addItem("Update Event Sponsorship Pages for Teams", "PL.staffData_maintainPromotionCalendar")
  .addSeparator()
  .addSubMenu(
    SpreadsheetApp.getUi().createMenu('Tools...')
    .addItem("Enable Automation", "PL.staffData_enableAutomation")
    .addItem("Disable Automation", "PL.staffData_disableAutomation")
  )
  .addToUi();
}

function onEdit_staffData(e) {
  var range = e.range;//e.range = SpreadsheetApp.getActiveRange()//typehint
  var sh = range.getSheet();

  //check exit conditions
  if (sh.getName() != config.staffData.staffSheetName) return;//only fire for Staff sheet
  if (range.getColumn() != config.staffData.colStaffStatus) return;//only fire for Status column

  if (e.value != e.oldValue)//then it actually changed
    if (config.staffData.staffStatusesToHide.indexOf(newValue) > -1)//if it's in the array of values to hide
      sh.hideRows(range.getRow(), 1);//then hide the row
}

//Update Staff Folders
//Update Staff Folders
//Update Staff Folders

function staffData_staffFolders_find_(parentFolder, folderName) {
  var childFolder = '';
  var foundFolder = '';
  
  var childFolders = parentFolder.getFoldersByName(folderName);
  while (childFolders.hasNext()) {
    childFolder = childFolders.next();
    return childFolder;
  }
  
  childFolders = parentFolder.getFolders();
  while (childFolders.hasNext()) {
    childFolder = childFolders.next();
    if (childFolder.getName() == ' Archive') {
      foundFolder = staffData_staffFolders_find_(childFolder, folderName);
      if (foundFolder != false) {
        return foundFolder;
      }
    }
  }
  return false;
}

function staffData_staffFolders() {
  var parentFolder = DriveApp.getFolderById(config.staffData.staffFolder);
  var archiveFolder = staffData_staffFolders_find_(parentFolder, ' Archive');
  
  var sheet = SpreadsheetApp.openById(config.files.staffData).getSheetByName(config.staffData.staffDataSheet);
  var lastRow = sheet.getLastRow();
  var va = sheet.getSheetValues(3, 1, lastRow - 2, 2);
  var va2 = sheet.getSheetValues(3, 6, lastRow - 2, 1);
  
  for (var row = 0; row < va.length; row++) {
    var folderName = va[row][1] + ', ' + va[row][0];
    var found = staffData_staffFolders_find_(parentFolder, folderName);
    if (found == false) {
      found = parentFolder.createFolder(folderName);
    }
    
    var fvalue = va2[row][0];
    if (va2[row][0] == 'No longer employed') {
      parentFolder.removeFolder(found);
      archiveFolder.addFolder(found);
    } else {
      parentFolder.addFolder(found);
      archiveFolder.removeFolder(found);
    }
  }
}

//Update Team Calendars on CCN Events Promotion Calendar
//Update Team Calendars on CCN Events Promotion Calendar
//Update Team Calendars on CCN Events Promotion Calendar
/* Redevelopment notes: 
*   
*   - trigger for 'on edit' does not work reliably (09.015.2017)
*   - should aphabetize only the sheets named after a team
*   - should delete all the sheets in the target spreadsheet that are named after a team first BEFORE adding the sheets again
*/
//the behavior of this script was not changed, only moved to the library --Bob 

function staffData_maintainPromotionCalendar(e) {//fires from onEdit trigger or menu
  var templateSheet = SpreadsheetApp.openById(config.staffData.eventsPromotionCalendar_TEMPLATE).getSheetByName(config.staffData.eventsPromotionCalendar_TEMPLATE_Sheet);
  var sheet = SpreadsheetApp.openById(config.files.staffData).getSheetByName(config.staffData.staffDataSheet);
  var lastRow = sheet.getLastRow();
  
  var dest = SpreadsheetApp.openById(config.files.eventsCalendar);
  
  var va = sheet.getSheetValues(3, 12, lastRow - 2, 1);
  var va2 = sheet.getSheetValues(3, 13, lastRow - 2, 1);
  var vta = [];
  var vti = 0;
  
  for (var row = 0; row < va.length; row++) {
    var name = va[row][0];
    if (va2[row][0] == 'Yes') {
      var ds = dest.getSheetByName(name);
      if (ds == null) {
        ds = templateSheet.copyTo(dest);
        ds.setName(name);
        var a1 = ds.getRange(1, 1);
        a1.setValue(a1.getValue().toString().replace(/TEMPLATE/g, name));
        var a3 = ds.getRange(3, 1);
        a3.setFormula(a3.getFormula().toString().replace(/TEMPLATE/g, name));
      }
      vta[vti] = name;
      vti++;
    }
  }
  for (var row = 0; row < va.length; row++) {
    var name = va[row][0];
    var f = 0;
    for (var vti = 0; vti < vta.length; vti++) {
      if (vta[vti] == name) f++;
    }
    if (f == 0) {
      var ds = dest.getSheetByName(name);
      if (ds != null) {
        dest.deleteSheet(ds);
      }
    }
  }
  staffData_maintainPromotionCalendar_sortSheets();
}

function staffData_maintainPromotionCalendar_sortSheets() {
  var spreadsheet = SpreadsheetApp.openById(config.files.eventsCalendar);
  var sheeta = spreadsheet.getSheets();
  var sic = 0;
  for (var si = 2; si < sheeta.length; si++) {
    sic = si;
    var ss1 = sheeta[si].getName();
    for (var si2 = si + 1; si2 < sheeta.length; si2++) {
      if (sheeta[sic].getName().localeCompare(sheeta[si2].getName()) > 0) {
        var s1s = sheeta[sic].getName();
        var s2s = sheeta[si2].getName();
        sic = si2;
      }
    }
    if (sic != si) {
      var sin1 = sheeta[si].getIndex();
      var sin2 = sheeta[sic].getIndex();
      var sis1 = sheeta[si].getName();
      var sis2 = sheeta[sic].getName();
      sheeta[sic].activate();
      //spreadsheet.setActiveSheet(sheeta[sic]);
      spreadsheet.moveActiveSheet(si + 1);
      sheeta = spreadsheet.getSheets();
      var stest1 = sheeta[0].getName();
      var stest2 = sheeta[1].getName();
      var stest3 = sheeta[2].getName();
      var stest4 = sheeta[3].getName();
    }
  }
}

function staffData_sortByLastName() {//ahh, this is part of a trigger so it really is used
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(config.staffData.staffDataSheet);
  var numStartRow = sh.getFrozenRows() +1;
  var lastRow = sh.getLastRow();
  var lastCol = sh.getLastColumn();
  
  var dupSH = sh.copyTo(ss);
  dupSH.getDataRange().clearFormat();
  
  dupSH.insertColumnBefore(1);
  var range = dupSH.getRange(1, 1, lastRow, 1);
  var vals = range.getValues();
  for (var i = 0; i < vals.length; i++) {
    for (var j = 0; j < vals[i].length; j++) {
      vals[i][j] = 1;
    }
  }
  range.setValues(vals);
  range.setNumberFormat("0.000");
  
  dupSH.insertColumnBefore(1);
  var range1 = dupSH.getRange(1, 1, lastRow, 1);
  var vals1 = range1.getFormulas();
  for (var i = 0; i < vals1.length; i++) {
    for (var j = 0; j < vals1[i].length; j++) {
      vals1[i][j] = "=(SUBTOTAL(102,offset(indirect(ADDRESS(ROW(),COLUMN())),-1,1,2)))";
    }
  }
  range1.setFormulas(vals1);
  range1.setNumberFormat("0.000");
  
  var valt = range1.getDisplayValues();
  
  var hr = [];
  var flag = false;
  for (var i = 0; i < valt.length; i++) {
    if (valt[i][0] == 1 && flag == false) {
      hr.push(i);
      flag = true;
    } else if (valt[i][0] == 0) {
      hr.push(i);
    } else if (valt[i][0] == 1) {
      flag = false;
    }
  }
  
  if (hr.length > 0) {
    for (var i = 0; i < hr.length; i++) {
      vals[hr[i]][0] = 0;
      var rg = dupSH.getRange(1 + hr[i], 1, 1, 1);
      dupSH.unhideRow(rg);
      
      var rg1 = sh.getRange(1 + hr[i], 1, 1, 1);
      sh.unhideRow(rg1);
    }
  }
  range.setValues(vals);
  
  var rangeS = dupSH.getRange(numStartRow, 1, lastRow + 1 - numStartRow, lastCol);
  rangeS.sort(4);
  
  var rangeS1 = sh.getRange(numStartRow, 1, lastRow + 1 - numStartRow, lastCol);
  rangeS1.sort(2);
  
  //Logger.log(valt);
  //Logger.log(hr);
  
  var vals = range.getValues();
  //Logger.log(vals)
  
  for (var i = 0; i < vals.length; i++) {
    if (vals[i][0] == 0) {
      var rg = sh.getRange(1 + i, 1, 1, 1);
      sh.hideRow(rg);
      
    }
  }
  sp.deleteSheet(dupSH);
  
}
