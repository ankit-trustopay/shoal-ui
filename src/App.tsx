import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedAppRoutes } from './components/auth/ProtectedAppRoutes';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { UseCases } from './pages/UseCases';
import { Pricing } from './pages/Pricing';
import { Contact } from './pages/Contact';
import { Product } from './pages/Product';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';

function Placeholder() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="font-mono text-sm uppercase tracking-widest text-gray-400">
        Shoal AI · Page not found
      </p>
    </div>
  );
}

function MarketingPage({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/signin" element={<Navigate to="/sign-in" replace />} />
        <Route path="/signup" element={<Navigate to="/sign-up" replace />} />

        <Route path="/app/*" element={<ProtectedAppRoutes />} />

        <Route
          path="/"
          element={
            <MarketingPage>
              <Home />
            </MarketingPage>
          }
        />
        <Route
          path="/about"
          element={
            <MarketingPage>
              <About />
            </MarketingPage>
          }
        />
        <Route
          path="/product"
          element={
            <MarketingPage>
              <Product />
            </MarketingPage>
          }
        />
        <Route
          path="/use-cases"
          element={
            <MarketingPage>
              <UseCases />
            </MarketingPage>
          }
        />
        <Route
          path="/pricing"
          element={
            <MarketingPage>
              <Pricing />
            </MarketingPage>
          }
        />
        <Route
          path="/contact"
          element={
            <MarketingPage>
              <Contact />
            </MarketingPage>
          }
        />
        <Route
          path="*"
          element={
            <MarketingPage>
              <Placeholder />
            </MarketingPage>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
