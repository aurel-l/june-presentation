export default (definition, tagName, statics = {}) => {
  if (!(window && 'customElements' in window)) return;
  const definedTagName = tagName || definition.tagName;
  if (!definedTagName) throw new Error('No tag named defined for', definition);
  for (const [key, value] of Object.entries(statics)) {
    definition[key] = value;
  }
  customElements.define(definedTagName, definition);
  return definedTagName;
};
