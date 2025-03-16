  import React  from 'react';
  import ReactDOM from 'react-dom/client';
  import { RouterProvider } from 'react-router-dom';
  import router from './routes';
  import { Provider } from 'react-redux';
  import { store } from './store/store';
  import { Analytics } from "@vercel/analytics/react"
  import './index.css'
  import { HelmetProvider } from 'react-helmet-async';

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <HelmetProvider>
          <RouterProvider router={router}/>
          <Analytics />
        </HelmetProvider>
      </Provider>
    </React.StrictMode>
  );

