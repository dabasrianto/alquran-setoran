import React from 'react';
import { PricingSection } from "./pricing-section"

const HeroSection = () => {
  return (
    <section className="bg-gray-100 py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Our Amazing Product
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Discover the power of our innovative solutions.
        </p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Get Started
        </button>

        {/* Add this after the existing hero content */}
        <PricingSection />
      </div>
    </section>
  );
};

export default HeroSection;
