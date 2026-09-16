import React from 'react';
import { Scissors } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Scissors className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">BG Studio</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#how-it-works" className="text-gray-500 hover:text-gray-900 font-medium">How It Works</a>
            <a href="#features" className="text-gray-500 hover:text-gray-900 font-medium">Features</a>
            <a href="#faq" className="text-gray-500 hover:text-gray-900 font-medium">FAQ</a>
          </div>
          <div>
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-full font-medium transition-colors">
              Try Free
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
