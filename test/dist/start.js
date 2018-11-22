let assert = require('chai').assert;
let app = require('../../app/dist/campaignServer.js').app;
let http = require('http');
let fs = require('fs');
const port = 3000;


describe('Campaign Server Tests', function () {
    let server;
    before(function (done) {
        if(!fs.existsSync(__dirname + '/tmp/')) {
            fs.mkdirSync(__dirname + '/tmp/');
        }
        server = app.listen(port, () => {
            console.log(`Test server running at ${port}`);
            done();
        });
    });

    let tests = [
        {
            name: 'Get Missing userId',
            url: 'http://localhost:3000/campaignImage?',
            file: __dirname + '/../../files/Homework/Proof Homework/shrug.jpg'
        },
        {
            name: 'Get Invalid userId',
            url: 'http://localhost:3000/campaignImage?userId=-1',
            file: __dirname + '/../../files/Homework/Proof Homework/shrug.jpg'
        },
        {
            name: 'Get Austin User',
            url: 'http://localhost:3000/campaignImage?userId=7',
            file: __dirname + '/../../files/Homework/Proof Homework/Austin.jpg'  
        },
        {
            name: 'Get Second Austin User',
            url: 'http://localhost:3000/campaignImage?userId=1',
            file: __dirname + '/../../files/Homework/Proof Homework/Austin.jpg'
        },
        {
            name: 'Get San Francisco User',
            url: 'http://localhost:3000/campaignImage?userId=6',
            file: __dirname + '/../../files/Homework/Proof Homework/SanFrancisco.jpg'
        },
        {
            name: 'Get Software User',
            url: 'http://localhost:3000/campaignImage?userId=8',
            file: __dirname + '/../../files/Homework/Proof Homework/Software.jpg'
        },
        {
            name: 'Get Sports User',
            url: 'http://localhost:3000/campaignImage?userId=3',
            file: __dirname + '/../../files/Homework/Proof Homework/Sports.jpg'
        },
        {
            name: 'Get Small Size User',
            url: 'http://localhost:3000/campaignImage?userId=9',
            file: __dirname + '/../../files/Homework/Proof Homework/proof.png'
        },
        {
            name: 'Get Medium Size User',
            url: 'http://localhost:3000/campaignImage?userId=5',
            file: __dirname + '/../../files/Homework/Proof Homework/smb.jpg'
        },
        {
            name: 'Get no Campaign',
            url: 'http://localhost:3000/campaignImage?userid=11',
            file: __dirname + '/../../files/Homework/Proof Homework/shrug.jpg'
        }
        //TODO: add in a user and test which does not qualify for a campaign, but is still a user we have information on
    ];

    for(let i = 0; i < tests.length; i++) {
        let test = tests[i];
        let tmpFileName = __dirname + '/tmp/test' + i + '.jpg';
        describe(test.name, function () {
            let result;
            before(function(done) {
                http.get(test.url, function (res) {
                    result = res;
                    return done();
                });
            });
            it('should return 200', function (done) {
                assert.equal(result.statusCode, 200);
                done();
            });
            it('should return : ' + test.file, function (done) {
                let file = fs.createWriteStream(tmpFileName);

                result.pipe(file);
                file.on('close', function () {
                    let tmp = fs.readFileSync(tmpFileName, {encoding: 'base64'});
                    let original = fs.readFileSync(test.file, {encoding: 'base64'});
                    assert.equal(original,tmp);
                    return done();
                });
            });
            after(function (done) {
                fs.unlink(tmpFileName, done);
            });
        });
    }

    after(function (done) {
        fs.rmdirSync(__dirname + '/tmp/');
        server.close(done);
    });
})