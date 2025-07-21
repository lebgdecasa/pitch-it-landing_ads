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
    label: 'nav_overview',
    href: '/project/:id',
    requiresPlan: 'free',
    isImplemented: true,
    description: 'nav_overview_desc'
  },
  {
    icon: MessageCircle,
    label: 'nav_personas_chat',
    href: '/project/:id/chat',
    requiresPlan: 'free',
    isImplemented: true,
    description: 'nav_personas_chat_desc'
  },
  {
    icon: Presentation,
    label: 'nav_pitch_deck',
    href: '/project/:id/deck',
    requiresPlan: 'premium',
    isImplemented: false,
    description: 'nav_pitch_deck_desc'
  },
  {
    icon: FileText,
    label: 'nav_reports',
    href: '/project/:id/reports',
    requiresPlan: 'premium',
    isImplemented: false,
    description: 'nav_reports_desc'
  },
  {
    icon: BarChart2,
    label: 'nav_market_pulse',
    href: '/project/:id/pulse',
    requiresPlan: 'premium',
    isImplemented: false,
    description: 'nav_market_pulse_desc'
  },
  {
    icon: Video,
    label: 'nav_virtual_vc',
    href: '/project/:id/virtual-vc',
    requiresPlan: 'enterprise',
    isImplemented: false,
    description: 'nav_virtual_vc_desc'
  },
  {
    icon: Users,
    label: 'nav_team_collab',
    href: '/project/:id/settings',
    requiresPlan: 'free',
    isImplemented: false,
    description: 'nav_team_collab_desc'
  }
];

export const backNavItem: NavItem = {
  icon: ArrowLeft,
  label: 'nav_back_to_projects',
  href: '/dashboard',
  description: 'Return to project selection'
};
