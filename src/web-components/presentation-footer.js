class PresentationSlides extends HTMLElement {
  static is = 'presentation-footer';
  static observedAttributes = ['current', 'total'];

  get total() {
    return this._total;
  }

  set total(value) {
    const _value = +value;
    if (_value === this._total) return;
    if (!(Number.isInteger(_value) && _value >= 0)) {
      this.setAttribute('total', `${this._total}`);
      throw new Error(`${value} is not a valid total number of slides`);
    }
    this._total = _value;
    this.setAttribute('total', `${_value}`);
    this._totalDOM.textContent = `${_value}`;
  }

  get current() {
    return this._current;
  }

  set current(value) {
    const _value = +value;
    if (_value === this._current) return;
    if (!(Number.isInteger(_value) && _value <= this._total)) {
      this.setAttribute('current', `${this._current}`);
      throw new Error(`Slide ${value} is not a valid slide`);
    }
    this._current = _value;
    this.setAttribute('current', `${_value}`);
    this._currentDOM.textContent = `${_value}`;
  }

  // constructor() {
  //   super();
  // }

  connectedCallback() {
    console.log('presentation-footer connected');
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
      <style>
        footer {
          display: grid;
          height: 100%;
          align-items: center;
          grid-template-columns: 10% 1fr 10%;
        }

        footer > * {
          margin: 0.5em;
        }

        .start {
          justify-self: start
        }

        .center {
          justify-self: center;
        }

        .end {
          justify-self: end;
        }
      </style>
      <footer>
        <span class="start"></span>
        <span class="center"><slot>Footer</slot></span>
        <span class="end">
          <span id="current"></span> of <span id="total"></span>
        </span>
      </footer>
    `;
    this._currentDOM = shadowRoot.getElementById('current');
    this._totalDOM = shadowRoot.getElementById('total');
    this.total = this.getAttribute('total') || 1;
    this.current = this.getAttribute('current') || 1;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
  }
}

export default PresentationSlides;
