class PresentationSlides extends HTMLElement {
  static is = 'presentation-slides';
  static slideSelector = 'section';
  static observedAttributes = ['slide'];

  get total() {
    return this._slides.length;
  }

  get slide() {
    return this._slide;
  }

  set slide(value) {
    const _value = +value;
    if (_value === this._slide) return;
    const validSlide =
      _value && Number.isInteger(_value) && _value <= this._slides.length;
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

  async _transition(from, to) {
    let forward = true;
    // disappearing
    if (from) {
      forward = from.nextElementSibling === to;
      if (from.onExit) {
        await from.onExit();
      } else if (from.animate) {// default
        await Promise.all(
          Array.from(from.children)
            .filter(el => el.tagName !== 'style')
            .reverse()
            .map((el, i) => el.animate(
              {
                opacity: [1, 0],
                filter: ['blur(0)', 'blur(5px)'],
                transform: [
                  'translateX(0)',
                  `translateX(${forward ? '-' : ''}100px)`
                ],
              },
              {
                duration: 200,
                delay: i * 10,
                fill: 'both',
                easing: 'cubic-bezier(.41,0,.32,1)',
              }
            ).finished)
        );
      }
      from.classList.remove('visible');
    }
    // appearing
    to.classList.add('visible');
    if (to.onEnter) {
      await to.onEnter();
    } else if (to.animate) {// default
      await Promise.all(
        Array.from(to.children)
          .filter(el => el.tagName !== 'style')
          .map((el, i) => el.animate(
            {
              opacity: [0, 1],
              filter: ['blur(5px)', 'blur(0)'],
              transform: [
                `translateX(${forward ? '' : '-'}100px)`,
                'translateX(0)'
              ],
            },
            {
              duration: 500,
              delay: i * 250,
              fill: 'both',
              easing: 'cubic-bezier(.41,0,.32,1)',
            }
          ).finished)
      );
    }
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

export default PresentationSlides;
