import 'styles.css';

import defineWebComponent from 'utils/defineWebComponent';

(async () => {
  await defineWebComponent(() =>
    import(
      /* webpackChunkName: 'presentation-footer' */
      'web-components/presentation-footer',
    ),
  );
  await defineWebComponent(
    () =>
      import(
        /* webpackChunkName: 'presentation-slides' */
        'web-components/presentation-slides',
      ),
    null,
    {
      slideSelector: 'section, presentation-slide',
    },
  );
  await defineWebComponent(() =>
    import(
      /* webpackChunkName: 'presentation-event' */
      'web-components/presentation-event',
    ),
  );
  await defineWebComponent(() =>
    import(
      /* webpackChunkName: 'presentation-manager' */
      'web-components/presentation-manager',
    ),
  );
  await defineWebComponent(
    () => import(/* webpackChunkName: 'data-loader' */ 'data-loader'),
    'data-loader',
  );
  const pdbWebComponents = () => import(
    /* webpackChunkName: 'pdb-web-components' */
    'pdb-web-components'
  );
  await defineWebComponent(
    () => pdbWebComponents().then(m => m.PdbDataLoader),
    'pdb-data-loader'
  );
  await defineWebComponent(
    () => pdbWebComponents().then(m => m.PdbPrints),
    'pdb-prints'
  );
  const interProComponents = () => import(
    /* webpackChunkName: 'interpro-components' */
    'interpro-components'
  );
  await defineWebComponent(
    () => interProComponents().then(m => m.InterproType),
    'interpro-type'
  );
})();

console.log('Hello from index.js');
