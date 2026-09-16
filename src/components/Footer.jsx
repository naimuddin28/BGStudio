import React from 'react';
import { Scissors } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Scissors className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-lg text-gray-900">BG Studio</span>
          </div>
          <p className="text-gray-500 text-sm">
            Built with React, Vite, and Hugging Face Transformers.js
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-gray-900">Privacy</a>
            <a href="#" className="hover:text-gray-900">Terms</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-gray-900">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
