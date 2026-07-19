// Run with: node --env-file=.env.local scripts/centrometal-automation.js [--test]
// --test generates only the first product, so we can confirm the Kling API
// contract (endpoint/model/response shape) before spending credits on all 9.

const fs = require('fs');
const path = require('path');

const KLING_API_KEY = process.env.KLING_API_KEY;
const KLING_MODEL = process.env.KLING_MODEL || 'kling-v1';
const KLING_BASE_URL = 'https://api.klingai.com';

if (!KLING_API_KEY) {
  console.error('KLING_API_KEY not found. Run with: node --env-file=.env.local scripts/centrometal-automation.js');
  process.exit(1);
}

const TEST_MODE = process.argv.includes('--test');

const products = [
  {
    id: 'bosch-gsb-18v-55',
    name: 'Bosch GSB 18V-55',
    brand: 'Bosch',
    prompt: 'Professional Bosch cordless drill-driver GSB 18V-55, white and black, side view on white background, studio lighting, high quality product photography'
  },
  {
    id: 'makita-hr2470',
    name: 'Makita HR2470',
    brand: 'Makita',
    prompt: 'Makita HR2470 rotary hammer drill 780W, professional power tool, 3/4 angle view on white background, studio product photo'
  },
  {
    id: 'einhell-te-cd-18-li',
    name: 'Einhell TE-CD 18 Li',
    brand: 'Einhell',
    prompt: 'Einhell TE-CD 18 Li cordless drill, red and black compact design, professional studio product shot on white background'
  },
  {
    id: 'telwin-tecnica-211-s',
    name: 'Telwin Tecnica 211/S',
    brand: 'Telwin',
    prompt: 'Telwin Tecnica 211/S professional welding inverter machine, red and black industrial equipment, 3/4 angle, white background, high resolution'
  },
  {
    id: 'knipex-cobra-xl',
    name: 'Knipex Cobra XL',
    brand: 'Knipex',
    prompt: 'Knipex Cobra XL water pump pliers, red handles, chrome jaws, professional hand tool isolated on white background, sharp detail'
  },
  {
    id: 'bosch-gws-750',
    name: 'Bosch GWS 750',
    brand: 'Bosch',
    prompt: 'Bosch GWS 750 angle grinder 750W, blue and black professional power tool, studio shot on white background'
  },
  {
    id: 'makita-ek765ih',
    name: 'Makita EK765IH',
    brand: 'Makita',
    prompt: 'Makita EK765IH professional gasoline concrete saw, industrial power tool, 3/4 front view, white background, high detail'
  },
  {
    id: 'bosch-glm-50-c',
    name: 'Bosch GLM 50 C',
    brand: 'Bosch',
    prompt: 'Bosch GLM 50 C laser distance meter with Bluetooth, compact black tool, professional product shot on white background'
  },
  {
    id: 'knipex-86-03-250',
    name: 'Knipex 86 03 250',
    brand: 'Knipex',
    prompt: 'Knipex 86 03 250 adjustable pliers, red handles, chrome metal, isolated on white background, sharp product photo'
  }
];

const brands = ['Bosch', 'Makita', 'Einhell', 'Telwin', 'Knipex'];

async function submitKlingImageTask(product) {
  const response = await fetch(`${KLING_BASE_URL}/v1/images/generations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KLING_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: KLING_MODEL,
      prompt: product.prompt
    })
  });

  const raw = await response.text();
  if (!response.ok) {
    throw new Error(`Kling API error ${response.status}: ${raw}`);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`Kling API returned non-JSON response: ${raw.slice(0, 500)}`);
  }

  if (TEST_MODE) {
    console.log('--- raw create-task response ---');
    console.log(JSON.stringify(data, null, 2));
  }

  const taskId = data?.data?.task_id;
  if (!taskId) {
    throw new Error(`No task_id in response: ${raw.slice(0, 500)}`);
  }
  return taskId;
}

async function pollKlingImageTask(taskId, productName, maxWait = 300000) {
  const startTime = Date.now();
  let loggedRaw = false;

  while (Date.now() - startTime < maxWait) {
    const response = await fetch(`${KLING_BASE_URL}/v1/images/generations?pageSize=500`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${KLING_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const raw = await response.text();
    if (!response.ok) {
      throw new Error(`Failed to list tasks: ${response.status}: ${raw}`);
    }

    const data = JSON.parse(raw);
    if (TEST_MODE && !loggedRaw) {
      console.log('--- raw poll/list response (first page) ---');
      console.log(JSON.stringify(data, null, 2).slice(0, 3000));
      loggedRaw = true;
    }

    const list = Array.isArray(data?.data) ? data.data : Array.isArray(data?.data?.data) ? data.data.data : [];
    const task = list.find((t) => t.task_id === taskId);

    if (task) {
      if (task.task_status === 'succeed') {
        const images = task.task_result?.images;
        if (!images?.length) {
          throw new Error(`Task succeeded but no images in result for ${productName}: ${JSON.stringify(task)}`);
        }
        return images[0].url;
      }
      if (task.task_status === 'failed') {
        throw new Error(`Kling task failed for ${productName}: ${task.task_status_msg || 'unknown reason'}`);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  throw new Error(`Kling task timeout for ${productName}`);
}

async function downloadImage(url, filepath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download: ${response.status}`);

  const buffer = Buffer.from(await response.arrayBuffer());
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filepath, buffer);
}

async function downloadLogo(brand) {
  const logoPath = path.join('public', 'logos', `${brand.toLowerCase()}.png`);
  const dir = path.dirname(logoPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  try {
    const clearbitUrl = `https://logo.clearbit.com/${brand.toLowerCase()}.com?size=200`;
    const response = await fetch(clearbitUrl);
    if (response.ok) {
      const buffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(logoPath, buffer);
      console.log(`Downloaded logo: ${brand}`);
      return logoPath;
    }
    console.log(`Could not fetch ${brand} logo from Clearbit (status ${response.status}), skipping`);
  } catch (e) {
    console.log(`Could not fetch ${brand} logo from Clearbit, skipping: ${e.message}`);
  }
  return null;
}

async function generateProductImage(product) {
  console.log(`Submitting: ${product.name}...`);
  const taskId = await submitKlingImageTask(product);
  console.log(`Task created (${taskId}), polling for completion...`);

  const downloadUrl = await pollKlingImageTask(taskId, product.name);
  const imagePath = path.join('public', 'products', `${product.id}.jpg`);
  await downloadImage(downloadUrl, imagePath);
  console.log(`Generated: ${product.name}`);

  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    image: `/products/${product.id}.jpg`,
    logo: `/logos/${product.brand.toLowerCase()}.png`
  };
}

async function runAutomation() {
  console.log(`Starting Centrometal automation${TEST_MODE ? ' (TEST MODE: 1 product only)' : ''}...\n`);

  ['public/products', 'public/logos'].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  const targetProducts = TEST_MODE ? products.slice(0, 1) : products;
  console.log(`Generating ${targetProducts.length} product image(s) via Kling AI...\n`);

  const generatedProducts = [];
  const maxConcurrent = 2;
  let concurrent = 0;
  const pending = [];

  for (const product of targetProducts) {
    while (concurrent >= maxConcurrent) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    concurrent++;
    const task = generateProductImage(product)
      .then((result) => generatedProducts.push(result))
      .catch((error) => console.error(`Failed to generate ${product.name}: ${error.message}`))
      .finally(() => {
        concurrent--;
      });
    pending.push(task);
  }

  await Promise.all(pending);

  if (TEST_MODE) {
    console.log('\nTest run complete. Inspect public/products/ and the logs above.');
    console.log('If the response shapes matched expectations, re-run without --test for the full batch.');
    return;
  }

  console.log('\nDownloading brand logos...\n');
  for (const brand of brands) {
    await downloadLogo(brand);
  }

  const productsJson = {
    generated_at: new Date().toISOString(),
    total_products: generatedProducts.length,
    products: generatedProducts
  };

  const brandsJson = {
    brands: brands.map((brand) => ({
      name: brand,
      logo: `/logos/${brand.toLowerCase()}.png`,
      products_count: generatedProducts.filter((p) => p.brand === brand).length
    }))
  };

  fs.writeFileSync('public/products.json', JSON.stringify(productsJson, null, 2));
  fs.writeFileSync('public/brands.json', JSON.stringify(brandsJson, null, 2));

  console.log('\n=================================');
  console.log('ALL DONE!');
  console.log('=================================');
  console.log(`Generated: ${generatedProducts.length}/${products.length} product images`);
  console.log(`Downloaded: ${brands.length} brand logos (see log above for any skips)`);
  console.log('\nFiles ready in /public/:');
  console.log('  |- products/');
  console.log('  |- logos/');
  console.log('  |- products.json');
  console.log('  \\- brands.json');
}

runAutomation().catch((err) => {
  console.error('Automation failed:', err);
  process.exit(1);
});
