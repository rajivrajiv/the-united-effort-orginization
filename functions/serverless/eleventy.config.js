const sass = require("sass");
const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");


module.exports = function(eleventyConfig) {

  //pass through static assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "/" });

  // Eleventy Serverless plugin
  eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
    name: "serverless",
    functionsDir: "./netlify/functions/",
    copy: [
      { from: ".cache", to: "cache" }
    ]
  });

  // add Eleventy filters
  eleventyConfig.addFilter("markdownify", require("./src/filters/markdownify.js"));
  eleventyConfig.addFilter("index", require("./src/filters/index.js"));
  eleventyConfig.addFilter("whereIncluded", require("./src/filters/whereIncluded.js"));
  eleventyConfig.addFilter("whereEmpty", require("./src/filters/whereEmpty.js"));
  eleventyConfig.addFilter("sortUnitType", require("./src/filters/sortUnitType.js"));


  // Sass pipeline
  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    compile: function(contents, includePath) {
      let includePaths = [this.config.dir.includes];
      return () => {
        let ret = sass.renderSync({
          file: includePath,
          includePaths,
          data: contents,
          outputStyle: "compressed"
        });
        return ret.css.toString("utf8");
      }
    }
  });

  return {
    dir: {
      input: "src/site",
      output: "dist",
      data: "_data"
    }
  }
};