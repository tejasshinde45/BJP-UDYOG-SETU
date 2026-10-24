import { useContext } from 'react';
import { DemoDataContext } from '../context/demoDataContextDef';
import type { DemoDataContextType } from '../context/demoDataContextDef';

export const useDemoData = (): DemoDataContextType => {
  const context = useContext(DemoDataContext);
  if (!context) {
    throw new Error('useDemoData must be used within a DemoDataProvider');
  }
  return context;
};
