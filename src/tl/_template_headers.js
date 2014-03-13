/*
 * Following from here are the compiled default templates for Hopscotch.
 * The source files for these templates are in the /src/tl folder.
 * Content placed in the _template_headers.js file are added during build
 * before the templates.
 */

/* 
 * JST assumes _.escape exists. So, if Underscore is not available,
 * we'll create that function for later use.
 */
if(typeof _ === 'undefined'){
  _ = {};
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