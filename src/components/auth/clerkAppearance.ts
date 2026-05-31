import type { Appearance } from '@clerk/types';

export const clerkAuthAppearance: Appearance = {
  elements: {
    rootBox: 'w-full',
    card: 'shadow-none border-0 rounded-xl bg-transparent',
    headerTitle: 'hidden',
    headerSubtitle: 'hidden',
    socialButtonsBlockButton:
      'border border-gray-200 rounded-xl text-sm font-medium',
    formButtonPrimary:
      'bg-gray-900 hover:bg-black text-sm font-semibold rounded-xl',
    footerActionLink: 'text-orange-600 hover:text-orange-700 font-semibold',
    formFieldInput: 'rounded-xl border-gray-200',
  },
};
