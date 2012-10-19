javascript:(function(){
  var sidewalkchalkInit = {

    init: function(){
      this.stepNum = 1;
      this.getJquery('http://code.jquery.com/jquery-latest.min.js', true);
      this.getJquery('http://code.jquery.com/ui/1.8.23/jquery-ui.min.js', false);
    },

    getJquery: function(url, hasDependencies) {
      var jq = document.createElement('script'),
          _this = this;
      jq.src = url;
      jq.type = "text/javascript";

      if (hasDependencies) {
        jq.onload = jq.onreadystatechange = function() {
          if (!this.readyState || this.readyState == 'complete') {
            _this.getDependencies();
          }
        };
      }
      document.getElementsByTagName('body')[0].appendChild(jq);
      jQuery.noConflict();
    },

    getDependencies: function(){
      $('head').append('<link rel="stylesheet" type="text/css" href="sidewalkchalk/sidewalkchalk.css" />');
      $.getScript("sidewalkchalk/sidewalkchalk.js", function(){
        sidewalkchalk.init();
      });
    }


  };


  sidewalkchalkInit.init();

}());