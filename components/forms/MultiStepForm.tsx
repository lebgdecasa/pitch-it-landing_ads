import React, { useState } from 'react';

const MultiStepForm = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="p-4 border rounded-lg max-w-md mx-auto">
      <h4 className="text-lg font-semibold mb-3 text-center">Step {step} of 2</h4>
      {step === 1 && (
        <div>
          <label htmlFor="idea" className="block mb-1">What's your idea?</label>
          <textarea id="idea" className="border p-2 rounded w-full mb-3" placeholder="Describe your startup idea briefly"></textarea>
          <button 
            onClick={() => setStep(2)} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Next
          </button>
        </div>
      )}
      {step === 2 && (
        <div>
          <label htmlFor="email-multistep" className="block mb-1">What's your email?</label>
          <input type="email" id="email-multistep" className="border p-2 rounded w-full mb-3" placeholder="Enter your email" />
          <div className="flex justify-between">
            <button 
              onClick={() => setStep(1)} 
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Back
            </button>
            <button 
              type="submit" 
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onSubmit={(e) => e.preventDefault()}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiStepForm;
