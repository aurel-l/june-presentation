class PresentationSlides extends HTMLElement {
  static tagName = 'presentation-slides';
  static slideSelector = 'section';
  static observedAttributes = ['slide'];

  get slide() {
    return this._slide;
  }

  set slide(value) {
    const _value = +value;
    if (_value === this._slide) return;
    const validSlide = (
      _value &&
      Number.isInteger(_value) &&
      _value <= this._slides.length
    );
    if (!validSlide) {
      this.setAttribute("slide", `${this._slide}`)
      throw new Error(`Slide ${value} is not a valid slide`);
    }
    let prevSlide;
    if (this._slide) {
      prevSlide = this._slide;
    }
    this._slide = +value;
    this.setAttribute('slide', `${_value}`);
    if (prevSlide) {
      this._slides[prevSlide - 1].classList.remove("visible");
    }
    this._slides[_value - 1].classList.add('visible');
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
    this.slide = this.getAttribute("slide") || 1;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
  }
};

export default PresentationSlides;
