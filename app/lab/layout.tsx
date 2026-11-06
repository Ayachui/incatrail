import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Inca Trail Lab OS | Formulation Suite',
  description: 'Internal formulation and biochemical engineering suite for Inca Trail Foods.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
};

export default function LabLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
