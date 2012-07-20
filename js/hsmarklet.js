window.Hopscotch = function() {
  var name = "My First Hopscotch";
};

window.Hopscotch.prototype = {
  name: "My First Hopscotch",
  getName: function() {
    return this.name;
  }
};

// ======================================
// ======================================
// ======================================
// ======================================

(function() {
  var myHopscotch = new Hopscotch();
  alert("my hopscotch name is: " + myHopscotch.getName());
}());
