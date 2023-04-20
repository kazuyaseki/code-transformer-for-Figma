require('dotenv').config();
module.exports = function (buildOptions) {
  return {
    ...buildOptions,
    define: {
      global: 'window',
      process: '{}',
      'process.env': JSON.stringify(process.env),
    },
  };
};
