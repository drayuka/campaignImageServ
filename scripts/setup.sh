unzip -d ./files/Homework -o ./files/Homework.zip
npm run tsc -- -p ./app
npm run webpack -- --config ./web/webpack.config.js