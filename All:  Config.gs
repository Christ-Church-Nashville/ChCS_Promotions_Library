var SCRIPT_VERSION = 'v1.5.1';
var SCRIPT_NAME = 'Promotions Library';

var config = {//dev note: this must be set in a file that loads early so it is available for other files. File are loaded by GAS in the order they are created.
  
  notificationEmail : 'chbarlow@gmail.com',
  
  files : {//these are the ids for the files used throughtout the ChCS system ///move this to setup function
    staffData             : '1iiFmdqUd-CoWtUjZxVgGcNb74dPVh-l5kuU_G5mmiHI',
    staffDataTemplate     : '',//set in staffData file config
    responseForm          : '1JEqPQJSiBliliqw1y-wrrdP6ikU11DPuIF72l-rN84g',//this is the new one 2018-02
    eventsCalendar        : '1d0-hBf96ilIpAO67LR86leEq09jYP2866uWC48bJloc',
    announcements         : {
      master              : '1vt_yq2YiswCeZ_yt7oJVAgfBs8x86sYktBiC2COErcE',//master
      twoWeeks            : '1nwqLAYy9MI6xhzgciSmF5S2m0Aj-ec3PMN8WRM0zY-Y',//draft
      oneWeek             : '1NvwR5-7VrxZdTVZ3-iW7ib80dfoCUKFzem_XUpFrRwo',//next sunday
      upcoming            : '1U61THQS-Ktno-Ku1Jk6GX0UaSmsRgq4YGiJzePJleyo',//this sunday
      archive             : '13nqFE0ACEBGPoPhFquub-9nT-tLwcVovQvb0LYQDQT0',//archive
    },
    slides                : {
      folderSource        : '0BzM8_MjdRURAU29mMzBxTEVnZjA',
      folderDestination   : '0BzM8_MjdRURAMGxiSVIzYUZkX0U',
      slidesParent        : '0BzM8_MjdRURAXzlyVVNMdmpYLVU',//this is the parent folder for source and dest
    },
    hootsuite             : '1x2fjbyICQ5nHI2cF5l4Un3inHui-M0rsUF_PyszYlcE',
  },
  projectName : 'CCN Promotions Library',//for logging and error reporting
  //  live : false,///set to true to allow document content deletions to occur
  debug : false,//set to on to allow debug emails to be sent - and debug logging
  timeZone : -6,
  errorNotificationEmail : ['chbarlow@gmail.com'],//for errors
};

/*
 add these to any new config files - replace modulename
 if(config.debug) config.errorNotificationEmail.push('bob+ccn-library-%modulename%@rupholdt.com');///debug - uncomment to let developer receive errors
 if(config.debug) config.errorNotificationEmail = ['bob+ccn-library-%modulename%@rupholdt.com'];///during development, don't pester chad = turn off at golive
*/

function updateConfig(configObj){
  //since PropertiesService.getDocumentProperties() is not available to this library script
  //the calling script pushes it's config back here to be merged with the local config
  if( ! configObj) throw 'Missing config object';
  //merge supplied config with local config, supplied values (should) replace defaults
  assignDeep(config, configObj);
}

/*
To add a new config section
create a new script file named SectionName: Config
paste the below into it and replace both newSectionName items

try{
  config.newSectionName = {
    
  }
}
catch(e){ err('Unable to set config.newSectionName') }


*/

