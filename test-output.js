import { pipeline, RawImage } from '@huggingface/transformers';
import fs from 'fs';

async function test() {
  const pipe = await pipeline('image-segmentation', 'Xenova/modnet');
  // Create a 10x10 blank image just to pass it
  const img = new RawImage(new Uint8Array(10*10*3), 10, 10, 3);
  const res = await pipe(img);
  console.log("Result:", JSON.stringify(res, (k,v) => (v && v.data) ? '[Data]' : v, 2));
}

test();
