const set = require("lodash.set");

/**
 * Create an entry and attach files if there are any
 * @param {*} strapi 
 * @param {*} slug 
 * @param {*} data
 * @param {*} files 
 */
async function createEntry(strapi, slug, data, files) {
  try {
    if (files) {
      for (const [key, file] of Object.entries(files)) {
        // Get file name without the extension
        const [fileName] = file.name.split('.');
        // Upload each individual file
        const uploadedFile = await strapi
          .plugin("upload")
          .service("upload")
          .upload({
            files: file,
            data: {
              fileInfo: {
                alternativeText: fileName,
                caption: fileName,
                name: fileName,
              },
            },
          });

        // Attach each file to its entry
        set(data, key, uploadedFile[0].id);
      }
    }

    // Actually create the entry in Strapi
    const createdEntry = await strapi.entityService.create(
      `api::${slug}.${slug}`,
      {
        data: {
          ...data,
          // Make sure it's not a draft
          publishedAt: Date.now(),
        }
      }
    );
  } catch (e) {
    console.log({e});
  }
}

module.exports = createEntry;