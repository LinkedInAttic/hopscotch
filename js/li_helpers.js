/* Hi JSHint! Just letting ya know that we're cool with hopscotch and all. */
/* global hopscotch:false */


/* LINKEDIN BASE HELPERS BUNDLE FOR HOPSCOTCH
 * Helpers are callback methods that you can invoke from Hopscotch to
 * take certain actions. Each helper must be registered with Hopscotch
 * using the registerHelper method before it can be used.
 * 
 * Helpers in this bundle are registered on each page Hopscotch is loaded.
 * As such, these helpers should be generic in nature and applicable
 * to a variety of tours. Helpers that are unique to a specific tour
 * should be registered in a helper bundle for that tour. QuickHelp
 * will load your helper bundle for you when it launches your tour.
 * See docs for details on tour-specific bundles.
 *
 * Want to use these in a Hopscotch tour? Invoke from a tour callback
 * as follows:
 *
 * "onNext": ["trackEvent off_to_next_step", "goTo http://linkedin.com"]
 *
 * Note that you can call multiple helpers in each callback. Helpers are
 * invoked in order, starting with all-tour callbacks, then step-specific
 * callbacks.
 *
 * Need help? Check out go/howtohopscotch for developer information.
*/


/* General boilerplate for a helper bundle. We first double-check that
 * Hopscotch exists, then for each helper we call the following:
 *
 * hopscotch.registerHelper("nameOfHelperMethod", function(){...});
 * 
 * Documentation for each helper is included below.
*/
if(hopscotch){

  /* Helper Method: goTo
   * Sends the user off to another page.
   *
   * Arguments:
   * loc - Where you want to go to.
   *
   * Example: "onNext": ["goTo", "http://linkedin.com"]
  */
  hopscotch.registerHelper("goTo", function(loc){
    window.location = loc;
  });

  /* Helper Method: trackEvent
   * Uses LinkedIn's WebTracking framework to log a Kafka tracking event.
   * Commonly used for metrics collection. See go/tracking for details.
   *
   * Arguments:
   * eventId - The Kafka event ID you want to log.
   *
   * Example: "onEnd": ["trackEvent", "hurray_we_finished_the_tour"]
  */
  hopscotch.registerHelper("trackEvent", function(eventId){
    if(WebTracking){
      WebTracking.trackUserAction(eventId);
    }
  });

  /* Helper Method: setFormValue
   * Uses native JavaScript to set the value of a text form field.
   * TODO: Once jQuery is more prevalent, we should use that instead.
   *
   * Arguments:
   * elId - The ID of the element you want to set.
   * val  - The value to set the form field to. Use + for spaces.
   *
   * Example: "onStart": ["setFormValue, "global-search Wizard+Of+In"]
  */
  hopscotch.registerHelper("setFormValue", function(elId, val){
    var el = document.getElementById(elId);

    if(val && el && (typeof el.value !== "undefined")){
      val.replace("+", " ");
      el.value = val;
    }
  });

  /* Helper Method: submitForm
   * Uses native JavaScript to submit a form.
   *
   * Arguments:
   * elId - The ID of the form you want to submit.
   *
   * Example: "onNext": ["submitForm global-search"]
  */
  hopscotch.registerHelper("submitForm", function(elId){
    var el = document.getElementById(elId);
    if(el && (typeof el.submit === "function")){
      el.submit();
    }
  });
}

