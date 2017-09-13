webpackJsonp([4],{

/***/ 8:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
class PresentationManager extends HTMLElement {

  // constructor() {
  //   super();
  // }

  next() {
    try {
      const offset = ++this._slideContainer.slide;
      this.style.setProperty('--bg-offset', `${(offset - 1) / (this._slideContainer.total - 1) * this._maxOffset}%`);
    } catch (_) {}
    this._footer.current = this._slideContainer.slide;
  }

  previous() {
    try {
      const offset = --this._slideContainer.slide;
      this.style.setProperty('--bg-offset', `${(offset - 1) / (this._slideContainer.total - 1) * this._maxOffset}%`);
    } catch (_) {}
    this._footer.current = this._slideContainer.slide;
  }

  toggleFullscreen() {
    if (document.webkitIsFullScreen) {
      document.webkitExitFullscreen();
    } else {
      document.body.webkitRequestFullscreen();
    }
  }

  handleInput({ target }) {
    const controlled = document.getElementById(target.getAttribute('aria-controls') || '');
    if (!controlled) return;
    if (!target.checkValidity()) return;
    const { customProperty, attribute } = target.dataset;
    if (customProperty) {
      controlled.style.setProperty(customProperty, `hsl(${target.value}, 49%, 59%)`);
    }
    if (attribute) {
      controlled.setAttribute(attribute, target.value);
    }
  }

  connectedCallback() {
    console.log('presentation-manager connected');
    this._slideContainer = this.querySelector(PresentationManager.slideContainerSelector);
    this._footer = this.querySelector(PresentationManager.footerSelector);
    this._footer.total = this._slideContainer.total;
    if (!this._slideContainer) {
      throw new Error('A slide container is missing');
    }

    const [maxOffset] = getComputedStyle(this).getPropertyValue('--max-bg-offset').match(/\d+/) || [0];
    this._maxOffset = +maxOffset;

    this.addEventListener('next', this.next);
    this.addEventListener('previous', this.previous);
    this.addEventListener('fullscreen', this.toggleFullscreen);
    this.addEventListener('input', this.handleInput);
  }

  disconnectedCallback() {
    this._styles = null;

    this.removeEventListener('next', this.next);
    this.removeEventListener('previous', this.previous);
    this.removeEventListener('fullscreen', this.toggleFullscreen);
    this.removeEventListener('input', this.handleInput);
  }
}

PresentationManager.is = 'presentation-manager';
PresentationManager.slideContainerSelector = 'presentation-slides';
PresentationManager.footerSelector = 'presentation-footer';
/* harmony default export */ __webpack_exports__["default"] = (PresentationManager);

/***/ })

});
//# sourceMappingURL=presentation-manager.bc1.js.map