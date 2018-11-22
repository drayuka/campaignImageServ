# Campaign Image Server

### rationale
This is a simple image server build with expressJS which serves up campaign images from a compressed zip file
It will return images based on the campaigns specified in the ./files/CampaignConfig.csv file

### usage

you will need to inflate via npm:

`npm install`

then you just need to start it up:

`npm start`

### testing

automated tests are setup in the node package and can be run via npm:

`npm test`