this["templates"] = this["templates"] || {};

this["templates"]["bubble_default"] = function(data) {
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }


  function optEscape(str, unsafe){
    if(unsafe){
      return _.escape(str);
    }
    return str;
  }
;
__p += '\n';

var i18n = data.i18n;
var buttons = data.buttons;
var step = data.step;
var tour = data.tour;
;
__p += '\n<div class="hopscotch-bubble-container" style="width: ' +
((__t = ( step.width )) == null ? '' : __t) +
'px; padding: ' +
((__t = ( step.padding )) == null ? '' : __t) +
'px;">\n  ';
 if(tour.isTour){ ;
__p += '<span class="hopscotch-bubble-number">' +
((__t = ( i18n.stepNum )) == null ? '' : __t) +
'</span>';
 } ;
__p += '\n  <div class="hopscotch-bubble-content">\n    ';
 if(step.title !== ''){ ;
__p += '<h3 class="hopscotch-title">' +
((__t = ( optEscape(step.title, tour.unsafe) )) == null ? '' : __t) +
'</h3>';
 } ;
__p += '\n    ';
 if(step.content  !== ''){ ;
__p += '<div class="hopscotch-content">' +
((__t = ( optEscape(step.content, tour.unsafe) )) == null ? '' : __t) +
'</div>';
 } ;
__p += '\n  </div>\n  <div class="hopscotch-actions">\n    ';
 if(buttons.showPrev){ ;
__p += '<button class="hopscotch-nav-button prev hopscotch-prev">' +
((__t = ( i18n.prevBtn )) == null ? '' : __t) +
'</button>';
 } ;
__p += '\n    ';
 if(buttons.showCTA){ ;
__p += '<button class="hopscotch-nav-button next hopscotch-cta">' +
((__t = ( buttons.ctaLabel )) == null ? '' : __t) +
'</button>';
 } ;
__p += '\n    ';
 if(buttons.showNext){ ;
__p += '<button class="hopscotch-nav-button next hopscotch-next">' +
((__t = ( i18n.nextBtn )) == null ? '' : __t) +
'</button>';
 } ;
__p += '\n  </div>\n  ';
 if(buttons.showClose){ ;
__p += '<button class="hopscotch-bubble-close hopscotch-close">' +
((__t = ( i18n.closeTooltip )) == null ? '' : __t) +
'</button>';
 } ;
__p += '\n</div>\n<div class="hopscotch-bubble-arrow-container hopscotch-arrow">\n  <div class="hopscotch-bubble-arrow-border"></div>\n  <div class="hopscotch-bubble-arrow"></div>\n</div>\n';
return __p
};