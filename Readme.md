
___  ___                       ______ _                       
|  \/  |                       | ___ \ |                      
| .  . | __ _ _ __   __ _  __ _| |_/ / | ___   ___  _ __ ___  
| |\/| |/ _` | '_ \ / _` |/ _` | ___ \ |/ _ \ / _ \| '_ ` _ \ 
| |  | | (_| | | | | (_| | (_| | |_/ / | (_) | (_) | | | | | |
\_|  |_/\__,_|_| |_|\__, |\__,_\____/|_|\___/ \___/|_| |_| |_|
                     __/ |                                    
                    |___/                                     



---

# MangaBloom

Welcome to **MangaBloom**, a comprehensive manga reading platform with a focus on a seamless and enjoyable user experience. The platform uses a structured backend and templated frontend to deliver manga content efficiently and responsively.

## Overview

MangaBloom leverages templating on the frontend to create a dynamic yet lightweight interface for browsing and reading manga. By pulling data from external APIs (e.g., MangaDex) and storing it locally, MangaBloom maintains a stable and responsive user experience. This architecture helps manage API rate limits while making manga content readily available for users.

## Key Features

- **Extensive Manga Library**: Users can browse a large collection of manga organized by genres, tags, authors, and themes.
- **Multiple Language Support**: Manga descriptions, titles, and metadata are available in various languages to cater to a global audience.
- **Fast and Interactive Interface**: The frontend is built with server-side templating, offering a responsive experience with smooth transitions between pages.
- **Advanced Search and Filtering Options**: Users can search by genre, theme, publication year, and more, allowing for a tailored manga exploration experience.

## High-Level Architecture

MangaBloom is built with a layered architecture, separating frontend templating, backend logic, and database management for better maintainability and scalability.

### 1. **Frontend**

   - Built using **server-side templating** (such as EJS, Handlebars, or Pug) instead of a frontend framework. This templating approach allows dynamic content rendering on each page without heavy JavaScript frameworks.
   - The templated pages load content dynamically based on data provided by the backend, giving a smooth, responsive feel while keeping the site lightweight.
   - **CSS styling** and **JavaScript** are used selectively to enhance the interactivity of elements like dropdowns, modals, and pagination.

### 2. **Backend**

   - Developed in **Node.js** with **Express**, the backend handles requests from the frontend, communicates with the database, and interfaces with the MangaDex API for fresh data.
   - **Data Management**: Ensures data consistency by processing data from the MangaDex API and storing it in the local database. A batch processing approach is implemented to handle data updates efficiently.
   - **Rate Limiting**: Manages external API requests to comply with the API’s rate limit of 5 requests per second, using scheduled and queued requests for data ingestion.
   - **Cover Image Storage**: Downloads cover images and stores them locally, providing faster access to commonly accessed images while reducing external API dependency.

### 3. **Database**

   - **PostgreSQL** stores all manga metadata, titles, descriptions, genres, tags, authors, and other relational data.
   - **Schema Design**: The database is structured to mirror the hierarchy and relationships within the MangaDex data. It includes tables for manga, authors, artists, genres, and tags.
   - **Efficient Caching**: Frequently accessed metadata, such as titles and cover images, is cached in memory for improved performance and reduced database load.

### 4. **API Integration**

   - **MangaDex API** serves as the primary data source for manga information.
   - Rate-limited API calls fetch and populate the database, ensuring adherence to API restrictions. Caching reduces the need for repeated calls, allowing a more stable user experience.
   - MangaBloom transforms raw API data into a clean structure suitable for user-friendly display, including handling multiple languages, genres, and cover images.

### 5. **Image Management**

   - **Cover Images**: Stored locally for fast access. Cover IDs are extracted and stored in a CSV file, making it easy to keep track of which images to download.
   - **On-Demand Downloading**: A separate process downloads cover images from the API and stores them in an organized local folder, reducing load times and API requests.

### 6. **Batch Processing and Rate Limiting**

   - **Batch Processing**: Scheduled batches handle data ingestion and updates. This allows MangaBloom to stay current with new releases without overloading the database or external API.
   - **Rate Limiting**: The backend includes a queue-based mechanism to manage API requests, respecting the 5 requests per second limit to avoid potential throttling.

## Future Improvements

MangaBloom is built with scalability in mind, providing a foundation for future growth and additional features:

- **User Accounts and Personalization**: Enable accounts for personalized reading lists, bookmarks, and reading history.
- **Social Features**: Allow users to share reviews, recommendations, and ratings.
- **Improved Search Filters**: Advanced filters for search refinement, such as publishing years and detailed genres.
- **Localization**: Further localization support for non-English-speaking audiences.

---

## Credits

MangaBloom was made possible with support from the following:

- **[MangaDex](https://mangadex.org/)**: Our primary source for manga metadata, tags, genres, cover images, and other information. We greatly appreciate their comprehensive API and community-driven platform, which allows us to access a wealth of manga content.
- **MangaDex API Documentation**: Thanks to the detailed and well-organized API documentation provided by MangaDex, which helped us seamlessly integrate their data into MangaBloom.
  
**Additional Tools and Libraries**:

- **Node.js** and **Express**: For backend server logic and handling requests efficiently.
- **PostgreSQL**: Our database solution for managing manga metadata, tags, and relationships.
- **Templating Engine** (such as EJS, Handlebars, or Pug): Used to deliver a dynamic, fast-loading user interface.
- **Docker**: For containerized deployment, making MangaBloom scalable and easy to manage.

**Acknowledgments**:

A big thank you to the open-source community for their continued contributions to making tools like MangaDex, PostgreSQL, and templating engines freely available and well-maintained. Their work helps power countless projects and provides the foundation for new creations like MangaBloom.
