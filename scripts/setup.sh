#!/bin/bash
rm -rf ./files/Homework
echo 'removed Homework files'
npm run unzip
echo 'reinflated Homework files'
npm run tsc -- -p ./app
echo 'typescript transpilation complete'
npm run webpack -- --config ./web/webpack.config.js
echo 'webpack bundling complete'
