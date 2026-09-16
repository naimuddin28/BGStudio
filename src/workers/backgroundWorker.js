import { env, pipeline, RawImage } from '@huggingface/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true;

class PipelineSingleton {
  static task = 'image-segmentation';
  // Use modnet which is perfectly supported by transformers.js for background removal
  static model = 'Xenova/modnet';
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      // Use WASM for maximum compatibility across browsers/devices
      this.instance = await pipeline(this.task, this.model, {
        progress_callback,
        device: 'wasm',
      });
    }
    return this.instance;
  }
}

self.addEventListener('message', async (event) => {
  const { type, payload, fileType } = event.data;

  if (type === 'process') {
    try {
      self.postMessage({ status: 'init', text: 'Loading AI model...' });
      
      const segmenter = await PipelineSingleton.getInstance((progress) => {
        if (progress.status === 'progress') {
          self.postMessage({ status: 'progress', text: `Loading model: ${Math.round(progress.progress || 0)}%` });
        } else {
          self.postMessage({ status: 'progress', text: `Loading: ${progress.file || ''}` });
        }
      });

      self.postMessage({ status: 'progress', text: 'Analyzing image...' });

      const blob = new Blob([payload], { type: fileType });
      const imgUrl = URL.createObjectURL(blob);
      
      const image = await RawImage.fromURL(imgUrl);
      
      self.postMessage({ status: 'progress', text: 'Removing background...' });
      
      const result = await segmenter(image);
      
      self.postMessage({ status: 'progress', text: 'Creating transparent image...' });

      const mask = Array.isArray(result) ? result[0].mask : result.mask;
      
      const canvas = new OffscreenCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');
      
      const maskCanvas = new OffscreenCanvas(mask.width, mask.height);
      const maskCtx = maskCanvas.getContext('2d');
      
      // Convert 1-channel mask to 4-channel RGBA for ImageData
      const rgbaData = new Uint8ClampedArray(mask.width * mask.height * 4);
      for (let i = 0; i < mask.data.length; i++) {
        const val = mask.data[i];
        rgbaData[i * 4] = val;     // R
        rgbaData[i * 4 + 1] = val; // G
        rgbaData[i * 4 + 2] = val; // B
        rgbaData[i * 4 + 3] = val; // A (This is the important one for masking)
      }
      
      const maskImageData = new ImageData(rgbaData, mask.width, mask.height);
      maskCtx.putImageData(maskImageData, 0, 0);
      
      const imgBitmap = await createImageBitmap(blob);
      ctx.drawImage(imgBitmap, 0, 0, image.width, image.height);
      
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(maskCanvas, 0, 0, image.width, image.height);
      
      const outBlob = await canvas.convertToBlob({ type: 'image/png' });
      const outUrl = URL.createObjectURL(outBlob);
      
      self.postMessage({ status: 'complete', result: outUrl });
      
      URL.revokeObjectURL(imgUrl);
    } catch (err) {
      console.error("Worker error:", err);
      self.postMessage({ status: 'error', error: err.message, stack: err.stack });
    }
  }
});
