import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { AppShell } from '../AppShell';
import { NewSwarm } from '../../pages/NewSwarm';
import { History } from '../../pages/History';
import { Credits } from '../../pages/Credits';
import { LiveSwarm } from '../../pages/LiveSwarm';
import { Report } from '../../pages/Report';
import { Settings } from '../../pages/Settings';

export function ProtectedAppRoutes() {
  const location = useLocation();

  return (
    <>
      <SignedIn>
        <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/app/new" replace />} />
            <Route path="/new" element={<NewSwarm />} />
            <Route path="/history" element={<History />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/live" element={<LiveSwarm />} />
            <Route path="/report" element={<Report />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/app/new" replace />} />
          </Routes>
        </AppShell>
      </SignedIn>
      <SignedOut>
        <Navigate
          to="/sign-in"
          replace
          state={{ from: location.pathname }}
        />
      </SignedOut>
    </>
  );
}
