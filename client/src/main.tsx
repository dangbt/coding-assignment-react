import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
     <MantineProvider withGlobalStyles withNormalizeCSS>
      <App />
      <Notifications position='top-right' />
    </MantineProvider>
  </BrowserRouter>
);
