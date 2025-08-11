// frontend/styles/postcss.config.js 또는 frontend/postcss.config.js

module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // ✅ 여기로 반드시 바꿔야 함
    autoprefixer: {},
  },
};
