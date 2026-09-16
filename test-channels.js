import { pipeline, RawImage } from '@huggingface/transformers';

async function test() {
  const pipe = await pipeline('image-segmentation', 'Xenova/modnet');
  const img = new RawImage(new Uint8Array(10*10*3), 10, 10, 3);
  const res = await pipe(img);
  const mask = Array.isArray(res) ? res[0].mask : res.mask;
  console.log("Channels:", mask.channels);
  console.log("Width:", mask.width, "Height:", mask.height);
  console.log("Data length:", mask.data.length);
}

test();
