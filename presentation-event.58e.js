webpackJsonp([6],{

/***/ 6:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
class PresentationEvent extends HTMLElement {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this._onEvent = e => {
      if (e.key && this._keys.length && !this._keys.includes(e.key)) return;
      if (e.target.tagName === 'INPUT') return;
      this.dispatchEvent(new CustomEvent(this._event, { bubbles: true }));
    }, _temp;
  }

  connectedCallback() {
    const selector = this.getAttribute('target');
    this._target = selector ? document.querySelector(selector) : document;
    this._keys = (this.getAttribute('key') || '').split(/\s+/);
    this._event = this.getAttribute('event');
    this._sourceEvent = this.getAttribute('sourceEvent') || 'keydown';
    this._target.addEventListener(this._sourceEvent, this._onEvent);
  }

  disconnectedCallback() {
    this._target.removeEventListener(this._sourceEvent, this._onEvent);
  }

}

PresentationEvent.is = 'presentation-event';
/* harmony default export */ __webpack_exports__["default"] = (PresentationEvent);

/***/ })

});
//# sourceMappingURL=presentation-event.58e.js.map