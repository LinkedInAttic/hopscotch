//javascript:(function(){

  var sidewalkchalk = {
    init: function(){
      this.getHtml();

      this.stepInfo = {
        stepIdBase: 'hs-builder-step-',
        tagName: 'li' 
      };
      this.stepNum = 1;

      this.hopscotchJSON = {
        id: '',
        steps: []
      };

      /*this.hopscotchJSON = {
        id: '',
        steps: []
      };
      this.stepInfo = {
        stepIdBase: 'hs-builder-step-',
        tagName: 'li' 
      };
      this.stepNum = 1;

      this.injectjQuery();
      this.drawBuilderContainer();*/
    },

    getHtml: function(){
      var _this = this;

      $.ajax('sidewalkchalk/sidewalkchalk.html', {
        crossDomain: true,
        success: function(resp){
          _this.drawBuilderContainer(resp);
        }
      });
    },

    drawBuilderContainer: function(content){
      this.container = $('#hopscotch-builder')[0] || $('<div id="hopscotch-builder"></div>').html(content);
      this.steps = this.container.find('li.step');
      $('body').append(this.container);

      $(this.steps[0]).css('display', 'block');

      this.stepInfo.template = this.getStepFormTemplate();
      this.stepInfo.stepsContainer = $('#forms-list');
      this.stepsTOC = $('.steps-list');
      this.tocTemplate = this.stepsTOC.find('li')[0].innerHTML;
      this.initContainerEvents();
    },

    initContainerEvents: function(){
      var addStepEl = this.container.find('.add-step'),
          exportFullEl = this.container.find('.export-full'),
          exportStepEl = this.container.find('.export-step'),
          targetElementBtn = this.container.find('.target-element .button-up'),
          _this = this;

      addStepEl.on('click', function(){
        _this.insertStep();
      });

      /* TOC functionality */
      this.container.find('.steps-list').on('click', function(e){
        var target = $(e.target),
            steps = _this.container.find('.step'),
            stepNum;

        while(!target.is('li')){
          target = $(target.parent());
        }

        stepNum = target.parents('.steps-list').find('li').index(target);

        steps.css('display','none');

        $(steps[stepNum]).css('display','block');
        _this.stepNum = stepNum+1;
      });

      this.container.find('.steps-toc .nav').on('click', function(e){
        var target = $(e.target),
            steps = _this.container.find('.step');

        if(target.hasClass('next') && _this.stepNum < steps.length){
          _this.stepNum++;
        }else if(target.hasClass('prev') && _this.stepNum > 1){
          _this.stepNum--;
        }

        steps.css('display','none');

        _this.container.find('.current-step')[0].innerHTML = _this.stepNum;

        $(steps[_this.stepNum-1]).css('display','block');
      });

      /* Event listeners for Target functionality */
      targetElementBtn.on('click', function() {
        var outerTargetSelectorEl = document.getElementById('outer-target-selector');
        if (outerTargetSelectorEl) {
          document.getElementsByTagName('body')[0].removeChild(outerTargetSelectorEl);
          return;
        }
        _this.selectPageElement();
      });
      $(document).on('keyup', function(e) {
        var target = $(e.target);
        // Esc key
        if (e.keyCode == 27) {
          targetElementBtn.click(); 
        }

        if(target.attr('name') == 'title') {
          var form = target.parents('#hs-steps-form'),
              stepTOCel = $(form.find('.steps-list li')[_this.stepNum-1]);

          stepTOCel.find('label').text(target.val());
        }
      });
      $(document).on('click', function(e) {
        var builder = $('#hopscotch-builder'),
            thisNode = $(e.target);

        if (thisNode.parents('#hopscotch-builder').length > 0){
          return false;
        }

        if (thisNode.attr('id') && thisNode.attr('id') != '') {
          $('.target-element input')[0].value = thisNode.attr('id');
        } else if (thisNode.attr('class') && thisNode.attr('class') != '') {
          $('.target-element input')[0].value = "document.getElementsByClassName('" + thisNode.attr('class') + "')[0]";
        }

      });

      /* Event listeners for Export functionality */
      exportFullEl.on('click', function() {
        _this.exportFull();
      });
      exportStepEl.on('click', function() {
        _this.exportStep(_this.stepNum);
      });




    },

    getStepFormTemplate: function(){
      this.stepForm = this.container.find('.step')[0];

      return this.stepForm.innerHTML;
    },

    insertStep: function(){
      var steps = this.container.find('.step'),
          newStep = $('<'+this.stepInfo.tagName+' id="'+(this.stepInfo.stepIdBase + (this.stepNum+1))+'">'),
          previousStep = $('#'+(this.stepInfo.stepIdBase + (this.stepNum)));

      this.stepNum++;

      newStep.html(this.stepInfo.template);
      newStep.addClass('step');

      steps.css('display','none');
      newStep.css('display','block');
      this.stepInfo.stepsContainer.append(newStep);

      var newTOCstep = $('<li id="'+('toc-step-' + this.stepNum)+'"></li>');
      newTOCstep.html(this.tocTemplate);
      $(newTOCstep.find('input')[0]).val(this.stepNum);

      this.stepsTOC.append(newTOCstep);

      this.container.find('.current-step')[0].innerHTML = this.stepNum;
      this.container.find('.total-steps')[0].innerHTML = $('#forms-list').find('.step').length;
      
    },

    selectPageElement: function() {
      var box = $("<div id='outer-target-selector' />").appendTo("body"),
          last = +new Date;

      $("body").mousemove(function(e){
        var offset, el = e.target,
            now = +new Date;

        if (now-last < 25) { return }

        last = now;

        if (el === document.body) {
          box.hide();
          return;
        } else if (el.id === "outer-target-selector") {
          box.hide();
          el = document.elementFromPoint(e.clientX, e.clientY);
        }

        el = $(el);
        offset = el.offset();
        box.css({
            width:  el.outerWidth()  - 1,
            height: el.outerHeight() - 1,
            left:   offset.left,
            top:    offset.top
        });
        box.show();
      });
    },

    exportFull: function() {
      var obj = {
        target: 'subheading',
        orientation: 'bottom',
        title: 'Welcome to the Hopscotch Demo Page!',
        content: 'Hey there! Welcome to the Hopscotch Demo Page! Please excuse our dust; this is still a work in progress. To proceed, click the next button below. (And as you do, watch the title of the page turn red!!!)'
      };

      return {chill: 'I didn\'t implement this yet'};
    },

    exportStep: function(stepNum) {
      var stepObj = {},
          currentStep = $(this.container.find('.step')[this.stepNum-1]),
          data = currentStep.find('input,textarea').serializeArray();

      $.each(data, function() {
          if (stepObj[this.name] !== undefined) {
              if (!stepObj[this.name].push) {
                  stepObj[this.name] = [stepObj[this.name]];
              }
              stepObj[this.name].push(this.value || '');
          } else {
              stepObj[this.name] = this.value || '';
          }
      });

      //this.hopscotchJSON.steps[stepNum-1] = stepObj;
      console.log(stepObj);
    },

    injectjQuery: function() {
      var jq = document.createElement('script');
      jq.src = "http://code.jquery.com/jquery-latest.min.js";
      document.getElementsByTagName('head')[0].appendChild(jq);
      jQuery.noConflict();    
    }
  };

  
  /** TODO: Fetch assets (js/css) when bookmarklet is initiated.
   * For now we'll just assume their there and use this demo page: http://gkoo-ld.linkedin.biz/gkoo/hopscotch/
  **/

  //hopscotchBuilder.init();
//}());
