import React from 'react';
import Footer from '@/components/layout/Footer';
import { ReactNode } from 'react';

interface LayoutNoNavProps {
  children: ReactNode;
}

const LayoutNoNav = ({ children }: LayoutNoNavProps) => {
  return (
    <>
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default LayoutNoNav;
