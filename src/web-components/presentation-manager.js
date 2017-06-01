class PresentationManager extends HTMLElement {
  static is = 'presentation-manager';
  static slideContainerSelector = 'presentation-slides';
  static footerSelector = 'presentation-footer';

  // constructor() {
  //   super();
  // }

  next() {
    try {
      this._slideContainer.slide++;
    } catch (_) {}
    this._footer.current = this._slideContainer.slide;
  }

  previous() {
    try {
      this._slideContainer.slide--;
    } catch (_) {}
    this._footer.current = this._slideContainer.slide;
  }

  connectedCallback() {
    console.log('presentation-manager connected');
    this._slideContainer = this.querySelector(
      PresentationManager.slideContainerSelector,
    );
    this._footer = this.querySelector(PresentationManager.footerSelector);
    this._footer.total = this._slideContainer.total;
    if (!this._slideContainer) {
      throw new Error('A slide container is missing');
    }
    this.addEventListener('next', this.next);
    this.addEventListener('previous', this.previous);
  }

  disconnectedCallback() {
    this.removeEventListener('next', this.next);
    this.removeEventListener('previous', this.previous);
  }
}

export default PresentationManager;
