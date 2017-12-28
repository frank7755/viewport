/**
 * @module rollup
 * @license MIT
 * @version 2017/11/28
 */

'use strict';

const fs = require('fs');
const rollup = require('rollup');
const uglify = require('uglify-es');
const pkg = require('./package.json');

const banner = `/**
 * @module ${pkg.name}
 * @author ${pkg.author.name}
 * @license ${pkg.license}
 * @version ${pkg.version}
 * @description ${pkg.description}
 * @see ${pkg.homepage}
 */
`;

rollup
  .rollup({
    legacy: true,
    input: 'src/viewport.js',
    external: ['jquery']
  })
  .then(function(bundle) {
    fs.stat('dist', function(error) {
      if (error) {
        fs.mkdirSync('dist');
      }

      const src = 'dist/viewport.js';
      const map = 'viewport.js.map';
      const min = 'dist/viewport.min.js';

      bundle
        .generate({
          format: 'umd',
          indent: true,
          strict: true,
          amd: { id: 'viewport' },
          name: 'Viewport',
          banner: banner,
          globals: { jquery: 'jQuery' }
        })
        .then(function(result) {
          fs.writeFileSync(src, result.code);
          console.log(`  Build ${src} success!`);

          result = uglify.minify(
            {
              'viewport.js': result.code
            },
            {
              ecma: 5,
              ie8: true,
              mangle: { eval: true },
              sourceMap: { url: map }
            }
          );

          fs.writeFileSync(min, banner + result.code);
          console.log(`  Build ${min} success!`);
          fs.writeFileSync(src + '.map', result.map);
          console.log(`  Build ${src + '.map'} success!`);
        })
        .catch(function(error) {
          console.error(error);
        });
    });
  })
  .catch(function(error) {
    console.error(error);
  });
