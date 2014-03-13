Working with Hopscotch templates
================================

By default, Hopscotch will use a built-in JavaScript template (built using grunt-contrib-jst) for rendering the structure and internals of each bubble, called bubble-default.jst. This template is included automatically during the build process in hopscotch.js and hopscotch.min.js.

When it's time to render a Hopscotch bubble (either thru a tour or the HopscotchCalloutManager), the render() method will call the template with information about the current step or callout, in turn receiving rendered HTML to be injected into the page.

Setting your own template
-------------------------
If preferred, you can set your own template to render Hopscotch bubbles globally. To do so, call `hopscotch.setRenderer()`. This method accepts one argument, which can be either...

- A string, which is assumed to be the name of a method that exists within the hopscotch.templates namespace (templates compiled during the build process are added to this namespace).
- A method, which Hopscotch will call directly.

In either case, the method should accept a JSON object containing information about the bubble being rendered and return a string containing the bubble's HTML. Hopscotch is purposly agnostic to the means by which you generate HTML (this is why we're using Underscore JSTs for the default, since they compile down to basic JavaScript with minimal dependencies), so you can mix in your templating engine of choice if preferred.

If preferred, you can edit bubble-default or include your own templates in this folder. Any files included here will be compiled and included during the build process. Template names match the file name, with dashes converted to underscores and extensions (.jst) removed.

Custom renderers can also be set on a tour-by-tour basis (or for an individual callout) by setting the `customRenderer` option in your tour or callout object. As above, this option can be a string or method.

Template Data and Adding Additional Details
-------------------------------------------
Normally, your template method will receive a JSON object containing the following details about the bubble...

`````
i18n - Translated text to show on bubble elements.
  .prevBtn - Text to show on the prevous step button.
  .nextBtn - Text to show on the next step button. Depending on your step's configuration, this could provide the i18n string for "Next", "Skip", or "Done".
  .closeTooltip - Tooltip text for the bubble's close button.
  .stepNum - The number for the current tour step.
buttons - Information about what buttons to show.
  .showPrev - Whether to show the previous step button.
  .showNext - Whether to show the next step button.
  .showCTA - Whether to show the call-to-action button.
  .ctaLabel - The label to show on the CTA button.
  .showClose - Whether to show a close button on the bubble.
step - Information about the current step or callout.
  .num - The current step number (zero-based).
  .isLast - Whether this is the last step in the tour.
  .title - The step's title.
  .content - The step's content.
  .placement - The placement of the bubble relative to the element.
  .padding - Padding to be added to the content container. Deprecated.
  .width - The requested internal width of the bubble.
  .customData - Additional template-specific info to include (see below).
tour - Tour-level information about this bubble.
  .isTour - Whether this is a tour bubble or a callout bubble.
  .numSteps - The total number of steps in the tour.
  .unsafe - Whether the title and content should be HTML-escaped by the template.
  .customData - Additional template-specific info to include (see below).
`````

In addition to the above, both `step` and `tour` include a `customData` object. To include data for these objects, pass in `customData` as a step and/or tour option, or as part of the data passed to `HopscotchCalloutManager.createCallout()`.

`````javascript
var tourData = {
  id: 'my_new_tour',
  customData: {
    //This data is included in tour.customData
  },
  steps:[
    {
      target: '#my-selector',
      placement: 'bottom'
      title: 'This is a step!',
      customData: {
        //This data is included in step.customData
      }
    }
  ]
};

hopscotch.startTour(tourData);

...

hopscotch.getCalloutManager().createCallout({
  id: 'my_new_callout',
  title: 'This is a callout!',
  target: '#my-selector',
  placement: 'bottom',
  customData: {
    //This data is included in tour.customData AND step.customData
  }
});
`````

Authoring Templates
-------------------
Note that much of the above information about how template data is handled is dependent on the template's implementation... after all, the title provided by your tour doesn't matter much if the template never reads it. To avoid surprises and potential upgrade issues in the future, consider following the JSON specs listed above when authoring your tours.

Additionally, if you're authoring your own template, there are a few special class names you should be aware of. Hopscotch will handle listening for click events and arrow positioning for you - however, for Hopscotch to pick up the elements it should listen to, you'll want to use the following class names...

- hopscotch-arrow: Apply this class to your bubble's arrow element. Top/left positioning calculations and display class names (up, down, left, right) will be assigned to this element.
- hopscotch-prev: Apply this class to the previous step button.
- hopscotch-next: Apply this class to the next step button.
- hopscotch-cta: Apply this class to the call-to-action button.
- hopscotch-close: Apply this class to the close/end tour button.