import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ReactNode } from 'react';
import { Analytics } from "@vercel/analytics/react";

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
      <Analytics />
    </>
  );
};

export default Layout;
