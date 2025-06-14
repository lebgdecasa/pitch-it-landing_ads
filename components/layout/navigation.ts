// components/layout/navigation.ts
import {
  Home,
  MessageCircle,
  FileText,
  Lightbulb,
  BarChart2,
  Video,
  Settings,
  ArrowLeft,
  Presentation,
  Users
} from 'lucide-react';

export interface NavItem {
  icon: any;
  label: string;
  href: string;
  requiresPlan?: 'free' | 'premium' | 'enterprise';
  isImplemented?: boolean;
  description?: string;
}

export const mainNavItems: NavItem[] = [
  {
    icon: Home,
    label: 'Overview',
    href: '/project/:id',
    requiresPlan: 'free',
    isImplemented: true,
    description: 'Project overview and analytics'
  },
  {
    icon: MessageCircle,
    label: 'Personas Chat',
    href: '/project/:id/chat',
    requiresPlan: 'free',
    isImplemented: true,
    description: 'Chat with AI personas'
  },
  {
    icon: Presentation,
    label: 'Pitch Deck',
    href: '/project/:id/deck',
    requiresPlan: 'premium',
    isImplemented: false,
    description: 'AI-powered pitch deck builder'
  },
  {
    icon: FileText,
    label: 'Documents',
    href: '/project/:id/documents',
    requiresPlan: 'premium',
    isImplemented: false,
    description: 'Store and analyze business documents'
  },
  {
    icon: Lightbulb,
    label: 'Insights',
    href: '/project/:id/insights',
    requiresPlan: 'premium',
    isImplemented: false,
    description: 'AI-generated business insights'
  },
  {
    icon: BarChart2,
    label: 'Analytics',
    href: '/project/:id/analytics',
    requiresPlan: 'premium',
    isImplemented: false,
    description: 'Project performance analytics'
  },
  {
    icon: Video,
    label: 'Virtual VC',
    href: '/project/:id/virtual-vc',
    requiresPlan: 'enterprise',
    isImplemented: false,
    description: 'Practice pitching with AI VCs'
  },
  {
    icon: Users,
    label: 'Team Collaboration',
    href: '/project/:id/team',
    requiresPlan: 'enterprise',
    isImplemented: false,
    description: 'Collaborate with your team'
  }
];

export const backNavItem = {
  icon: ArrowLeft,
  label: '← Back to Dashboard',
  href: '/dashboard'
};
