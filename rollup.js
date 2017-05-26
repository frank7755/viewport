'use strict'

const fs = require('fs');
const rollup = require('rollup');
const uglify = require('uglify-js');

rollup.rollup({
  legacy: true,
  entry: 'src/viewport.js',
  external: ['jquery']
}).then(function(bundle) {
  fs.stat('dist', function(error) {
    if (error) {
      fs.mkdirSync('dist');
    }

    const src = 'dist/viewport.js';
    const map = 'viewport.js.map';
    const min = 'dist/viewport.min.js';

    let result = bundle.generate({
      format: 'umd',
      indent: true,
      useStrict: true,
      moduleId: 'viewport',
      moduleName: 'Viewport',
      globals: {
        jquery: 'jQuery'
      }
    });

    fs.writeFileSync(src, result.code);
    console.log(`  Build ${ src } success!`);

    result = uglify.minify({
      'viewport.js': result.code
    }, {
      compress: { ie8: true },
      mangle: { ie8: true },
      output: { ie8: true },
      sourceMap: { url: map }
    });

    fs.writeFileSync(min, result.code);
    console.log(`  Build ${ min } success!`);
    fs.writeFileSync(src + '.map', result.map);
    console.log(`  Build ${ src + '.map' } success!`);
  });
}).catch(function(error) {
  console.error(error);
});
