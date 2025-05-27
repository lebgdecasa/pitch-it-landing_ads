import React from 'react';

const ChecklistPlaceholder = () => {
  return (
    <section className="py-10 text-center">
      <div className="p-10 bg-gray-50 rounded-lg shadow-md max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-700">[Risk Prevention Checklist Placeholder]</h2>
        <p className="mt-2 text-gray-600">e.g., Downloadable PDF: "Top 10 Due Diligence Blindspots"</p>
        <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Download Checklist
        </button>
      </div>
    </section>
  );
};

export default ChecklistPlaceholder;
