'use client';

import React from 'react';
import { ProjectWizard } from '@/components/wizard/main_components/ProjectWizard';

export default function NewProjectPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="text-gray-600 mt-2">
          Follow the steps below to set up your new project
        </p>
      </div>
      <ProjectWizard />
    </div>
  );
}
