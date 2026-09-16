import { env, pipeline, RawImage } from '@huggingface/transformers';

// Configure transformers to use local/browser env
env.allowLocalModels = false;
env.useBrowserCache = true;

class PipelineSingleton {
  static task = 'image-segmentation';
  static model = 'briaai/RMBG-1.4';
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model, {
        progress_callback,
        device: 'webgpu', // Prefer webgpu if available, otherwise it falls back to wasm
      }).catch(async (e) => {
        // Fallback to wasm if webgpu fails
        return await pipeline(this.task, this.model, {
          progress_callback,
          device: 'wasm',
        });
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
        self.postMessage({ status: 'progress', text: `Loading model: ${Math.round(progress.progress || 0)}%` });
      });

      self.postMessage({ status: 'progress', text: 'Analyzing image...' });

      // Convert ArrayBuffer to Blob then to ImageBitmap to get pixels
      const blob = new Blob([payload], { type: fileType });
      const imgUrl = URL.createObjectURL(blob);
      
      const image = await RawImage.fromURL(imgUrl);
      
      self.postMessage({ status: 'progress', text: 'Removing background...' });
      
      const result = await segmenter(image);
      
      self.postMessage({ status: 'progress', text: 'Creating transparent image...' });

      // Transformers.js image-segmentation pipeline returns an array of objects
      // For RMBG-1.4, it returns an array of size 1 with { label, mask } or simply { label: 'background', mask: RawImage }
      // The mask is a grayscale image. We need to apply this mask to the original image.
      
      const mask = Array.isArray(result) ? result[0].mask : result.mask;
      
      // Apply mask to original image
      // Both image and mask should be the same size if we resize them or they are returned same size
      const canvas = new OffscreenCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');
      
      // We will draw the image and mask pixel by pixel or use globalCompositeOperation
      // But we have RawImage data.
      
      const maskCanvas = new OffscreenCanvas(mask.width, mask.height);
      const maskCtx = maskCanvas.getContext('2d');
      const maskImageData = new ImageData(
        new Uint8ClampedArray(mask.data),
        mask.width,
        mask.height
      );
      maskCtx.putImageData(maskImageData, 0, 0);
      
      // Draw original image to main canvas
      const imgBitmap = await createImageBitmap(blob);
      ctx.drawImage(imgBitmap, 0, 0, image.width, image.height);
      
      // Apply mask
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(maskCanvas, 0, 0, image.width, image.height);
      
      // Get result as blob URL
      const outBlob = await canvas.convertToBlob({ type: 'image/png' });
      const outUrl = URL.createObjectURL(outBlob);
      
      self.postMessage({ status: 'complete', result: outUrl });
      
      URL.revokeObjectURL(imgUrl);
    } catch (err) {
      console.error(err);
      self.postMessage({ status: 'error', error: err.message });
    }
  }
});
