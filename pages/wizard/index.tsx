'use client';

import React from 'react';
import { ProjectWizard } from '@/components/wizard/main_components/ProjectWizard';
import Head from 'next/dist/shared/lib/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';

export default function NewProjectPage() {
  const { t } = useTranslation('common');
  return (
    <><Head>
      <title>{t('project_wizard_title')}</title>
      <meta name="description" content={t('project_wizard_description')} />
    </Head><div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">{t('create_new_project_title')}</h1>
          <p className="text-gray-600 mt-2">
            {t('create_new_project_description')}
          </p>
        </div>
        <ProjectWizard />
      </div></>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  });
