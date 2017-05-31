let registration;

const createRegistration = () => {
  if (!document) return;
  const map = new Map();
  const onKeydown = ({ key }) => {
    for (const [el, { event, keys }] of map) {
      if (!keys.has(key)) continue;
      el.dispatchEvent(new CustomEvent(event, { bubbles: true }));
    }
  };
  document.addEventListener('keydown', onKeydown);
  registration = {
    register(el, event, ...keys) {
      map.set(el, { event, keys: new Set(keys) });
    },
    unregister(el) {
      map.delete(el);
      if (!map.size) {
        document.removeEventListener('keydown', onKeydown);
        registration = null;
      }
    },
  };
};

class PresentationEvent extends HTMLElement {
  static is = 'presentation-event';

  connectedCallback() {
    if (!registration) createRegistration();
    registration.register(
      this,
      this.getAttribute('event'),
      ...this.getAttribute('key').split(/\s+/),
    );
  }

  disconnectedCallback() {
    if (!registration) return;
    registration.unregister(this);
  }
}

export default PresentationEvent;
