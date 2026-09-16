import React, { useState, useRef, useEffect } from 'react';
import { Download, RefreshCw, ZoomIn, ZoomOut, Move, Image as ImageIcon, RotateCw } from 'lucide-react';

export default function Editor({ originalImage, processedImage, onStartOver }) {
  const canvasRef = useRef(null);
  const [bgMode, setBgMode] = useState('transparent'); // 'transparent', 'color', 'image'
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgImage, setBgImage] = useState(null);
  const [bgImageObj, setBgImageObj] = useState(null);
  
  const [fgImageObj, setFgImageObj] = useState(null);
  const [fgTransform, setFgTransform] = useState({ x: 0, y: 0, scale: 1, rotation: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const PRESET_COLORS = ['#FFFFFF', '#000000', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#6B7280'];

  // Load foreground image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setFgImageObj(img);
      // Auto-center and fit to canvas roughly
      // Actually we will handle initial scale in draw function
      setFgTransform({ x: 0, y: 0, scale: 1, rotation: 0 });
    };
    img.src = processedImage;
  }, [processedImage]);

  // Load background image
  useEffect(() => {
    if (bgImage) {
      const img = new Image();
      img.onload = () => setBgImageObj(img);
      img.src = bgImage;
    } else {
      setBgImageObj(null);
    }
  }, [bgImage]);

  // Drawing function
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !fgImageObj) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw Background
    if (bgMode === 'color') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
    } else if (bgMode === 'image' && bgImageObj) {
      // Cover logic
      const scale = Math.max(width / bgImageObj.width, height / bgImageObj.height);
      const x = (width / 2) - (bgImageObj.width / 2) * scale;
      const y = (height / 2) - (bgImageObj.height / 2) * scale;
      ctx.drawImage(bgImageObj, x, y, bgImageObj.width * scale, bgImageObj.height * scale);
    }

    // Draw Foreground
    ctx.save();
    
    // Default fit scale
    const fitScale = Math.min(width / fgImageObj.width, height / fgImageObj.height) * 0.9;
    
    ctx.translate(width / 2 + fgTransform.x, height / 2 + fgTransform.y);
    ctx.rotate(fgTransform.rotation * Math.PI / 180);
    ctx.scale(fitScale * fgTransform.scale, fitScale * fgTransform.scale);
    
    ctx.drawImage(fgImageObj, -fgImageObj.width / 2, -fgImageObj.height / 2);
    ctx.restore();
    
  }, [fgImageObj, bgMode, bgColor, bgImageObj, fgTransform]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - fgTransform.x, y: e.clientY - fgTransform.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setFgTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleBgImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBgImage(URL.createObjectURL(file));
      setBgMode('image');
    }
  };

  const handleReset = () => {
    setFgTransform({ x: 0, y: 0, scale: 1, rotation: 0 });
    setBgMode('transparent');
  };

  const downloadImage = (format) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let exportCanvas = canvas;

    // For JPG with transparent background, we need to add white background
    if (format === 'image/jpeg' && bgMode === 'transparent') {
      exportCanvas = document.createElement('canvas');
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      const ctx = exportCanvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      ctx.drawImage(canvas, 0, 0);
    }

    const dataUrl = exportCanvas.toDataURL(format, 0.95);
    const link = document.createElement('a');
    link.download = `bg-studio-result.${format === 'image/jpeg' ? 'jpg' : 'png'}`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 flex flex-col md:flex-row">
      {/* Canvas Area */}
      <div className="flex-1 bg-gray-50 p-6 flex flex-col relative min-h-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Editor</h2>
          <button onClick={onStartOver} className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center">
            <RefreshCw className="w-4 h-4 mr-1" /> Start Over
          </button>
        </div>
        
        <div className="flex-1 relative rounded-xl overflow-hidden border border-gray-200 bg-checkerboard flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="max-w-full max-h-full cursor-move shadow-sm bg-transparent"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={(e) => handleMouseDown({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY })}
            onTouchMove={(e) => handleMouseMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY })}
            onTouchEnd={handleMouseUp}
          />
        </div>
      </div>

      {/* Controls Area */}
      <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-gray-100 bg-white p-6 overflow-y-auto">
        
        {/* Background Settings */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Background</h3>
          <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
            <button 
              className={`flex-1 text-xs font-medium py-2 rounded-md ${bgMode === 'transparent' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              onClick={() => setBgMode('transparent')}
            >
              Transparent
            </button>
            <button 
              className={`flex-1 text-xs font-medium py-2 rounded-md ${bgMode === 'color' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              onClick={() => setBgMode('color')}
            >
              Color
            </button>
            <button 
              className={`flex-1 text-xs font-medium py-2 rounded-md ${bgMode === 'image' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              onClick={() => setBgMode('image')}
            >
              Image
            </button>
          </div>

          {bgMode === 'color' && (
            <div className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    className={`w-8 h-8 rounded-full border-2 ${bgColor === c ? 'border-blue-500' : 'border-gray-200'}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setBgColor(c)}
                  />
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="color" 
                  value={bgColor} 
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded border-0 p-0 cursor-pointer"
                />
                <input 
                  type="text" 
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="border border-gray-200 rounded-md px-2 py-1 text-sm font-mono flex-1"
                />
              </div>
            </div>
          )}

          {bgMode === 'image' && (
            <div>
              <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center">
                  <ImageIcon className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Upload Background</span>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleBgImageUpload} />
              </label>
            </div>
          )}
        </div>

        {/* Foreground Settings */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Foreground</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Scale</span>
                <span>{Math.round(fgTransform.scale * 100)}%</span>
              </div>
              <input 
                type="range" min="0.1" max="3" step="0.1" 
                value={fgTransform.scale} 
                onChange={(e) => setFgTransform({...fgTransform, scale: parseFloat(e.target.value)})}
                className="w-full accent-blue-600"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Rotation</span>
                <span>{fgTransform.rotation}°</span>
              </div>
              <input 
                type="range" min="-180" max="180" step="1" 
                value={fgTransform.rotation} 
                onChange={(e) => setFgTransform({...fgTransform, rotation: parseInt(e.target.value)})}
                className="w-full accent-blue-600"
              />
            </div>
            <button onClick={handleReset} className="w-full py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium">
              Reset Position
            </button>
          </div>
        </div>

        {/* Download */}
        <div className="pt-6 border-t border-gray-100 mt-auto">
          <button 
            onClick={() => downloadImage('image/png')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center mb-3 transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Download PNG
          </button>
          <button 
            onClick={() => downloadImage('image/jpeg')}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-medium py-3 px-4 rounded-xl flex items-center justify-center transition-colors"
          >
            Download JPG
          </button>
        </div>
      </div>
    </div>
  );
}
