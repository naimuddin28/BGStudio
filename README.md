# BG Studio

BG Studio is a free, API-free AI background remover that runs entirely in your browser.

## Features

- **Local AI Background Removal:** Uses an open-source AI segmentation model in the browser via WebAssembly/WebGPU. No data leaves your device.
- **Background Editor:** Add a transparent, solid color, or custom image background.
- **Foreground Controls:** Scale, rotate, and position the foreground subject.
- **High Quality Export:** Download the result as a PNG or JPG.

## Tech Stack

- React
- Vite
- Tailwind CSS
- [Transformers.js](https://huggingface.co/docs/transformers.js) by Hugging Face (ONNX Runtime Web)

## AI Model Used

This project uses the **ModNet** model (`Xenova/modnet`), which is a state-of-the-art, highly efficient background removal model.
Through Hugging Face's `transformers.js`, the model is loaded and run directly in your browser.

**Model License:** Available under open-source non-commercial use terms. Check the official model page for detailed licensing.

## How Browser Inference Works

When you upload an image, a Web Worker is spawned. The worker downloads the `Xenova/modnet` ONNX model from the Hugging Face Hub (cached after the first download) and processes the image using ONNX Runtime Web. The model outputs an alpha mask which is then applied to the original image to create a transparent foreground. This happens without any server backend.

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Build & Deployment

```bash
# Build for production
npm run build
```

The output in `dist/` can be deployed to Vercel, Netlify, or GitHub Pages as a static site. The AI inference requires no backend server.

## Privacy Behavior

Since the application runs the model inference entirely locally in your browser, no user image is ever uploaded to a server or third-party API. All processing happens on your device.
