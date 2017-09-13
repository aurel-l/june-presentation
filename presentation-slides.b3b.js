webpackJsonp([3],{

/***/ 9:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class PresentationSlides extends HTMLElement {

  get total() {
    return this._slides.length;
  }

  get slide() {
    return this._slide;
  }

  set slide(value) {
    const _value = +value;
    if (_value === this._slide) return;
    const validSlide = _value && Number.isInteger(_value) && _value <= this._slides.length;
    if (!validSlide) {
      this.setAttribute('slide', `${this._slide}`);
      throw new Error(`Slide ${value} is not a valid slide`);
    }
    let prevSlide;
    if (this._slide) {
      prevSlide = this._slide;
    }
    this._slide = +value;
    this.setAttribute('slide', `${_value}`);
    let prev;
    if (prevSlide) {
      prev = this._slides[prevSlide - 1];
    }
    this._transition(prev, this._slides[_value - 1]);
  }

  _transition(from, to) {
    return _asyncToGenerator(function* () {
      let forward = true;
      // disappearing
      if (from) {
        forward = from.nextElementSibling === to;
        if (from.onExit) {
          yield from.onExit();
        } else if (from.animate) {
          // default
          yield Promise.all(Array.from(from.children).filter(function (el) {
            return el.tagName !== 'style';
          }).reverse().map(function (el, i) {
            return el.animate({
              opacity: [1, 0],
              filter: ['blur(0)', 'blur(5px)'],
              transform: ['translateX(0)', `translateX(${forward ? '-' : ''}100px)`]
            }, {
              duration: 200,
              delay: i * 10,
              fill: 'both',
              easing: 'cubic-bezier(.41,0,.32,1)'
            }).finished;
          }));
        }
        from.classList.remove('visible');
      }
      // appearing
      to.classList.add('visible');
      if (to.onEnter) {
        yield to.onEnter();
      } else if (to.animate) {
        // default
        yield Promise.all(Array.from(to.children).filter(function (el) {
          return el.tagName !== 'style';
        }).map(function (el, i) {
          return el.animate({
            opacity: [0, 1],
            filter: ['blur(5px)', 'blur(0)'],
            transform: [`translateX(${forward ? '' : '-'}100px)`, 'translateX(0)']
          }, {
            duration: 500,
            delay: i * 250,
            fill: 'both',
            easing: 'cubic-bezier(.41,0,.32,1)'
          }).finished;
        }));
      }
    })();
  }

  // constructor() {
  //   super();
  // }

  connectedCallback() {
    console.log('presentation-manager connected');
    this._slides = this.querySelectorAll(PresentationSlides.slideSelector);
    console.log(this._slides);
    if (!this._slides.length) {
      throw new Error('No slide to display');
    }
    this.slide = this.getAttribute('slide') || 1;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
  }
}

PresentationSlides.is = 'presentation-slides';
PresentationSlides.slideSelector = 'section';
PresentationSlides.observedAttributes = ['slide'];
/* harmony default export */ __webpack_exports__["default"] = (PresentationSlides);

/***/ })

});
//# sourceMappingURL=presentation-slides.b3b.js.map