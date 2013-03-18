var printLog = function(str) {
  var el = document.getElementById('debug-output'),
      newEl = document.createElement('p');
  if (el) {
    newEl.innerHTML = str;
    el.appendChild(newEl);
  }
  else {
    console.log(str);
  }
},

doAlert = function(str) {
  // worst function idea ever
  alert(str);
};

//hopscotch.clearCookie();
hopscotch.registerHelper("printlog", printLog);
hopscotch.registerHelper("alert", doAlert);
/*
var onStart = function(tourId) {
  printLog('global start ' + tourId);
},
onEnd = function(tourId) {
  printLog('global end ' + tourId);
},
onNext = function(tourId, stepNum) {
  printLog('global next ' + tourId + ' ' + stepNum);
},
onPrev = function(tourId, stepNum) {
  printLog('global prev ' + tourId + ' ' + stepNum);
};
hopscotch.listen('start', onStart)
         .listen('end', onEnd)
         .listen('next', onNext)
         .listen('prev', onPrev);
         */

hopscotch.listen('start', ['printlog', 'global start']);
//hopscotch.listen('start', function() { alert('starting'); });
hopscotch.startTour(tour);

