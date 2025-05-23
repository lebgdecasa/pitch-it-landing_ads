import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  onOpenDemoModal: () => void;
}

const Layout = ({ children, onOpenDemoModal }: LayoutProps) => {
  return (
    <>
      <Header onOpenDemoModal={onOpenDemoModal} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
