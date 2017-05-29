import 'styles.css';

import DataLoader from 'data-loader';
import PresentationManager from "web-components/presentation-manager";
import PresentationSlides from "web-components/presentation-slides";

import defineWebComponent from 'utils/defineWebComponent';

defineWebComponent(PresentationManager);
defineWebComponent(
  PresentationSlides,
  null,
  {slideSelector: 'section, presentation-slide'},
);
defineWebComponent(DataLoader, 'data-loader');

console.log('Hello from index.js');
