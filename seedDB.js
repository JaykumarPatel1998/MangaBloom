const axios = require("axios");
const { Pool } = require("pg");
const fs = require('fs/promises');
const path = require("path");

const CREATE_MANGA_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS manga (
    id UUID PRIMARY KEY,
    title TEXT,                               -- Title of the manga
    description TEXT,                         -- Description of the manga
    original_language VARCHAR(10),            -- Original language of the manga
    last_volume VARCHAR(10),                  -- Last volume number
    last_chapter VARCHAR(10),                 -- Last chapter number
    demographic VARCHAR(20),                  -- Target demographic
    status VARCHAR(20),                       -- Status (e.g., ongoing, completed)
    year INT,                                 -- Publication year
    content_rating VARCHAR(20),               -- Content rating (e.g., suggestive, mature)
    state VARCHAR(20),                        -- Publishing state (e.g., published, draft)
    is_locked BOOLEAN DEFAULT FALSE,          -- Whether the manga is locked
    chapter_reset BOOLEAN DEFAULT FALSE,      -- Whether chapters reset on new volume
    created_at TIMESTAMP,                     -- Creation date
    updated_at TIMESTAMP,                     -- Last update date
    version INT DEFAULT 1                     -- Version control for record
);
`;

const CREATE_TITLE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS titles (
    id SERIAL PRIMARY KEY,
    manga_id UUID REFERENCES manga(id) ON DELETE CASCADE,
    language_code VARCHAR(10),                -- Language code for the title (e.g., 'en', 'ja')
    title TEXT NOT NULL                       -- Title text
);
`;
const CREATE_DESCRIPTION_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS descriptions (
    id SERIAL PRIMARY KEY,
    manga_id UUID REFERENCES manga(id) ON DELETE CASCADE,
    language_code VARCHAR(10),
    description TEXT
);
`;

const CREATE_AUTHOR_TABLE = `
CREATE TABLE IF NOT EXISTS authors (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
`;

const CREATE_MANGA_AUTHOR_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS manga_authors (
    manga_id UUID REFERENCES manga(id) ON DELETE CASCADE,
    author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
    PRIMARY KEY (manga_id, author_id)
);
`;

const CREATE_ARTIST_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS artists (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
`;

const CREATE_MANGA_ARTISTS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS manga_artists (
    manga_id UUID REFERENCES manga(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    PRIMARY KEY (manga_id, artist_id)
);
`;

const CREATE_COVER_IMAGE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS cover_images (
    id UUID PRIMARY KEY,
    manga_id UUID REFERENCES manga(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const CREATE_TAGS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY,
    name text,                                -- JSONB to store names in multiple languages (e.g., {"en": "Romance"})
    description text,                         -- JSONB for descriptions in multiple languages if needed
    group_name VARCHAR(50),                    -- Defines the type, such as "genre" or "theme"
    version INT DEFAULT 1                      -- To track versions if required
);
`;

const CREATE_MANGA_TAGS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS manga_tags (
    manga_id UUID REFERENCES manga(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (manga_id, tag_id)
);
`;

// PostgreSQL connection setup
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "password",
  port: 5432,
});

const mangaDexAPI = "https://api.mangadex.org";


// Helper function to respect rate limit by adding delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to get author or artist name by ID
async function fetchPersonName(personId) {
  try {
    const response = await axios.get(
      `https://api.mangadex.org/author/${personId}`
    );
    return response.data.data.attributes.name || "Unknown";
  } catch (error) {
    console.error(`Error fetching person with ID ${personId}:`, error);
    return "Unknown";
  }
}

// Fetch manga list from API
async function fetchMangaList(page = 1) {
  try {
    const response = await axios.get(`${mangaDexAPI}/manga`, {
      params: { limit: 10, offset: (page - 1) * 10 },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching manga list:", error);
    return [];
  }
}



//create a key value pair of mangaId:coverId for later fetching cover images
async function appendCoverIdToFile(mangaId, coverId) {
  const pair = `${mangaId},${coverId}\n`;
  await fs.appendFile(path.join(__dirname, 'cover_images/', 'cover_images.txt'), pair, 'utf8')
}


// Insert manga details, titles, and tags
async function insertManga(manga, client) {
  //   const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert manga core details
    const insertMangaQuery = `
      INSERT INTO manga (id, description, original_language, last_volume, last_chapter, status, year, demographic, content_rating, created_at, updated_at, state, title)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (id) DO NOTHING;
    `;
    const mangaValues = [
      manga.id,
      manga.attributes.description?.en ||
        manga.attributes.description?.ja ||
        null,
      manga.attributes.originalLanguage || null,
      manga.attributes.lastVolume || null,
      manga.attributes.lastChapter || null,
      manga.attributes.status || null,
      manga.attributes.year || null,
      manga.attributes.publicationDemographic || null,
      manga.attributes.contentRating || null,
      manga.attributes.createdAt || null,
      manga.attributes.updatedAt || null,
      manga.attributes.state || null,
      manga.attributes.title?.en || manga.attributes.title?.ja || null,
    ];

    await client.query(insertMangaQuery, mangaValues);

    // Insert primary title and alt titles into manga_titles
    const insertTitleQuery = `
      INSERT INTO titles (manga_id, title, language_code)
      VALUES ($1, $2, $3)
      ON CONFLICT DO NOTHING;
    `;

    await client.query(insertTitleQuery, [
      manga.id,
      manga.attributes.title?.en || null,
      "en",
    ]);

    for (const altTitle of manga.attributes.altTitles) {
      const [language, title] = Object.entries(altTitle)[0];
      await client.query(insertTitleQuery, [manga.id, title, language]);
    }

    // Insert tags and their relationships in manga_tags
    for (const tag of manga.attributes.tags) {
      const tagId = tag.id;
      const tagName = tag.attributes.name?.en || null;
      const tagGroup = tag.attributes.group || null;
      const tagDescription = tag.attributes.description?.en || null;
      const tagVersion = tag.attributes.version;

      // Insert tag if it doesn’t exist
      const insertTagQuery = `
        INSERT INTO tags (id, name, group_name, description, version)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO NOTHING;
      `;
      await client.query(insertTagQuery, [
        tagId,
        tagName,
        tagGroup,
        tagDescription,
        tagVersion,
      ]);

      // Insert relationship into manga_tags
      const insertMangaTagQuery = `
        INSERT INTO manga_tags (manga_id, tag_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
      `;
      await client.query(insertMangaTagQuery, [manga.id, tagId]);
    }

    //relations
    for (const relation of manga.relationships) {
      const { id: relationId, type } = relation;

      // Authors
      if (type === "author") {
        await insertAuthorAndLink(client, manga.id, relationId);
      }

      // Artists
      if (type === "artist") {
        await insertArtistAndLink(client, manga.id, relationId);
      }

      
      // Write mangaId and coverId to the file
      if (relation.type === 'cover_art') {
        const coverId = relation.id;
        appendCoverIdToFile(manga.id, coverId);
      }
    }

    await client.query("COMMIT");
    console.log(`Inserted manga ${manga.attributes.title?.en}\n`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(`Error inserting manga ${manga.id}:`, error);
  }
}

async function insertAuthorAndLink(client, mangaId, authorId) {
  try {
    await sleep(300)
    // Fetch author name from API
    const authorName = await fetchPersonName(authorId);

    // Insert author if it doesn't already exist
    await client.query(
      `INSERT INTO authors (id, name) 
         VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
      [authorId, authorName]
    );

    // Link author to manga
    await client.query(
      `INSERT INTO manga_authors (manga_id, author_id) 
         VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [mangaId, authorId]
    );
  } catch (error) {
    console.error(`Error inserting author with ID ${authorId}:`, error);
  }
}

async function insertArtistAndLink(client, mangaId, artistId) {
  try {
    
    await sleep(200)
    // Fetch artist name from API
    const artistName = await fetchPersonName(artistId);

    // Insert artist if it doesn't already exist
    await client.query(
      `INSERT INTO artists (id, name) 
         VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
      [artistId, artistName]
    );

    // Link artist to manga
    await client.query(
      `INSERT INTO manga_artists (manga_id, artist_id) 
         VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [mangaId, artistId]
    );
  } catch (error) {
    console.error(`Error inserting artist with ID ${artistId}:`, error);
  }
}

// Main function to seed the database
async function seedDatabase(client) {
  let page = 1;
  let mangaList = await fetchMangaList(page);

  while (mangaList.length > 0) {
    console.log("page fetched for number : ", page);
    for (const manga of mangaList) {
      await insertManga(manga, client);
    }

    page += 1;
    // Additional delay after each page fetch
    await sleep(1000);
    mangaList = await fetchMangaList(page);
  }

  console.log("Database seeding complete.");
}

(async () => {
  const client = await pool.connect();

  try {
    //some database schema creations
    await client.query(CREATE_MANGA_TABLE_SQL);
    await client.query(CREATE_TITLE_TABLE_SQL);
    await client.query(CREATE_DESCRIPTION_TABLE_SQL);
    await client.query(CREATE_AUTHOR_TABLE);
    await client.query(CREATE_MANGA_AUTHOR_TABLE_SQL);
    await client.query(CREATE_ARTIST_TABLE_SQL);
    await client.query(CREATE_MANGA_ARTISTS_TABLE_SQL);
    await client.query(CREATE_COVER_IMAGE_TABLE_SQL);
    await client.query(CREATE_TAGS_TABLE_SQL);
    await client.query(CREATE_MANGA_TAGS_TABLE_SQL);
    console.log("Schema Created 💚");

    seedDatabase(client).catch((error) =>
      console.error("Error seeding database:", error)
    );
  } catch (error) {
    console.error(`Database init failed : Tables not created`);
    // await pool.end()
  } finally {
    // await pool.end()
  }
})();
