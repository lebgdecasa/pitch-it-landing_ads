import React from 'react';

interface Testimonial {
  quote: string;
  author: string;
  details: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  return (
    <section className="py-10 bg-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6">What Our Users Say</h2>
      <div className="max-w-4xl mx-auto grid md:grid-cols-1 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-xl italic">"{testimonial.quote}"</p>
            <p className="mt-4 font-semibold">- {testimonial.author}</p>
            <p className="text-sm text-gray-600">{testimonial.details}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
