const path = require('path');

module.exports = {
  // ...other webpack configuration settings...

  resolve: {
    fallback: {
      buffer: require.resolve('buffer/'), 
      "util": false,// Add this line
    },
  },
};
