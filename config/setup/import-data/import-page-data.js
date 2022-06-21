const createEntry = require("../create-entry");
const fileUtils = require("../file-utils");
const { pages } = require("../../../.data/data.json");
// try {
//   pageSettings = require("@/data/pages.json");
//   layoutSettings = require("@/data/layout.json");
// } catch (e) {
//   if (e.code !== "MODULE_NOT_FOUND") {
//     // Re-throw not "Module not found" errors
//     throw e;
//   }
//   if (e.message.indexOf("'express'") === -1) {
//     // Re-throw not found errors for other modules
//     throw e;
//   }
//}

async function importPageData(strapi) {
  if (!pages) {
    return;
  }
  for (let i = 0; i < pages.length; i++) {
    const pageData = pages[i];
    for (let i = 0; i < pageData.data.contentSections.length; i++) {
      const contentSection = pageData.data.contentSections[i];
      pageData.data.contentSections[i] = await uploadElementFiles(
        contentSection,
        pageData,
        i
      );
    }
    const files = await fileUtils.getFilesData(pageData.files.page);
    await createEntry(strapi, pageData.slug, pageData.data, files);
  }

  async function uploadElementFiles(contentSection, pageData, index) {
    for (var prop in contentSection) {
      if (contentSection.hasOwnProperty(prop)) {
        let attributeName = `contentSections.${index}.${prop}`;
        if (
          prop !== "__component" &&
          pageData.files.elements &&
          pageData.files.elements[attributeName]
        ) {
          let elementFilesData = contentSection[prop];
          for (var fileProp in pageData.files.elements[attributeName]) {
            if (pageData.files.elements[attributeName].hasOwnProperty(fileProp)) {
              let fileData = pageData.files.elements[attributeName][fileProp];
              if (!Array.isArray(pageData.files.elements[attributeName][fileProp])) {
                fileData = [pageData.files.elements[attributeName][fileProp]];
              }
              let filesObj = await fileUtils.getFilesData(fileData);
              var files = Object.keys(filesObj).map((key) => {
                return filesObj[key];
              });
              let uploads = await strapi.plugins.upload.services.upload.upload({
                data: {},
                files: files,
              });
              if (Array.isArray(elementFilesData)) {
                for (let i = 0; i < elementFilesData.length; i++) {
                  elementFilesData[i][fileProp] = uploads[i].id;
                }
              } else {
                elementFilesData[fileProp] = uploads[0].id;
              }
            }
          }
        }
      }
    }
    return contentSection;
  }
}

module.exports = importPageData;