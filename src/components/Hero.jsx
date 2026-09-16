import React from 'react';

export default function Hero() {
  return (
    <div className="pt-20 pb-12 text-center px-4 max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
        Remove Background. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Create Anything.</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        AI-powered background removal that runs directly in your browser. 
        No API. No signup. Your image stays on your device during processing.
      </p>
    </div>
  );
}
