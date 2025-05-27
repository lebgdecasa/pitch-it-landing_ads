import React from 'react';

const EmailForm = () => {
  return (
    <form className="flex flex-col items-center" onSubmit={(e) => e.preventDefault()}>
      <input 
        type="email" 
        placeholder="Enter your email" 
        className="border p-2 rounded w-full max-w-md mb-2" 
      />
      <button 
        type="submit" 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit
      </button>
    </form>
  );
};

export default EmailForm;
