const purgecss = require('@fullhuman/postcss-purgecss')({
    content: [
      './assets/styles/*.css',
      './layouts/**/*.html',
      './content/**/*.md',
    ],
    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
  });
  
  const postcssPresetEnv = require('postcss-preset-env')({
    browsers: "last 2 versions"
  });
  
  module.exports = {
    plugins: [
      require('postcss-import'),
      require('tailwindcss'),
      require('autoprefixer'),
      ...process.env.NODE_ENV === 'production'
        ? [purgecss, postcssPresetEnv]
        : []
    ]
  };