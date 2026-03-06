const path = require('path');

const frontendDir = path.resolve(__dirname, 'frontend');

module.exports = {
  // Frontend: TypeScript/JavaScript files
  'frontend/src/**/*.{ts,tsx,js,jsx}': (filenames) => {
    // Use absolute paths for files
    const files = filenames.map((f) => `"${f.replace(/\\/g, '/')}"`).join(' ');
    return [
      // Use ESLINT_USE_FLAT_CONFIG=false to support .eslintrc.json with ESLint v9
      `set ESLINT_USE_FLAT_CONFIG=false && node "${frontendDir}/node_modules/eslint/bin/eslint.js" --fix ${files}`,
      `node "${frontendDir}/node_modules/prettier/bin/prettier.cjs" --write ${files}`,
    ];
  },

  // Frontend: JSON and CSS files
  'frontend/src/**/*.{json,css}': (filenames) => {
    const files = filenames.map((f) => `"${f.replace(/\\/g, '/')}"`).join(' ');
    return [`node "${frontendDir}/node_modules/prettier/bin/prettier.cjs" --write ${files}`];
  },

  // Backend: PHP files
  // Note: Uses docker compose for consistent environment
  // Files are mounted at /var/www/html in the container
  'backend/**/*.php': (filenames) => {
    const relativePaths = filenames.map((f) =>
      f.replace(/.*backend[\\/]/, '').replace(/\\/g, '/')
    );
    return [`docker compose exec -T backend ./vendor/bin/pint ${relativePaths.join(' ')}`];
  },
};
