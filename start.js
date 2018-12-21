const fs = require('fs');
const babelConfig = JSON.parse(fs.readFileSync('./.babelrc'));
require('babel-register')(babelConfig);
require('babel-polyfill');
// require('./test');  //测试装饰器
require('./server/index');
// Show unhandled rejections
process.on('unhandledRejection', function(reason, promise) {
  console.log(promise);
});
