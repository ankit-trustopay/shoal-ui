import React, { useState } from 'react';
import {
  AlertTriangleIcon,
  CameraIcon,
  CheckIcon,
} from 'lucide-react';
import { BentoCard } from '../ui/BentoCard';
import { MonoLabel } from '../ui/MonoLabel';

export function SettingsProfilePanel() {
  const [name, setName] = useState('Ankit');
  const [email, setEmail] = useState('ankit.trustopay@gmail.com');
  const [workspace, setWorkspace] = useState('Trustopay');
  const [timezone, setTimezone] = useState('UTC−05:00 Eastern');
  const [profileSaved, setProfileSaved] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const handleProfileSave = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl">
      <BentoCard className="p-6 mb-6">
        <h2 className="text-lg font-bold text-black tracking-tight mb-1">
          Profile picture
        </h2>
        <p className="text-sm text-gray-600 mb-5">
          Shown across Shoal AI in your account menu and reports.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-axiom text-white flex items-center justify-center text-2xl font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 bg-white border border-gray-200/60 rounded-lg px-3.5 py-2 text-sm font-medium text-black hover:bg-gray-50 transition-colors"
            >
              <CameraIcon size={14} />
              Upload
            </button>
            <button
              type="button"
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </BentoCard>

      <BentoCard className="p-6 mb-6">
        <h2 className="text-lg font-bold text-black tracking-tight mb-1">
          Account details
        </h2>
        <p className="text-sm text-gray-600 mb-5">
          Your name and email are used for invoices and notifications.
        </p>
        <div className="space-y-4">
          <FormField label="Full name">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </FormField>
          <FormField label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </FormField>
          <FormField label="Workspace">
            <input
              type="text"
              value={workspace}
              onChange={(e) => setWorkspace(e.target.value)}
              className={inputClass}
            />
          </FormField>
          <FormField label="Timezone">
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className={inputClass}
            >
              <option>UTC−08:00 Pacific</option>
              <option>UTC−05:00 Eastern</option>
              <option>UTC+00:00 London</option>
              <option>UTC+01:00 Berlin</option>
              <option>UTC+05:30 India</option>
              <option>UTC+09:00 Tokyo</option>
            </select>
          </FormField>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button
            type="button"
            onClick={handleProfileSave}
            className="bg-axiom text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-orange-600 transition-colors"
          >
            Save changes
          </button>
          {profileSaved && (
            <span className="inline-flex items-center gap-1 text-sm text-emerald-600 font-medium">
              <CheckIcon size={14} /> Saved
            </span>
          )}
        </div>
      </BentoCard>

      <BentoCard className="p-6 mb-6">
        <h2 className="text-lg font-bold text-black tracking-tight mb-1">Password</h2>
        <p className="text-sm text-gray-600 mb-5">
          Update your password regularly to keep your account secure.
        </p>
        <button
          type="button"
          className="inline-flex items-center bg-white border border-gray-200/60 rounded-lg px-4 py-2.5 text-sm font-medium text-black hover:bg-gray-50 transition-colors"
        >
          Change password
        </button>
      </BentoCard>

      <section className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
        <div className="flex items-start gap-3 mb-2">
          <AlertTriangleIcon size={18} className="text-rose-600 mt-0.5 shrink-0" />
          <div>
            <h2 className="text-lg font-bold text-black tracking-tight">
              Delete account
            </h2>
            <p className="text-sm text-gray-700 mt-1">
              Permanently remove your Shoal AI workspace, swarms, and billing
              data. This action cannot be undone.
            </p>
          </div>
        </div>
        {!showDelete ? (
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            className="mt-3 inline-flex items-center bg-white border border-rose-300 text-rose-700 rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-rose-100 transition-colors"
          >
            Delete my account
          </button>
        ) : (
          <div className="mt-4 bg-white border border-rose-200 rounded-xl p-4">
            <p className="text-sm text-gray-700 mb-3">
              Type{' '}
              <span className="font-mono font-semibold text-rose-700">DELETE</span>{' '}
              to confirm.
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              className="w-full bg-white px-4 py-2.5 border border-rose-200 rounded-lg text-sm text-black focus:outline-none focus:border-rose-500 transition-colors mb-3"
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={deleteConfirm !== 'DELETE'}
                className="bg-rose-600 text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Permanently delete
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDelete(false);
                  setDeleteConfirm('');
                }}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <MonoLabel className="mb-1.5 block">{label}</MonoLabel>
      {children}
    </div>
  );
}

const inputClass =
  'w-full bg-white px-4 py-2.5 border border-gray-200/60 rounded-lg text-sm text-black focus:outline-none focus:border-black transition-colors';
