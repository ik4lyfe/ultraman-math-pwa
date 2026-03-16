const fs = require('fs');
const path = require('path');
const https = require('https');

const ASSETS_DIR = path.join(__dirname, '../public/assets');
const DIRS = ['images', 'sounds', 'music'];

// Ensure directories exist
DIRS.forEach(dir => {
  const fullPath = path.join(ASSETS_DIR, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${fullPath}`);
  }
});

// A small transparent 1x1 GIF data URL to act as a placeholder image.
const transparentGif = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

// A tiny valid basic WAV file to act as a placeholder audio.
const silentWav = Buffer.from(
  'UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAAE=',
  'base64'
);

const MOCK_ASSETS = [
  { name: 'images/ultraman_idle.png', type: 'image' },
  { name: 'images/ultraman_attack.png', type: 'image' },
  { name: 'images/ultraman_hurt.png', type: 'image' },
  { name: 'images/baltan.png', type: 'image' },
  { name: 'images/zetton.png', type: 'image' },
  { name: 'images/gomora.png', type: 'image' },
  { name: 'images/background.jpg', type: 'image' },
  { name: 'images/color_timer_blue.png', type: 'image' },
  { name: 'images/color_timer_red.png', type: 'image' },
  
  { name: 'sounds/spacium_beam.wav', type: 'audio' },
  { name: 'sounds/color_timer_beep.wav', type: 'audio' },
  { name: 'sounds/kaiju_roar.wav', type: 'audio' },
  { name: 'sounds/correct.wav', type: 'audio' },
  { name: 'sounds/wrong.wav', type: 'audio' },
  
  { name: 'music/take_me_higher.mp3', type: 'audio' },
  { name: 'music/battle_theme.mp3', type: 'audio' }
];

async function generatePlaceholders() {
  console.log('Generating placeholder assets for PWA offline capabilities...');
  for (const asset of MOCK_ASSETS) {
    const dest = path.join(ASSETS_DIR, asset.name);
    if (!fs.existsSync(dest)) {
      if (asset.type === 'image') {
        fs.writeFileSync(dest, transparentGif);
      } else {
        fs.writeFileSync(dest, silentWav);
      }
      console.log(`[+] Created placeholder: ${asset.name}`);
    } else {
      console.log(`[-] Exists: ${asset.name}`);
    }
  }
  console.log('Done! All assets are ready for caching.');
}

generatePlaceholders();
