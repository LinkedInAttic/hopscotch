javascript:(function(){
  var sidewalkchalkInit = {

    init: function(){
      this.stepNum = 1;
      this.getJquery();
    },

    getJquery: function() {
      var jq = document.createElement('script'),
          ready,
          _this = this;
      jq.src = "http://code.jquery.com/jquery-latest.min.js";
      jq.type = "text/javascript";

      jq.onload = jq.onreadystatechange = function() {
        if ( !ready && (!this.readyState || this.readyState == 'complete') ) {
          ready = true;
          _this.getDependencies();
        }
      };
      document.getElementsByTagName('head')[0].appendChild(jq);
    },

    getDependencies: function(){
      jQuery.noConflict();    
      $('head').append('<link rel="stylesheet" type="text/css" href="sidewalkchalk/sidewalkchalk.css" />');
      $.getScript("sidewalkchalk/sidewalkchalk.js", function(){
        sidewalkchalk.init();
      });
    }


  };


  sidewalkchalkInit.init();


}());
