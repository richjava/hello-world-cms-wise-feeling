const fs = require("fs");
const fsp = fs.promises;
const axios = require("axios");
const path = require("path");

async function downloadImage(url, fullPath) {
  return new Promise((resolve, reject) => {
    axios({
      url,
      responseType: "stream",
    }).then((response) =>
      response.data
        .pipe(fs.createWriteStream(fullPath))
        .on("finish", () => {
          resolve();
        })
        .on("error", (e) => reject(e))
    );
  });
}

module.exports = {
  getFileSizeInBytes: async function (filePath) {
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats["size"];
    return fileSizeInBytes;
  },
  getFileData: function (file) {
    return new Promise(async (resolve) => {
      if (!file.data || !file.data.attributes) {
        resolve(null);
      }
      let attributes = file.data.attributes;
      let uploadsPath = ".data/uploads";
      let filePath = `./../../${uploadsPath}`;
      const fullPath = path.resolve(__dirname, filePath);
      const fileName = `${attributes.name}.${attributes.ext}`;
      const imagePath = `${attributes.path}/${fileName}`;
      if (!fs.existsSync(fullPath + imagePath)) {
        fsp.mkdir(fullPath + attributes.path, { recursive: true });
      }
      let url = `https://raw.githubusercontent.com/builtjs/builtjs-theme-corporate-tailwind/main/public${imagePath}`;
      await downloadImage(url, fullPath + imagePath);
      const size = await this.getFileSizeInBytes(fullPath);
      const mimeType = `image/${
        attributes.ext === "svg" ? "svg+xml" : attributes.ext
      }`;
      resolve({
        path: `./${uploadsPath}${imagePath}`,
        name: fileName,
        size,
        type: mimeType,
      });
    });
  },
  getFilesData: async function (files) {
    const fileData = {};
    if (!files) {
      return fileData;
    }
    let filesArr = Object.values(files);
    let keysArr = Object.keys(files);
    if (filesArr && filesArr.length) {
      for (let i = 0; i < filesArr.length; i++) {
        const file = filesArr[i];
        if (file.data && file.data.attributes) {
          fileData[keysArr[i]] = await this.getFileData(
            file
          );
        }
      }
    }
    return fileData;
  },
};
