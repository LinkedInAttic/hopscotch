var sidewalkchalk = {
  init: function(){
    this.getHtml();

    this.stepInfo = {
      stepIdBase: 'hs-builder-step-',
      tagName: 'li' 
    };
    this.stepNum = 1;

    this.hopscotchJSON = {
      id: 'untitledTest',
      steps: []
    };
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
    this.container = $('#hopscotch-builder')[0] || $('<div id="hopscotch-builder" class="ui-draggable"></div>').html(content);
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
        updateEl = this.container.find('.update'),
        testTourEl = this.container.find('.test-tour'),
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

    this.container.find('.steps-list').on('keyup', 'input', function(e){
      var $this = $(this),
          currPosition = _this.container.find('.steps-list li').index($this.parent()),
          step = $(_this.container.find('.step')[currPosition]),
          newPosition = $this.val() - 1;

      step.attr('data-position', newPosition);
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
    this.container.on('click', function(e) {
      var target = $(e.target);

      if(target.is('button[name=targetCursor]') || target.parents('button[name=targetCursor]')[0]){
        target = (target.is('button[name=targetCursor]')) ? target : $(target.parents('button[name=targetCursor]')[0]);

        if (document.getElementById('outer-target-selector')) {
          _this.removePageElement();
          $(document).unbind('click');
          return;
        } else {
          _this.selectPageElement(target);
          $(document).click(function(e) {
            if ($(e.target)[0] !== $('.target-element span')[_this.stepNum-1] && $(e.target)[0] !== $('.target-element button')[_this.stepNum-1] &&
                $(e.target)[0] !== $('.target-element')[_this.stepNum-1]) {
              _this.removePageElement(_this);
              $(document).unbind('click');
            }
          });          
        }

        target.addClass('activeTarget').addClass('button-down').removeClass('button-up');
      }

      if(target.parents('.orientation')[0] && (target.is('button') || target.parents('button')[0])){
        var target = $(e.target),
          orientInput = target.siblings('input[name=orientation]');

        target.siblings('button').removeClass('button-down').addClass('button-up');
        target.addClass('button-down').removeClass('button-up');

        if(target.hasClass('orient-up')){
          orientInput.val('top');
        }else if(target.hasClass('orient-left')){
          orientInput.val('left');
        }else if(target.hasClass('orient-right')){
          orientInput.val('right');
        }else if(target.hasClass('orient-down')){
          orientInput.val('bottom');
        }
      }

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

    /* Event listeners for Export functionality */
    exportFullEl.on('click', function() {
      _this.exportFull();
      var $swcJsonDialog = ($('#swcJsonDialog')[0]) ? $('#swcJsonDialog') : $('<div id="swcJsonDialog" class="dialog"></div>');

      $swcJsonDialog.html('<a href="#" class="close">close</a><textarea>' + JSON.stringify(_this.hopscotchJSON) + '</textarea>');
      $('body').append($swcJsonDialog);

      $swcJsonDialog.find('.close').on('click', function(e){
        e.preventDefault();
        $swcJsonDialog.remove();
      });
    });
    exportStepEl.on('click', function() {
      var $swcJsonDialog = ($('#swcJsonDialog')[0]) ? $('#swcJsonDialog') : $('<div id="swcJsonDialog" class="dialog"></div>');

      $swcJsonDialog.html('<a href="#" class="close">close</a><textarea>' + JSON.stringify(_this.exportStep(_this.stepNum-1)) + '</textarea>');
      $('body').append($swcJsonDialog);

      $swcJsonDialog.find('.close').on('click', function(e){
        e.preventDefault();
        $swcJsonDialog.remove();
      });
    });
    updateEl.on('click', function(){
      _this.exportFull();
      hopscotch.startTour(_this.hopscotchJSON, (_this.stepNum-1));
    });
    testTourEl.on('click', function(){
      _this.exportFull();

      hopscotch.startTour(_this.hopscotchJSON);
    });


    /* Draggable */
    this.container.mouseover(function() {    
      $("#sidewalkChalk").draggable();
    });

  },

  getStepFormTemplate: function(){
    this.stepForm = this.container.find('.step')[0];

    return this.stepForm.innerHTML;
  },

  insertStep: function(){
    var steps = this.container.find('.step'),
        newStep = $('<'+this.stepInfo.tagName+'>');

    this.stepNum++;

    newStep.html(this.stepInfo.template);
    newStep.addClass('step');

    steps.css('display','none');
    newStep.css('display','block');
    this.stepInfo.stepsContainer.append(newStep);
    newStep.attr('data-position', this.stepNum-1);


    var newTOCstep = $('<li></li>');
    newTOCstep.html(this.tocTemplate);
    $(newTOCstep.find('input')[0]).val(this.stepNum);

    this.stepsTOC.append(newTOCstep);

    this.container.find('.current-step')[0].innerHTML = this.stepNum;
    this.container.find('.total-steps')[0].innerHTML = $('#forms-list').find('.step').length;
    
  },

  selectPageElement: function(targetButton) {
    var box = $("<div id='outer-target-selector' />").appendTo("body"),
        last = +new Date,
        _this = this;

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

      _this.captureTargetElement(e);

    });
  },

  removePageElement: function(scope) {
    $("body").unbind('mousemove');
    $('#outer-target-selector').remove();
    $($('.target-element button')[scope.stepNum-1]).removeClass('activeTarget').removeClass('button-down').addClass('button-up');
  },

  captureTargetElement: function(e) {
    var builder = $('#hopscotch-builder'),
        thisNode = $(e.target);

    if (thisNode.parents('#hopscotch-builder').length > 0){
      return false;
    }

    if (thisNode.attr('id')) {
      $('.target-element input')[this.stepNum-1].value = thisNode.attr('id');
    } else if (thisNode.attr('class')) {
      $('.target-element input')[this.stepNum-1].value = "document.getElementsByClassName('" + thisNode.attr('class') + "')[0]";
    }
  },


  exportFull: function() {
    var steps = this.container.find('.step'),
        _this = this;

    this.hopscotchJSON.id = this.container.find('input[name=id]').val();

    this.reorderSteps();

    steps.each(function(idx){
      _this.hopscotchJSON.steps[idx] = _this.exportStep(idx);
    });
  },

  exportStep: function(stepNum) {
    var stepObj = {},
        currentStep = $(this.container.find('.step')[stepNum]),
        data = currentStep.find('input, textarea').serializeArray();

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

    return stepObj;
  },

  reorderSteps: function(){
    var legendList = this.container.find('.steps-list');
        currentLegendOrder = legendList.find('li'),
        currentStepOrder = this.container.find('.step'),
        stepList = this.container.find('#forms-list');

    currentStepOrder.detach().sort(function(a,b){
      return $(a).attr('data-position') - $(b).attr('data-position');
    });
    stepList.append(currentStepOrder);
    
    currentLegendOrder.detach().sort(function(a,b){
      return $(a).find('input').val() - $(b).find('input').val();
    });
    legendList.append(currentLegendOrder);
  }
};
