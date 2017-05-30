export default async (definition, tagName, statics = {}) => {
  if (!(window && 'customElements' in window)) return;
  let _definition = definition;
  if (!(definition.prototype instanceof HTMLElement)) {
    _definition = await definition();
    _definition = _definition.default || _definition;
  }
  for (const [key, value] of Object.entries(statics)) {
    _definition[key] = value;
  }
  const definedTagName = tagName || _definition.is;
  if (!definedTagName) throw new Error('No tag named defined for', _definition);
  customElements.define(definedTagName, _definition);
  return definedTagName;
};
