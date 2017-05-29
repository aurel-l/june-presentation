class PresentationManager extends HTMLElement {
  static tagName = 'presentation-manager';
  static slideContainerSelector = 'presentation-slides';

  // constructor() {
  //   super();
  // }

  next() {
    this._slideContainer.slide++;
  }

  previous() {
    this._slideContainer.slide--;
  }

  connectedCallback() {
    console.log('presentation-manager connected');
    this._slideContainer = this.querySelector(
      PresentationManager.slideContainerSelector
    );
    if (!this._slideContainer) {
      throw new Error('A slide container is missing');
    }
  }
};

export default PresentationManager;
