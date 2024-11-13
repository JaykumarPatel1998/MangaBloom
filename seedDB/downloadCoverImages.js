const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Directory where cover images will be saved
const coverDir = path.join(__dirname, 'cover_images/');
if (!fs.existsSync(coverDir)) {
    throw new Error("cover_images/ dir does not exist")
};

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

async function downloadCoverImage(mangaId, coverId) {
  try {
    // Fetch cover details to get the filename and URL
    const response = await axios.get(`https://api.mangadex.org/cover/${coverId}`);
    const filename = response.data.data.attributes.fileName;
    
    // Construct image URL
    const coverUrl = `https://uploads.mangadex.org/covers/${mangaId}/${filename}.256.jpg`;
    const outputPath = path.join(coverDir, `${mangaId}-${coverId}.jpg`);

    // Download the image and save to output path
    const imageResponse = await axios.get(coverUrl, { responseType: 'stream' });
    imageResponse.data.pipe(fs.createWriteStream(outputPath));

    console.log(`Downloaded cover for mangaId ${mangaId} with coverId ${coverId}`);
  } catch (error) {
    console.error(`Failed to download cover for mangaId ${mangaId} and coverId ${coverId}:`, error);
  }
}

async function downloadAllCovers() {
  const fileContent = fs.readFileSync(coverDir + 'cover_images.txt', 'utf8');
  const lines = fileContent.split('\n').filter(line => line);

  for (const line of lines) {
    const [mangaId, coverId] = line.split(',');

    await downloadCoverImage(mangaId, coverId);
    await sleep(200); // Delay to respect rate limit
  }

  console.log('All covers downloaded.');
}

// Run the download script
downloadAllCovers().catch(console.error);
