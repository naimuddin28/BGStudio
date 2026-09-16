import React from 'react';
import { Layers, Image as ImageIcon, Zap, Shield, Wand2, Download } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "AI Background Removal",
      description: "Runs directly in your browser. No server uploads."
    },
    {
      icon: <Layers className="h-6 w-6 text-blue-500" />,
      title: "Transparent PNG",
      description: "Create clean transparent images instantly."
    },
    {
      icon: <ImageIcon className="h-6 w-6 text-purple-500" />,
      title: "Custom Background",
      description: "Upload your own image or choose a solid color."
    },
    {
      icon: <Wand2 className="h-6 w-6 text-green-500" />,
      title: "Simple Editor",
      description: "Move, scale and rotate your subject easily."
    },
    {
      icon: <Shield className="h-6 w-6 text-red-500" />,
      title: "100% Private",
      description: "Your images never leave your device. Complete privacy."
    },
    {
      icon: <Download className="h-6 w-6 text-indigo-500" />,
      title: "High Quality Export",
      description: "Download in PNG or JPG without losing quality."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional tools for background removal and editing, all working securely in your browser.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
