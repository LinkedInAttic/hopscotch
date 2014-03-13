/* 
 * JST assumes _.escape exists. So, if Underscore is not available,
 * we'll create that function for later use.
 */
if(typeof _ === 'undefined'){
  _ = {};
  /*
   * Adapted from the Underscore.js framework. Check it out at
   * https://github.com/jashkenas/underscore
   */
  _.escape = function(str){
    if(str == null) return '';
    return ('' + str).replace(new RegExp('[&<>"\']', 'g'), function(match){
      if(match == '&'){ return '&amp;' }
      if(match == '<'){ return '&lt;' }
      if(match == '>'){ return '&gt;' }
      if(match == '"'){ return '&quot;' }
      if(match == "'"){ return '&#x27;' }
    });
  }
}