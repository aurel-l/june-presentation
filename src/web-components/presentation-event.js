class PresentationEvent extends HTMLElement {
  static is = 'presentation-event';

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

  _onEvent = e => {
    if (e.key && this._keys.length && !this._keys.includes(e.key)) return;
    this.dispatchEvent(new CustomEvent(this._event, { bubbles: true }));
  };
}

export default PresentationEvent;
