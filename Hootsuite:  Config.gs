try{
  config.hootsuite = {
    //
  };
  if(config.debug) config.errorNotificationEmail.push('bob+ccn-library-hootsuite@rupholdt.com');///debug - uncomment to let developer receive errors
  if(config.debug) config.errorNotificationEmail = ['bob+ccn-library-hootsuite@rupholdt.com'];///during development, don't pester chad = turn off at golive
}
catch(e){ err('Unable to set config.hootsuite') }
