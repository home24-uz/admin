// serverMiddleware/blockImages.js
const path = require("path");
const fs = require("fs");

module.exports = function (req, res, next) {
  const url = req.originalUrl.toLowerCase();
  const imageExtensions = [".png", ".jpg", ".webp"];

  // Check if the request is for an image
  if (imageExtensions.some((ext) => url.endsWith(ext))) {
    const filePath = path.resolve(__dirname, "../static", "." + url);

    // Check if the file exists at the specified path
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // If the file doesn't exist, trigger the error layout
        const error = new Error("Image Not Found");
        error.statusCode = 404;
        next(error); 
      } else {
        // If the file exists, pass control to the next middleware
        next();
      }
    });
  } else {
    // If the request is not related to an image, pass control to the next middleware
    next();
  }
};
