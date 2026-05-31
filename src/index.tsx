import './index.css';
import React from 'react';
import { render } from 'react-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { App } from './App';
import { CLERK_PUBLISHABLE_KEY } from './lib/clerk';

render(
  <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>,
  document.getElementById('root'),
);
