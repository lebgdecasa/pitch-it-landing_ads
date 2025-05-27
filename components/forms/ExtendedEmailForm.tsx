import React from 'react';

const ExtendedEmailForm = () => {
  return (
    <form className="flex flex-col items-center" onSubmit={(e) => e.preventDefault()}>
      <input 
        type="email" 
        placeholder="Enter your email" 
        className="border p-2 rounded w-full max-w-md mb-2" 
      />
      <input 
        type="text" 
        placeholder="Company Stage (e.g., Idea, Pre-seed, Seed)" 
        className="border p-2 rounded w-full max-w-md mb-2" 
      />
      <button 
        type="submit" 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Get Demo Access
      </button>
    </form>
  );
};

export default ExtendedEmailForm;
