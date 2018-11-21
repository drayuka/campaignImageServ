let assert = require('chai').assert;
let app = require('../../app/dist/campaignServer.js').app;
let http = require('http');
let fs = require('fs');
const port = 3000;


describe('Campaign Server Tests', function () {
    let server;
    before(function (done) {
        server = app.listen(port, () => {
            console.log(`Test server running at ${port}`);
            done();
        });
    });

    let tests = [
        {
            name: 'Get Missing userId',
            url: 'http://localhost:3000/getCampaignImage?',
            file: './../../files/Homework/Proof Homework/shrug.jpg'
        },
        {
            name: 'Get Invalid userId',
            url: 'http://localhost:3000/getCampaignImage?userid=-1',
            file: './../../files/Homework/Proof Homework/shrug.jpg'
        },
        {
            name: 'Get Austin User',
            url: 'http://localhost:3000/getCampaignImage?userid=7',
            file: './../../files/Homework/Proof Homework/Austin.jpg'  
        },
        {
            name: 'Get Second Austin User',
            url: 'http://localhost:3000/getCampaignImage?userId=1',
            file: './../../files/Homework/Proof Homework/Austin.jpg'
        },
        {
            name: 'Get San Francisco User',
            url: 'http://localhost:3000/getCampaignImage?userId=6',
            file: './../../files/Homework/Proof Homework/SanFrancisco.jpg'
        },
        {
            name: 'Get Software User',
            url: 'http://localhost:3000/getCampaignImage?userId=8',
            file: './../../files/Homework/Proof Homework/Software.jpg'
        },
        {
            name: 'Get Sports User',
            url: 'http://localhost:3000/getCampaignImage?userId=3',
            file: './../../files/Homework/Proof Homework/Sports.jpg'
        },
        {
            name: 'Get Small Size User',
            url: 'http://localhost:3000/getCampaignImage?userId=9',
            file: './../../files/Homework/Proof Homework/proof.png'
        },
        {
            name: 'Get Medium Size User',
            url: 'http://localhost:3000/getCampaignImage?userId=5',
            file: './../../files/Homework/Proof Homework/smb.png'
        },
        //TODO: add in a user and test which does not qualify for a campaign, but is still a user we have information on
    ];

    for(let i = 0; i < tests.length; i++) {
        let test = tests[i];
        describe(test.name, function () {
            let result;
            before(function(done) {
                http.get(test.url, function (res) {
                    result = res;
                    return done();
                });
            });
            it('should return 200', function () {
                assert.equal(result.statusCode, 200);
            });
            it('should return ', function (done) {
                let tmpFileName = './tmp/test' + i + '.jpg';
                let file = fs.createWriteStream(tmpFileName);

                result.pipe(file);
                result.on('end', function () {
                    assert.isTrue(fs.existsSync(tmpFileName));
                    let tmp = fs.readFileSync(tmpFileName);
                    let original = fs.readFileSync(test.file);
                    assert.isTrue(original.equals(tmp));
                    fs.unlink(tmpFileName);
                    done();
                });
            });
        });
    }

    after(function (done) {
        server.close(done);
    });
})