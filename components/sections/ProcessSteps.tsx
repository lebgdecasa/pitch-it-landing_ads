import React from 'react';

const ProcessSteps = () => {
  return (
    <section className="py-10">
      <h2 className="text-2xl font-bold text-center mb-6">Our Simple 3-Step Process</h2>
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Step 1</h3>
          <p>Submit your idea and target audience.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Step 2</h3>
          <p>We find real users and gather feedback.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Step 3</h3>
          <p>Receive actionable insights in 48 hours.</p>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
