import { pipeline } from '@huggingface/transformers';

async function test() {
  try {
    const pipe = await pipeline('image-segmentation', 'briaai/RMBG-1.4');
    console.log("RMBG-1.4 loaded!");
  } catch (e) {
    console.error("RMBG-1.4 failed:", e.message);
  }

  try {
    const pipe = await pipeline('image-segmentation', 'Xenova/modnet');
    console.log("Xenova/modnet loaded!");
  } catch (e) {
    console.error("Xenova/modnet failed:", e.message);
  }
}

test();
