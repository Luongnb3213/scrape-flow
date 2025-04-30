import Logo from '@/components/Logo';
import { ModeToggle } from '@/components/ThemeModeToggle';
import { Separator } from '@/components/ui/separator';
import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col w-full  h-screen">
      {children}

      <Separator style={{ backgroundColor: '#e5e5e5' }} />
      <footer className="flex items-center justify-between p-2">
        <Logo iconSize={16} fontSize="text-xl" />
        <ModeToggle />
      </footer>
    </div>
  );
};

export default layout;
