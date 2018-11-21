let assert = require('assert');
let app = require('../../app/dist/CampaignServer.js');
let http = rquire('http');
let fs = require('fs');
const port = 80;
describe('CampaignServer', function () {
    let server;
    before(function () {
        server = app.listen(port, () => console.log(`Test listening on port ${port}`));
    });

    let tests = [
        {
            name: 'Get Missing userId',
            url: 'http://localhost/getCampaignImage?',
            file: './../../files/Homework/Proof Homework/shrug.jpg'
        },
        {
            name: 'Get Invalid userId',
            url: 'http://localhost/getCampaignImage?userid=-1',
            file: './../../files/Homework/Proof Homework/shrug.jpg'
        },
        {
            name: 'Get Austin User',
            url: 'http://localhost/getCampaignImage?userid=7',
            file: './../../files/Homework/Proof Homework/Austin.jpg'  
        },
        {
            name: 'Get Second Austin User',
            url: 'http://localhost/getCampaignImage?userId=1',
            file: './../../files/Homework/Proof Homework/Austin.jpg'
        },
        {
            name: 'Get San Francisco User',
            url: 'http://localhost/getCampaignImage?userId=6',
            file: './../../files/Homework/Proof Homework/SanFrancisco.jpg'
        },
        {
            name: 'Get Software User',
            url: 'http://localhost/getCampaignImage?userId=8',
            file: './../../files/Homework/Proof Homework/Software.jpg'
        },
        {
            name: 'Get Sports User',
            url: 'http://localhost/getCampaignImage?userId=3',
            file: './../../files/Homework/Proof Homework/Sports.jpg'
        },
        {
            name: 'Get Small Size User',
            url: 'http://localhost/getCampaignImage?userId=9',
            file: './../../files/Homework/Proof Homework/proof.png'
        },
        {
            name: 'Get Medium Size User',
            url: 'http://localhost/getCampaignImage?userId=5',
            file: './../../files/Homework/Proof Homework/smb.png'
        },
        //TODO: add in a user and test which does not qualify for a campaign, but is still a user we have information on
    ];

    for(let i = 0; i < test.length; i++) {
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
                assert.equal(200, result.statusCode);
            });
            it('should return ' + test.file + ' with ' + test.url, function () {
                let tmpFileName = './tmp/test' + i + '.jpg';
                let file = fs.createWriteStream(tmpFileName);

                result.pipe(file);
                result.on('end', function () {
                    let tmp = fs.createReadStream(tmpFileName);
                    let original = fs.createReadStream(test.file);
                    assert.isTrue(tmp.equals(original), 'the two files are identical');
                    fs.unlink(tmpFileName);
                });
            });
        });
    }


    describe('Get San Francisco User', function () {
        let result;
        before(function(done) {
            http.get('http://localhost/getCampaignImage?userId=6', function (res) {
                result = res;
                return done();
            });
        });
        it('should return 200', function () {
            assert.equal(200, result.statusCode);
        });
        it('should return SanFrancisco.jpg with userid 6', function () {
            let file = fs.createWriteStream('./tmp/SanFrancisco.jpg');
            
            result.pipe(file);
            result.on('end')
        })
    });
    after(function () {
        server.close();
    });
})