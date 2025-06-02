import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ReactNode } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';


interface LayoutProps {
  children: ReactNode;
  onOpenDemoModal: () => void;
}

const Layout = ({ children, onOpenDemoModal }: LayoutProps) => {
  return (
    <>
      <Header onOpenDemoModal={onOpenDemoModal} />
      <main>{children}</main>
      <SpeedInsights />
      <Analytics />
      <Footer />
    </>
  );
};

export default Layout;
