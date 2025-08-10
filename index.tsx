
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { I18nProvider } from './i18n';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  // StrictMode fue removido para evitar doble renderizado en desarrollo,
  // lo cual afectaba la inicialización del chat y la lectura de localStorage.
  <I18nProvider>
    <App />
  </I18nProvider>
);
