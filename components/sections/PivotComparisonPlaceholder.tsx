import React from 'react';

const PivotComparisonPlaceholder = () => {
  return (
    <section className="py-10 bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-6">The Pivot: Before vs. After</h2>
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 text-center">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3 text-red-500">Before Validation</h3>
          <p className="mb-2"><strong>Time Spent:</strong> 6 months</p>
          <p className="mb-2"><strong>Money Spent:</strong> $50,000</p>
          <p className="mb-2"><strong>Product:</strong> Complex platform with many features.</p>
          <p className="mb-2"><strong>Result:</strong> Low user adoption, wrong target market.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3 text-green-500">After Validation</h3>
          <p className="mb-2"><strong>Time Spent:</strong> 1 month (to validate & iterate)</p>
          <p className="mb-2"><strong>Money Spent:</strong> $5,000 (for validation)</p>
          <p className="mb-2"><strong>Product:</strong> Focused MVP solving a specific problem.</p>
          <p className="mb-2"><strong>Result:</strong> Clear market demand, paying customers.</p>
        </div>
      </div>
    </section>
  );
};

export default PivotComparisonPlaceholder;
