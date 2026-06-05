import React from 'react';
import { getAllCompanies } from '@/services/company.service';
import { OfferEvaluationClient } from './OfferEvaluationClient';

export default async function OfferEvaluationPage() {
  const companiesList = await getAllCompanies();
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      <OfferEvaluationClient companiesList={companiesList} />
    </div>
  );
}
