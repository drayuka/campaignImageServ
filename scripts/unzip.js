let decompress = require('decompress');
let fs = require('fs');

let archiveName = __dirname + '/../files/Homework.zip';
let destinationName = __dirname + '/../files/Homework/';

decompress(archiveName, destinationName).then(files => {
    console.log('successfully unzipped ' + archiveName + ' to ' + destinationName);
});