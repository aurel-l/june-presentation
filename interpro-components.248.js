webpackJsonp([1],{

/***/ 25:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const entryIdPattern = /^[A-Z0-9]{3,}$/;

const idToUrl = (url => id => `${url}${id}`)(`
  //www.example.com/
`.trim().replace('\n', ''));

class InterproDataLoader extends HTMLElement {
  static get observedAttributes() {
    return ['entryid'];
  }

  _render() {
    const id = this.entryid;
    // Clean up the DOM
    const sources = this.querySelectorAll('source');
    for (const source of sources) {
      source.parentElement.removeChild(source);
    }
    // If no ID, skip
    if (!id) return;
    // We have an ID, add or modify a data-loader element to fetch the data
    const source = document.createElement('source');
    source.src = idToUrl(id);
    let dataLoader = this.querySelector(InterproDataLoader.dataLoaderElementName);
    // If no data loader yet, create and add it
    if (!dataLoader) {
      dataLoader = document.createElement(InterproDataLoader.dataLoaderElementName);
      dataLoader.appendChild(source);
      this.appendChild(dataLoader);
    } else {
      dataLoader.appendChild(source);
    }
  }

  _planRender() {
    // If render is already planned, skip
    if (this._plannedRender) return;
    this._plannedRender = true;
    requestAnimationFrame(() => {
      this._plannedRender = false;
      this._render();
    });
  }

  // Getters/Setters
  // entryid
  get entryid() {
    return this._entryid;
  }

  set entryid(value) {
    const _value = (value || '').trim().toUpperCase();
    if (_value && !entryIdPattern.test(_value)) {
      throw new Error(`${value} is not a valid entry ID`);
    }
    this._entryid = _value || null;
    if (this._entryid) {
      this.setAttribute('entryid', this.pdbid);
      this._planRender();
    } else {
      this.removeAttribute('entryid');
    }
  }

  // Custom element reactions
  constructor() {
    super();
    // set defaults
    this._entryid = null;
  }

  connectedCallback() {
    this._planRender();
  }

  disconnectedCallback() {
    this._plannedRender = false;
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[attributeName] = newValue;
  }
}
InterproDataLoader.dataLoaderElementName = 'data-loader';

/* harmony default export */ __webpack_exports__["a"] = (InterproDataLoader);

/***/ }),

/***/ 26:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const HARDCODED_SIZE = 21; // TODO: change that to something not fixed

class InterproEntry extends HTMLElement {
  static get observedAttributes() {
    return ['accession', 'name', 'type', 'level', 'selected', 'haschildren', 'state', 'href', 'includeexpander'];
  }

  _handleLoadEvent(event) {
    try {
      this.accession = event.detail.metadata.accession;
      this.name = event.detail.metadata.name.name;
      this.type = event.detail.metadata.type;
      this._planRender();
    } catch (err) {
      console.error(err);
    }
  }

  _collapseTree() {
    for (const child of this.children) {
      child.setAttribute('hidden', '');
    }
  }

  _expandTree() {
    for (const child of this.children) {
      child.removeAttribute('hidden');
    }
  }

  _handleStateChangeEvent(event) {
    if (event.target.classList.contains('expander')) {
      for (const child of this.parentElement.children) {
        child.removeAttribute('hidden');
      }
      event.target.classList.remove('expander');
      return;
    }
    switch (this._state) {
      case 'collapsed':
        this._expandTree();
        this.setAttribute('state', 'expanded');
        break;
      case 'expanded':
        this._collapseTree();
        this.setAttribute('state', 'collapsed');
        break;
    }
  }

  _render() {
    // If first render
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    if (this.querySelectorAll('interpro-entry').length > 0) this.setAttribute('haschildren', '');
    for (const child of this.children) {
      child.setAttribute('level', this._level + 1);
    }
    const shadowDom = this.shadyRoot || this.shadowRoot;
    const link = this._href || `https://www.ebi.ac.uk/interpro/entry/${this._accession}`;
    shadowDom.innerHTML = `
      <style>
        .link {
          text-decoration: underline;
          color: midnightblue;
          cursor: pointer;
        }
        .link:hover {
          color: royalblue;
        }
        .children {
          /*animation: fade 0.5s;*/
          transform-origin: top right;
          transform: scaleY(1);
          /*height: 100%;*/
          opacity: 1;
          transition-property: opacity, transform, max-height;
          transition-timing-function: ease;
          transition-duration: 0.2s;
        }
        :host(.hidden) .children {
          transform-origin: top right;
          transform: scaleY(0.1);
          opacity: 0;
          max-height: 0em;
          transition-duration: 0s;
        }
        .entry {
          background-color: #e0e0f0;
          position: relative;
          padding: 6px 10px;
          margin-bottom: 2px;
          height: ${HARDCODED_SIZE * 2}px;
          line-height: 1;
        }
        .entry:before {
          content: '';
          position: absolute;
          width: 0; 
          height: 0; 
          border: ${HARDCODED_SIZE}px solid #e0e0f0;
          border-left: 0.5em solid transparent;
          border-right: 0;
          left: -0.45em;
          top: 0;
        }
        .entry:after {
          content: '';
          position: absolute;
          width: 0; 
          height: 0; 
          border: ${HARDCODED_SIZE}px solid transparent;
          border-left: 0.5em solid #e0e0f0;
          left: 100%;
          top: 0;
        }
        .action-holder {
          position: absolute;
          width: 2em; 
          height: 1em; 
          border-radius: 0.3em;
          left: 3.5em;
          top: 2em;
          border: 0;
          background-color: white;
          z-index: 2;
          visibility: hidden;
          color: #055d97;
        }
        .action-holder:hover {
          color: #058db7;            
          background-color: lightyellow;
        }
        .action-holder:after {
          content: '';
          font-weight: bold;
          width: 2em;
          text-align: center;
          position: absolute;
          cursor: pointer;
        }
        .has-children, .expander {
          visibility: visible;
        }
        .has-children:after {
          content: '-';
        }
        .expander:after {
          content: '…';
        }
        :host(.hidden) .has-children:after {content: '+';}
      </style>
      <div style="display: inline-block; white-space: nowrap;">
        <div class="entry"  style="margin-left: ${this._level}rem;">
          <interpro-type type="${this._type}"></interpro-type> 
          <span 
              style="
                font-family: 'Helvetica Neue', Verdana, sans-serif;
                font-weight: ${this._selected ? 'bold' : 'normal'}
          ">
              <a class="${this._selected ? '' : 'link'}" ${this._selected ? '' : `href="${link}"`}>
                   ${this._name}
               </a> (${this._accession})
           </span>
          
            <div 
                class="
                    action-holder 
                    ${this._haschildren ? 'has-children' : ''}
                    ${this._includeexpander ? 'expander' : ''}
                    " 
             ></div>
        </div>
      </div>
      <div class="children">${this.innerHTML}</div>
      
    `.trim();
    this.shadowRoot.querySelector('.action-holder').addEventListener('click', this._handleStateChangeEvent);
  }

  _planRender() {
    // console.log('planning rendering');
    // If rendering is already planned, skip the rest
    if (this._plannedRender) return;
    // Set a flag and _planRender at the next frame
    this._plannedRender = true;
    // setTimeout(() => {
    requestAnimationFrame(() => {
      // Removes the planned rendering flag
      this._plannedRender = false;
      this._render();
    });
    // }, 2000);
  }

  _planUpdate() {
    this.classList.toggle('hidden');
  }

  // Getters/Setters
  // accession
  get accession() {
    return this._accession;
  }

  set accession(value) {
    this._accession = value;
  }
  // name
  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }
  // type
  get type() {
    return this._type;
  }

  set type(value) {
    this._type = value;
  }
  // level
  get level() {
    return this._level;
  }

  set level(value) {
    this._level = value * 1;
  }
  get selected() {
    return this._selected;
  }

  set selected(value) {
    this._selected = value !== null;
  }
  get haschildren() {
    return this._haschildren;
  }

  set haschildren(value) {
    this._haschildren = value !== null;
  }
  get includeexpander() {
    return this._includeexpander;
  }

  set includeexpander(value) {
    this._includeexpander = value !== null;
  }
  get state() {
    return this._state;
  }

  set state(value) {
    this._state = value;
  }
  get href() {
    return this._href;
  }

  set href(value) {
    this._href = value;
  }

  // Custom element reactions
  constructor() {
    super();
    // set defaults
    this._type = 'undefined';
    this._accession = '';
    this._name = '';
    this._level = 0;
    this._state = 'expanded';
    this._handleLoadEvent = this._handleLoadEvent.bind(this);
    this._handleStateChangeEvent = this._handleStateChangeEvent.bind(this);
    this._render = this._render.bind(this);
    this._planRender = this._planRender.bind(this);
    this._planUpdate = this._planUpdate.bind(this);
  }

  connectedCallback() {
    this.addEventListener('load', this._handleLoadEvent);
  }

  disconnectedCallback() {
    this.removeEventListener('load', this._handleLoadEvent);
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[attributeName] = newValue;
    if (attributeName !== 'state') {
      this._planRender();
      return;
    }
    this._planUpdate();
  }
}

/* harmony default export */ __webpack_exports__["a"] = (InterproEntry);

/***/ }),

/***/ 27:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

class InterproHierarchy extends HTMLElement {
  static get observedAttributes() {
    return ['accession', 'accessions', 'displaymode', 'hideafter', 'hrefroot'];
  }
  _handleLoadEvent(event) {
    try {
      this._hierarchy = event.detail;
      this._planRender();
    } catch (err) {
      console.error(err);
    }
  }

  _pruneTreeMarking(node) {
    const { children, accession } = node;
    node.pruned = true;
    if (this._accessions.find(e => e === accession)) {
      node.pruned = false;
    }
    if (children) {
      for (const child of children) {
        if (!this._pruneTreeMarking(child)) node.pruned = false;
      }
    }
    return node.pruned;
  }
  _pruneTreePruning(node) {
    const { children, accession, name, type } = node;
    const n = { accession, name, type };
    if (!node.pruned) {
      if (children) {
        for (const child of children) {
          const survivor = this._pruneTreePruning(child);
          if (survivor) {
            if (!n['children']) n['children'] = [];
            n['children'].push(survivor);
          } else if (!this._displaymode.includes('no-children')) {
            if (!n['children']) n['children'] = [];
            n['children'].push({
              accession: child.accession,
              name: child.name,
              type: child.type
            });
          }
        }
      }
      return n;
    }
    return false;
  }

  _pruneTree(node) {
    this._pruneTreeMarking(node);
    return this._pruneTreePruning(node);
  }
  _moveAccessionToTop(node) {
    if (!this._accession) return false;
    if (node.accession === this._accession) return true;
    if (!node.children) return false;
    const branches = node.children.map(child => this._moveAccessionToTop(child));
    const index = branches.indexOf(true);
    if (index > 0) {
      [node.children[0], node.children[index]] = [node.children[index], node.children[0]];
    }
    return false;
  }

  _json2HTML(hierarchy, hide = false, includeExpander = false) {
    const selected = hierarchy.accession === this._accession ? 'selected' : '';
    return `
      <interpro-entry 
        accession="${hierarchy.accession}" 
        type="${hierarchy.type}" 
        name="${hierarchy.name}" ${selected}
        ${hide ? 'hidden' : ''}
        ${includeExpander ? 'includeexpander' : ''}
        ${this._hrefroot ? `href="${this._hrefroot}/${hierarchy.accession}"` : ''}
      >
        ${hierarchy.children ? hierarchy.children.map((child, i) => this._json2HTML(child, i >= this._hideafter, i + 1 === this._hideafter && hierarchy.children.length > i + 1)).join('') : ''} 
      </interpro-entry>
    `;
  }
  _render() {
    // If first render
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    this._moveAccessionToTop(this._hierarchy);
    let h = this._hierarchy;
    if (this._displaymode.includes('pruned')) {
      h = Array.isArray(h) ? h.map(n => this._pruneTree(n)) : this._pruneTree(this._hierarchy);
    }
    const shadowDom = this.shadyRoot || this.shadowRoot;
    shadowDom.innerHTML = Array.isArray(h) ? h.map(n => this._json2HTML(n).trim()).join('') : this._json2HTML(h).trim();
  }
  _planRender() {
    // console.log('planning rendering');
    // If rendering is already planned, skip the rest
    if (this._plannedRender) return;
    // Set a flag and _planRender at the next frame
    this._plannedRender = true;
    // setTimeout(() => {
    requestAnimationFrame(() => {
      // Removes the planned rendering flag
      this._plannedRender = false;
      this._render();
    });
    // }, 2000);
  }
  constructor() {
    super();
    // set defaults
    this._displaymode = 'full';
    this._hideafter = Infinity;
    this._hrefroot = null;
    this._handleLoadEvent = this._handleLoadEvent.bind(this);
    this._json2HTML = this._json2HTML.bind(this);
    this._render = this._render.bind(this);
    this._planRender = this._planRender.bind(this);
    this._pruneTree = this._pruneTree.bind(this);
  }

  get accession() {
    return this._accession;
  }
  set accession(value) {
    this._accession = value;
  }
  get accessions() {
    return this._accessions;
  }
  set accessions(value) {
    this._accessions = Array.isArray(value) ? value : value.split(',');
  }
  get hrefroot() {
    return this._hrefroot;
  }
  set hrefroot(value) {
    this._hrefroot = value;
  }
  get displaymode() {
    return this._displaymode;
  }
  set displaymode(value) {
    this._displaymode = value;
  }
  get hideafter() {
    return this._hideafter;
  }
  set hideafter(value) {
    this._hideafter = value * 1;
  }

  set hierarchy(value) {
    this._hierarchy = value;
    this._planRender();
  }
  connectedCallback() {
    const dataLoader = this.querySelector('data-loader');
    if (dataLoader) {
      dataLoader.addEventListener('load', this._handleLoadEvent, { once: true });
      if (dataLoader.data) {
        this._hierarchy = dataLoader.data;
        this._planRender();
      }
    }
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[attributeName] = newValue;
    if (this._hierarchy) {
      this._planRender();
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (InterproHierarchy);

/***/ }),

/***/ 28:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const supportedTypes = new Map([['family', { full: 'Family', small: 'F', color: '#EC1D25' }], ['domain', { full: 'Domain', small: 'D', color: '#45B41A' }], ['repeat', { full: 'Repeat', small: 'R', color: '#FF830A' }], ['site', { full: 'Site', small: 'S', color: '#A336C6' }], ['active site', { full: 'Active Site', small: 'S', color: '#A336C6' }], ['binding site', { full: 'Binding Site', small: 'S', color: '#A336C6' }], ['conserved site', { full: 'Conserved Site', small: 'S', color: '#A336C6' }], ['ptm', { full: 'PTM', small: 'S', color: '#A336C6' }], ['undefined', { full: 'Undefined', small: 'U', color: '#D3C5BC' }]]);

class InterproType extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'expanded'];
  }

  _handleLoadEvent(event) {
    try {
      this.type = event.detail.metadata.type;
    } catch (err) {
      console.error(err);
    }
  }

  _render() {
    // If first render
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    (this.shadyRoot || this.shadowRoot).innerHTML = `
      <span class="root"
        style="
          display: inline-block;
          font-family: 'Helvetica Neue', Verdana, sans-serif;
          margin: 0.1rem;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        "
      >
        <span class="small"
          style="
            display: inline-block;
            margin: 0.1rem;
            padding: 0.2rem 0.4rem;
            border: 1px gray solid;
            border-radius: 0.2rem;
            background: ${this._type.color};
            color: white;
          "
        >
          ${this._type.small}
        </span>
        ${this.expanded ? `
            <span class="full"
              style="background: none; color: ${this._type.color};"
            >
              ${this._type.full}
            </span>
          ` : ''}
      </span>
    `.trim();
  }

  _planRender() {
    // console.log('planning rendering');
    // If rendering is already planned, skip the rest
    if (this._plannedRender) return;
    // Set a flag and _planRender at the next frame
    this._plannedRender = true;
    requestAnimationFrame(() => {
      // Removes the planned rendering flag
      this._plannedRender = false;
      this._render();
    });
  }

  // Getters/Setters
  // type
  get type() {
    return this._type.type;
  }

  set type(value) {
    const _value = value.trim().toLowerCase();
    const descriptor = supportedTypes.get(_value);
    if (!descriptor) throw new Error(`${value} is not a supported type`);
    this._type = Object.assign({ type: _value }, descriptor);
    this.setAttribute('type', _value);
    this._planRender();
  }

  // expanded
  get expanded() {
    return this._expanded;
  }

  set expanded(value) {
    this._expanded = value !== null;
    if (this._expanded) {
      this.setAttribute('expanded', '');
    } else {
      this.removeAttribute('expanded');
    }
    this._planRender();
  }

  // Custom element reactions
  constructor() {
    super();
    // set defaults
    this._type = supportedTypes.get('undefined');
    this._expanded = false;
    this._handleLoadEvent = this._handleLoadEvent.bind(this);
    this._render = this._render.bind(this);
    this._planRender = this._planRender.bind(this);
  }

  connectedCallback() {
    this.addEventListener('load', this._handleLoadEvent);
  }

  disconnectedCallback() {
    this.removeEventListener('load', this._handleLoadEvent);
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[attributeName] = newValue;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (InterproType);

/***/ }),

/***/ 3:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__interpro_data_loader__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__interpro_type__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__interpro_entry__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__interpro_hierarchy__ = __webpack_require__(27);





const InterproDataLoader = __WEBPACK_IMPORTED_MODULE_0__interpro_data_loader__["a" /* default */];
/* harmony export (immutable) */ __webpack_exports__["InterproDataLoader"] = InterproDataLoader;

const InterproType = __WEBPACK_IMPORTED_MODULE_1__interpro_type__["a" /* default */];
/* harmony export (immutable) */ __webpack_exports__["InterproType"] = InterproType;

const InterproEntry = __WEBPACK_IMPORTED_MODULE_2__interpro_entry__["a" /* default */];
/* harmony export (immutable) */ __webpack_exports__["InterproEntry"] = InterproEntry;

const InterproHierarchy = __WEBPACK_IMPORTED_MODULE_3__interpro_hierarchy__["a" /* default */];
/* harmony export (immutable) */ __webpack_exports__["InterproHierarchy"] = InterproHierarchy;


/***/ })

});
//# sourceMappingURL=interpro-components.248.js.map