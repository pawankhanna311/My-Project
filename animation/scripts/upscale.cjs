// usage: node upscale.cjs <modulesDir> <model e.g. esrgan-thick/4x> <in.png> <out.png>
const [modDir, model, inp, out] = process.argv.slice(2);
const req = (m) => require(require.resolve(m, {paths: [modDir]}));
const tf = req('@tensorflow/tfjs-node');
const Upscaler = req('upscaler/node');
const [pkg, scale] = model.split('/');
const m = req(`@upscalerjs/${pkg}/${scale}`);
const fs = require('fs');
(async () => {
  const t0 = Date.now();
  const upscaler = new Upscaler({model: m});
  const img = tf.node.decodePng(fs.readFileSync(inp), 3);
  const res = await upscaler.upscale(img, {output: 'tensor', patchSize: 64, padding: 6});
  const png = await tf.node.encodePng(tf.cast(tf.clipByValue(res, 0, 255), 'int32'));
  fs.writeFileSync(out, png);
  console.log('done', res.shape, (Date.now() - t0) / 1000, 's');
})().catch((e) => { console.error(e); process.exit(1); });
