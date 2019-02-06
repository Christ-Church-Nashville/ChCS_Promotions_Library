try{
  //. I do believe this is handled in Announcements now
  config.fileTransfer = {
    files : {///consolidate these to All:config.files
      master    : '1jTH_c_vVbYdcpUU2FADUddJaLvK848LS5NzSsZNhG6M',
      thisWeek  : '1vSdkeMfAoxzH4-KUoDyfSVzl8n1K5C-H5IiIDlYMreI', //upcoming Sunday
      nextWeek  : '1WhiVy28j9q-uNFTbq5xS3C2mzTrq8ZAAUtcxMVaAZvw', //upcoming Sunday +7
      twoWeeks  : '1wrxW680KoPBp8o8m6rVuRKtnUGdvXKjazVNfVBemSmA', //upcoming Sunday +14, aka Draft
      archive   : '1NeFjpKxFbL-UQJgoxI5JgxQjydrwI-V0CsrTuhVK2_c',
      hootSuite : '12NOVy3-jyFrGQOYMWiPsReLIAqzq7SCoo1JjsZSnpew',
    },
  };
  if(config.debug) config.errorNotificationEmail.push('bob+ccn-library-fileTransfer@rupholdt.com');///only set if cnofig.debug is enabled
  if(config.debug) config.errorNotificationEmail = ['bob+ccn-library-fileTransfer@rupholdt.com'];///during development, don't pester chad = turn off at golive
}
catch(e){ err('Unable to set config.fileTransfer') }
