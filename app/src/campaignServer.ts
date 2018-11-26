import * as express from "express";
import * as fs from "fs";
import * as Mocha from "mocha";



let users : any[];
let campaigns : any[];

export let loadCampaigns = function (filename?: string ) {
    campaigns = [];
    let campaignsFileName = __dirname + '/../../files/CampaignConfig.csv';
    if(filename) {
        campaignsFileName = filename;
    }
    let campaignStrings : string[][] = [];
    let campaignsFile : string = fs.readFileSync(campaignsFileName,{encoding:'utf8'});
    campaignsFile.split('\n').forEach((row) => campaignStrings.push(row.trim().split(',')));
    for(let i = 1; i < campaignStrings.length; i++) {
        let campaign: any = {};
        for(let j = 0; j < campaignStrings[i].length; j++) {
            campaign[campaignStrings[0][j].trim()] = campaignStrings[i][j].trim();
        }
        campaigns.push(campaign);
    }    
}

let saveCampaigns = function () {
    let columns = Object.keys(campaigns[0]);
    let changedRows = [columns.join(',')];
    let rows = campaigns.forEach((campaign) => {
        let rowElements : any[]= [];
        columns.forEach((columnName) => {
            rowElements.push(campaign[columnName])
        });
        changedRows.push(rowElements.join(','));
    });
    let changedCSV = changedRows.join('\n');
    

    let curCampaign = __dirname + '/../../files/CampaignConfig.csv';
    let oldCampaign = __dirname + '/../../files/CampaignConfig.csv.bak';
    fs.rename(curCampaign, oldCampaign, () => {
        fs.writeFile(__dirname + '/../../files/CampaignConfig.csv', changedCSV, (err) => {
            //if we have a problem writing the new version to disk, we should at least recover the old one

            if(err) {
                console.log(err);
                fs.renameSync(oldCampaign, curCampaign);
                loadCampaigns();
            } else {
                fs.unlinkSync(oldCampaign);
            }
        });
    });
}

let sortCampaigns = function () {
    campaigns.sort((a,b) => a['priority'] - b['priority']);
}



let loadUsers = function () {
    users = [];
    let userStrings : string[][] = [];
    let usersFile : string= fs.readFileSync(__dirname + '/../../files/Homework/Proof Homework/Proof_homework.csv', {encoding: 'utf8'});

    usersFile.split('\n').forEach((row) => userStrings.push(row.trim().split(',')));

    for(let i = 3; i < userStrings.length; i++) {
        if(!userStrings[i][0]) {
            continue;
        }
        let user : any = {};
        for(let j = 0; j < userStrings[i].length; j++) {
            user[userStrings[2][j].trim()] = userStrings[i][j].trim();
        }
        users.push(user);
    } 
}


loadCampaigns();
sortCampaigns();
loadUsers();


const app : express.Application = express();


app.get('/', function (req, res) {
    let root = __dirname + '/../../web/base/';
    res.sendFile('main.html', {root: root});
});

app.use('/campaign/list', express.json());

app.put('/campaign/list', function (req, res) {
    console.log('saving all new campaigns:');
    console.log(req.body);
    campaigns = req.body;
    res.sendStatus(200);
    sortCampaigns();
    saveCampaigns();
    loadCampaigns();
})


app.get('/campaign/list', function (req, res) {
    res.send(JSON.stringify(campaigns));
});

app.get('/campaign/image', function (req, res) {
    let root = __dirname + '/../../';
    let userId = req.query.userId - 1;
    let user;
    if(!req.query.userId || userId >= users.length || userId < 0) {
        res.sendFile('files/Homework/Proof Homework/shrug.jpg', {
            root: root,
            headers: {
                'Cache-Control' : 'no-cache'
            }
        });
        return;
    } else {
        user = users[userId];
    }
    let found = false;
    for(let i = 0; i < campaigns.length && !found; i++) {
        let campaign = campaigns[i];
        if(user[campaign['type']] == campaign['criteria']) {
            res.sendFile('files/Homework/Proof Homework/' + campaign['image'], {
                root: root
            });
            found = true;
        }
    }
    if(found) {
        return;
    }

    // if no campaigns apply (currently impoosible) send shrug
    res.sendFile('files/Homework/Proof Homework/shrug.jpg', {
        root: root
    });    
});


app.get('/tests', function (req, res) {
    let mocha = new Mocha({
        reporter: 'doc'
    });

    // if the user runs tests multiple times they will not be re-run
    // this is because mocha relies on them being run via require
    // so this is a hack to clear the test file from the require cache
    // so that the tests will re-run every time the user loads this
    delete require.cache[require.resolve(__dirname + '/../../test/dist/start.js')];

    mocha.addFile(__dirname + '/../../test/dist/start.js');
    let stdoutWrite = process.stdout.write;
    let testresults = '';

    process.stdout.write = <any>function(str : any) {
        testresults += str;
    }
    mocha.run((failures: number) => {
        process.stdout.write = stdoutWrite;
        res.send(testresults);
    });

})

let nodePackageOptions = {
    dotfiles: 'ignore',
    extensions: ['js']
}

let clientAppOptions = {
    dotfiles: 'ignore',
    extensions: ['js','html','html']
}

app.use('/static', express.static(__dirname + '/../../node_modules/'));

app.use('/static', express.static(__dirname + '/../../web/base/', clientAppOptions));

export { app };