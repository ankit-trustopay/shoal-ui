import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate } from
'react-router-dom';
import { Layout } from './components/Layout';
import { AppShell } from './components/AppShell';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { UseCases } from './pages/UseCases';
import { Pricing } from './pages/Pricing';
import { Contact } from './pages/Contact';
import { Product } from './pages/Product';
import { NewSwarm } from './pages/NewSwarm';
import { History } from './pages/History';
import { Credits } from './pages/Credits';
import { LiveSwarm } from './pages/LiveSwarm';
import { Report } from './pages/Report';
import { Settings } from './pages/Settings';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
function Placeholder() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="font-mono text-sm uppercase tracking-widest text-gray-400">
        Shoal AI · Page not found
      </p>
    </div>);

}
function AppRoutes() {
  const location = useLocation();
  const path = location.pathname;
  // Full-screen auth routes (no nav/footer/sidebar)
  if (path === '/signin' || path === '/signup') {
    return (
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>);

  }
  if (path.startsWith('/app')) {
    return (
      <AppShell>
        <Routes>
          <Route path="/app" element={<Navigate to="/app/new" replace />} />
          <Route path="/app/new" element={<NewSwarm />} />
          <Route path="/app/history" element={<History />} />
          <Route path="/app/credits" element={<Credits />} />
          <Route path="/app/live" element={<LiveSwarm />} />
          <Route path="/app/report" element={<Report />} />
          <Route path="/app/settings" element={<Settings />} />
          <Route path="/app/*" element={<Navigate to="/app/new" replace />} />
        </Routes>
      </AppShell>);

  }
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/product" element={<Product />} />
        <Route path="/use-cases" element={<UseCases />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Placeholder />} />
      </Routes>
    </Layout>);

}
export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>);

}