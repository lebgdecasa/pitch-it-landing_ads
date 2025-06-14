// pages/project/[id]/coming-soon.tsx
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Lock, ArrowLeft, Sparkles, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/supa_database/components/AuthProvider';
import ProjectLayout from '@/components/layout/ProjectLayout';

const ComingSoonPage = () => {
  const router = useRouter();
  const { profile } = useAuthContext();
  const { id: projectId, feature } = router.query;

  const userPlan = profile?.subscription_tier || 'free';

  // Feature information
  const featureInfo: Record<string, {
    name: string;
    description: string;
    icon: any;
    requiredPlan: string;
    benefits: string[];
  }> = {
    'deck': {
      name: 'Pitch Deck Builder',
      description: 'AI-powered pitch deck creation with professional templates',
      icon: Sparkles,
      requiredPlan: 'premium',
      benefits: [
        'AI-generated slides based on your project',
        'Professional templates and designs',
        'Real-time collaboration',
        'Export to PDF and PowerPoint'
      ]
    },
    'documents': {
      name: 'Document Hub',
      description: 'Centralized document storage and AI analysis',
      icon: Zap,
      requiredPlan: 'premium',
      benefits: [
        'Smart document organization',
        'AI-powered document analysis',
        'Version control and history',
        'Team collaboration features'
      ]
    },
    'insights': {
      name: 'Business Insights',
      description: 'AI-generated insights and recommendations',
      icon: Star,
      requiredPlan: 'premium',
      benefits: [
        'Market trend analysis',
        'Competitive intelligence',
        'Growth recommendations',
        'Risk assessment reports'
      ]
    },
    'analytics': {
      name: 'Advanced Analytics',
      description: 'Deep project performance analytics',
      icon: Star,
      requiredPlan: 'premium',
      benefits: [
        'Performance tracking dashboards',
        'User engagement metrics',
        'Conversion funnel analysis',
        'Custom reporting tools'
      ]
    },
    'virtual-vc': {
      name: 'Virtual VC',
      description: 'Practice pitching with AI venture capitalists',
      icon: Sparkles,
      requiredPlan: 'enterprise',
      benefits: [
        'Realistic VC interview simulations',
        'Personalized feedback and scoring',
        'Industry-specific questioning',
        'Pitch performance analytics'
      ]
    },
    'team': {
      name: 'Team Collaboration',
      description: 'Advanced team collaboration tools',
      icon: Zap,
      requiredPlan: 'enterprise',
      benefits: [
        'Real-time team collaboration',
        'Role-based permissions',
        'Team performance tracking',
        'Communication hub'
      ]
    }
  };

  const currentFeature = featureInfo[feature as string] || featureInfo['deck'];
  const Icon = currentFeature.icon;

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'premium': return 'text-blue-600';
      case 'enterprise': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProjectLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className="mb-8">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/project/${projectId}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Project
              </Link>
            </Button>
          </div>

          {/* Main content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <Icon className="h-10 w-10 text-gray-600" />
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {currentFeature.name}
              </h1>

              <div className="flex items-center justify-center gap-3 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanBadgeColor(currentFeature.requiredPlan)}`}>
                  {currentFeature.requiredPlan.charAt(0).toUpperCase() + currentFeature.requiredPlan.slice(1)} Feature
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                  Coming Soon
                </span>
              </div>

              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {currentFeature.description}
              </p>
            </div>

            {/* Features list */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                What you'll get:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentFeature.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upgrade CTA */}
            <div className="text-center border-t pt-8">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                <Lock className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Unlock {currentFeature.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  Upgrade to {currentFeature.requiredPlan} plan to get early access when this feature launches.
                </p>

                {userPlan === 'free' && (
                  <div className="space-y-3">
                    <Button size="lg" asChild className="w-full sm:w-auto">
                      <Link href="/subscription">
                        Upgrade to {currentFeature.requiredPlan.charAt(0).toUpperCase() + currentFeature.requiredPlan.slice(1)}
                      </Link>
                    </Button>
                    <p className="text-sm text-gray-500">
                      Join our waitlist and get notified when this feature launches
                    </p>
                  </div>
                )}

                {userPlan === 'premium' && currentFeature.requiredPlan === 'enterprise' && (
                  <div className="space-y-3">
                    <Button size="lg" asChild className="w-full sm:w-auto">
                      <Link href="/subscription">
                        Upgrade to Enterprise
                      </Link>
                    </Button>
                    <p className="text-sm text-gray-500">
                      Get early access to all upcoming features
                    </p>
                  </div>
                )}

                {(userPlan === 'premium' && currentFeature.requiredPlan === 'premium') ||
                 (userPlan === 'enterprise') && (
                  <div className="space-y-3">
                    <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                      <Star className="h-4 w-4 mr-2" />
                      You'll get early access when this launches!
                    </div>
                    <p className="text-sm text-gray-600">
                      We'll notify you as soon as {currentFeature.name} is available.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProjectLayout>
  );
};

export default ComingSoonPage;
