import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { Kicker } from '../components/Kicker';
import { Button } from '../components/Button';
import { easeOutExpo } from '../lib/motion';

type TabId = 'general' | 'partnerships' | 'credits' | 'investors';

type FieldConfig =
  | {
      type: 'input';
      label: string;
      name: string;
      inputType?: string;
      placeholder?: string;
      required?: boolean;
    }
  | {
      type: 'select';
      label: string;
      name: string;
      options: string[];
      required?: boolean;
    }
  | {
      type: 'textarea';
      label: string;
      name: string;
      placeholder?: string;
      required?: boolean;
      rows?: number;
    };

interface ContactTabConfig {
  id: TabId;
  label: string;
  heading: string;
  description: string;
  submitLabel: string;
  /** Each inner array is one row (1 field = full width, 2 fields = two columns on sm+) */
  fieldRows: FieldConfig[][];
}

const contactTabs: ContactTabConfig[] = [
  {
    id: 'general',
    label: 'General',
    heading: 'Just saying hello?',
    description: 'Send us a note. We read everything that comes through.',
    submitLabel: 'Send Message',
    fieldRows: [
      [
        { type: 'input', label: 'Full Name', name: 'fullName', required: true },
        { type: 'input', label: 'Email', name: 'email', inputType: 'email', required: true },
      ],
      [{ type: 'input', label: 'Company / Organization', name: 'company' }],
      [{ type: 'input', label: 'Subject', name: 'subject', required: true }],
      [
        {
          type: 'textarea',
          label: 'Message',
          name: 'message',
          required: true,
          rows: 5,
        },
      ],
    ],
  },
  {
    id: 'partnerships',
    label: 'Partnerships',
    heading: 'Want to build together?',
    description:
      "Let's explore how Shoal AI can integrate with your platform or agency.",
    submitLabel: 'Submit Proposal',
    fieldRows: [
      [
        { type: 'input', label: 'Full Name', name: 'fullName', required: true },
        { type: 'input', label: 'Email', name: 'email', inputType: 'email', required: true },
      ],
      [
        {
          type: 'input',
          label: 'Company Name',
          name: 'companyName',
          required: true,
        },
      ],
      [
        {
          type: 'select',
          label: 'Partnership Type',
          name: 'partnershipType',
          options: ['Integration', 'Agency Partner', 'Reseller', 'Other'],
        },
      ],
      [
        {
          type: 'textarea',
          label: 'Proposal / Notes',
          name: 'proposal',
          placeholder: 'Tell us what you have in mind...',
          required: true,
          rows: 5,
        },
      ],
    ],
  },
  {
    id: 'credits',
    label: 'Startup Credits',
    heading: 'Need startup credits?',
    description:
      'Apply for Shoal AI compute credits to power your early-stage decisions.',
    submitLabel: 'Apply for Credits',
    fieldRows: [
      [
        { type: 'input', label: 'Full Name', name: 'fullName', required: true },
        { type: 'input', label: 'Email', name: 'email', inputType: 'email', required: true },
      ],
      [
        {
          type: 'input',
          label: 'Startup Name',
          name: 'startupName',
          required: true,
        },
      ],
      [
        {
          type: 'input',
          label: 'Website / URL',
          name: 'website',
          inputType: 'url',
          required: true,
        },
      ],
      [
        {
          type: 'select',
          label: 'Funding Stage',
          name: 'fundingStage',
          options: ['Bootstrapped', 'Pre-Seed', 'Seed', 'Series A+'],
        },
      ],
      [
        {
          type: 'textarea',
          label: 'How will you use Shoal AI?',
          name: 'useCase',
          required: true,
          rows: 5,
        },
      ],
    ],
  },
  {
    id: 'investors',
    label: 'Investors',
    heading: 'Want to invest?',
    description:
      "Express interest in Shoal AI's next round, request our data room, or schedule diligence.",
    submitLabel: 'Request a call',
    fieldRows: [
      [
        { type: 'input', label: 'Full Name', name: 'fullName', required: true },
        { type: 'input', label: 'Email', name: 'email', inputType: 'email', required: true },
      ],
      [{ type: 'input', label: 'Fund / Firm', name: 'fundFirm', required: true }],
      [{ type: 'input', label: 'Firm Name (For Our Records)', name: 'firmName' }],
      [
        {
          type: 'select',
          label: 'Investor Type',
          name: 'investorType',
          options: [
            'Institutional VC',
            'Angel/Syndicate',
            'Corporate/Strategic',
            'Family Office',
          ],
        },
        {
          type: 'select',
          label: 'Typical Check Size',
          name: 'checkSize',
          options: ['< $250k', '$250k - $1M', '$1M - $5M', '$5M+'],
        },
      ],
      [
        {
          type: 'input',
          label: 'Notable Investments',
          name: 'notableInvestments',
          placeholder: "A few names we'd recognize",
        },
      ],
      [
        {
          type: 'textarea',
          label: 'Notes',
          name: 'notes',
          placeholder: 'Thesis fit, timing, data-room request...',
          rows: 5,
        },
      ],
    ],
  },
];

const inputClass =
  'w-full bg-white px-4 py-3 border border-gray-200/60 rounded-lg text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors shadow-sm';

const labelClass =
  'block font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-700 mb-2';

function FieldLabel({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <label className={labelClass}>
      {label} {required && <span className="text-axiom">*</span>}
    </label>
  );
}

function ContactField({ field }: { field: FieldConfig }) {
  if (field.type === 'input') {
    return (
      <div>
        <FieldLabel label={field.label} required={field.required} />
        <input
          type={field.inputType ?? 'text'}
          name={field.name}
          placeholder={field.placeholder}
          required={field.required}
          className={inputClass}
        />
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div>
        <FieldLabel label={field.label} required={field.required} />
        <select
          name={field.name}
          required={field.required}
          defaultValue=""
          className={`${inputClass} appearance-none`}
        >
          <option value="" disabled>
            Select...
          </option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <FieldLabel label={field.label} required={field.required} />
      <textarea
        name={field.name}
        rows={field.rows ?? 5}
        placeholder={field.placeholder}
        required={field.required}
        className={`${inputClass} resize-none`}
      />
    </div>
  );
}

function ContactForm({ tab }: { tab: ContactTabConfig }) {
  return (
    <motion.form
      key={tab.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: easeOutExpo }}
      className="space-y-5"
      onSubmit={(e) => e.preventDefault()}
    >
      {tab.fieldRows.map((row, rowIndex) => (
        <div
          key={`${tab.id}-row-${rowIndex}`}
          className={
            row.length > 1
              ? 'grid grid-cols-1 sm:grid-cols-2 gap-5'
              : undefined
          }
        >
          {row.map((field) => (
            <ContactField key={`${tab.id}-${field.name}`} field={field} />
          ))}
        </div>
      ))}

      <div className="pt-4">
        <Button variant="primary" type="submit" fullWidth className="!py-3.5 text-base">
          {tab.submitLabel}
        </Button>
      </div>
    </motion.form>
  );
}

export function Contact() {
  const [activeTab, setActiveTab] = useState<TabId>('investors');
  const active = contactTabs.find((t) => t.id === activeTab) ?? contactTabs[0];

  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-12 text-center">
        <Kicker className="mb-8">Contact</Kicker>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black tracking-tighter mb-8 leading-[1.05]">
          Partner with Shoal AI.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Whether you&apos;re shipping a startup, building a partnership, or
          looking to back the post-search internet — start with the right form.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-24 mt-12 md:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          <div className="md:col-span-5">
            <div className="space-y-1 mb-12">
              {contactTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between py-3 text-left text-xl font-bold tracking-tight transition-colors ${
                      isActive
                        ? 'text-axiom'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isActive && (
                      <ArrowRightIcon
                        size={20}
                        className="text-axiom shrink-0"
                        aria-hidden
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: easeOutExpo }}
                className="pt-8 border-t border-gray-200/60"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight mb-4 leading-tight">
                  {active.heading}
                </h2>
                <p className="text-gray-600 leading-relaxed">{active.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="md:col-span-7 min-w-0">
            <AnimatePresence mode="wait">
              <ContactForm tab={active} />
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
