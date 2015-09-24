import Config from './config.js';
import TemplateManager from '../managers/TemplateManager.js';

//Abstract base class for callouts
export class Callout {
  constructor(configHash, globalConfig) {
    this.config = new Config(configHash, globalConfig);
    this.el = document.createElement('div');
    this.el.classList.add('hopscotch-bubble');
  }
  render() {
    this.el.innerHTML = TemplateManager.render(
      this.config.get('renderer'),
      this.getRenderData()
      );

    document.body.appendChild(this.el);
  }
  show() {
    this.el.classList.remove('hide');
  }
  hide() {
    this.el.classList.add('hide');
  }
  destroy() {
    this.el.parentNode.removeChild(this.el);
  }
  setPosition () {
    
  }
  getRenderData() {
    return {
      i18n: {
        prevBtn: 'prevBtn',
        nextBtn: 'nextBtn',
        closeTooltip: 'closeTooltip',
        stepNum: 0,
        numSteps: 0
      },
      buttons: {
        showPrev: false,
        showNext: false,
        showCTA: this.config.get('showCTA'),
        ctaLabel: this.config.get('ctaLabel'),
        showClose: this.config.get('showCloseButton')
      },
      step: {
        title: this.config.get('title'),
        content: this.config.get('content'),
        isRtl: this.config.get('isRtl'),
        placement: this.config.get('placement'),
        padding: this.config.get('padding'),
        width: this.config.get('width'),
        customData: this.config.get('customData')
      },
      tour: {
        unsafe: this.config.get('unsafe')
      }
    };
  }
}

//Callout that is part of a tour
export class TourCallout extends Callout {
  constructor(configHash, globalConfig, tour) {
    super(configHash, globalConfig);

    this.tour = tour;

    this.el.classList.add('tour-' + this.tour.id);
  }
  getRenderData() {
    let opts = super.getRenderData();
    let tourOpts = {
      buttons: {
        showPrev: false,
        showNext: false,
      },
      step: {
        num: this.stepNumber,
        isLast: this.isLast
      },
      tour: {
        isTour: true,
        numSteps: this.tour.steps.length,
        customData: this.tour.config.get('customData')
      }
    }
    return Object.assign(opts, tourOpts);
  }
}

//Sand alone callout which is not part of a tour
//Does not have step number or pev\next buttons
export class StandaloneCallout extends Callout {
  constructor(configHash, globalConfig) {
    super(configHash, globalConfig);

    this.el.classList.add('hopscotch-callout');
    this.el.classList.add('no-number');
  }
  getRenderData() {
    return super.getRenderData();
  }
}