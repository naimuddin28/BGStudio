import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UploadBox from './components/UploadBox';
import Editor from './components/Editor';
import Features from './components/Features';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState('');

  const [worker, setWorker] = useState(null);

  useEffect(() => {
    // Initialize Web Worker for AI processing
    const newWorker = new Worker(new URL('./workers/backgroundWorker.js', import.meta.url), {
      type: 'module'
    });

    newWorker.onmessage = (e) => {
      const { status, result, text } = e.data;
      if (status === 'ready') {
        console.log('Worker is ready');
      } else if (status === 'init' || status === 'progress') {
        setProgressText(text || 'Loading AI model...');
      } else if (status === 'complete') {
        setProcessedImageUrl(result);
        setIsProcessing(false);
      } else if (status === 'error') {
        const errorMsg = e.data.error || 'Unknown error occurred.';
        console.error("Pipeline error:", e.data);
        alert(`Error processing image: ${errorMsg}`);
        setIsProcessing(false);
        setImageFile(null); // Reset on error
      }
    };

    setWorker(newWorker);

    return () => newWorker.terminate();
  }, []);

  const handleImageUpload = (file) => {
    setImageFile(file);
    setIsProcessing(true);
    setProgressText('Preparing image...');
    
    // Read file as ArrayBuffer and send to worker
    const reader = new FileReader();
    reader.onload = (e) => {
      if (worker) {
        worker.postMessage({ type: 'process', payload: e.target.result, fileType: file.type });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleStartOver = () => {
    setImageFile(null);
    setProcessedImageUrl(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Navbar />
      
      <main className="flex-grow">
        {!imageFile ? (
          <>
            <Hero />
            <div className="max-w-4xl mx-auto px-4 py-8 mb-16">
              <UploadBox onUpload={handleImageUpload} />
            </div>
            <Features />
            <FAQ />
          </>
        ) : (
          <div className="max-w-6xl mx-auto px-4 py-8">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                <h2 className="text-xl font-semibold mb-2">{progressText}</h2>
                <p className="text-gray-500 max-w-md text-center">Your image is being processed securely in your browser. No data is sent to the cloud.</p>
              </div>
            ) : processedImageUrl ? (
              <Editor 
                originalImage={URL.createObjectURL(imageFile)} 
                processedImage={processedImageUrl} 
                onStartOver={handleStartOver} 
              />
            ) : null}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
