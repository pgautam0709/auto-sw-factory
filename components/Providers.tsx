'use client';

import { FactoryProvider } from '@/context/FactoryContext';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return <FactoryProvider>{children}</FactoryProvider>;
}
