import * as express from "express";
import * as fs from "fs";
import { Http2ServerResponse } from "http2";


let usersFile : string= fs.readFileSync(__dirname + '/../../files/Homework/Proof Homework/Proof_homework.csv', {encoding: 'utf8'});
let campaignsFile : string = fs.readFileSync(__dirname + '/../../files/CampaignConfig.csv',{encoding:'utf8'});
let users : any[] = [];
let campaigns : any[] = [];

let userStrings : string[][] = [];
let campaignStrings : string[][] = [];

usersFile.split('\n').forEach((row) => userStrings.push(row.trim().split(',')));
campaignsFile.split('\n').forEach((row) => campaignStrings.push(row.trim().split(',')));

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

for(let i = 1; i < campaignStrings.length; i++) {
    let campaign: any = {};
    for(let j = 0; j < campaignStrings[i].length; j++) {
        campaign[campaignStrings[0][j].trim()] = campaignStrings[i][j].trim();
    }
    campaigns.push(campaign);
}
campaigns.sort((a,b) => a['priority'] - b['priority']);

const app : express.Application = express();


//log errors and report 500 errors when server throws an error
app.use(function (req, res, next) {
    try {
        next()
    } catch(err) {
        res.sendStatus(500);
        console.log(err.stack);
    }
});

app.get('/', function (req, res) {
    let root = __dirname + '/../../web/base/';
    res.sendFile('main.html', {root: root});
})

app.get('/user', function (req, res) {
    let userId = req.query.userId -1;
    if(!req.query.userId || userId >= users.length || userId < 0) {
        res.sendStatus(404);
        console.log('couldnt find user with id: ' + userId);
    }
});

app.use('/user', express.json());

app.put('/user', function (req, res) {
    console.log('added user:');
    console.log(req.body);
    res.send(users.push(req.body));
});

app.use('/campaign/priority', express.json());

app.put('/campaign/priority', function (req, res) {
    console.log('changing campaign priorities');
    console.log(req.body);

    for(let i = 0; i < req.body.length; i++) {
        let newPriority = req.body[i];
        campaigns.sort((a,b) => a['id'] - b['id']);
        campaigns[newPriority['id']]['priority'] = newPriority['priority'];
        campaigns.sort((a,b) => a['priority'] - b['priority']);
    }
    //if this is not permanent, it will only last until the
    //server is restarted
    if(req.query.permanent) {
        let columns = Object.keys(campaigns[0]);
        let rows = campaigns.forEach((value) => {
        let changedCSV = columns + '\n' + rows;
        });
        let changedCSV = columns + '\n' + rows;
        let curCampaign = __dirname + '/../../files/CampaignConfig.csv';
        let oldCampaign = __dirname + '/../../files/CampaignConfig.csv';
        fs.rename(curCampaign, oldCampaign, () => {
            fs.writeFile(__dirname + '/../../files/CampaignConfig.csv',changedCSV, (err) => {
                //if we have a problem writing the new version to disk, we should at least recover the old one

                if(err) {
                    console.log(err);
                    fs.renameSync(oldCampaign, curCampaign);
                } else {
                    fs.unlinkSync(oldCampaign);
                }
            } );
        });
    }
    res.sendStatus(200);
});

app.get('/campaign/image', function (req, res) {
    let root = __dirname + '/../../';
    let userId = req.query.userId - 1;
    let user;
    if(!req.query.userId || userId >= users.length || userId < 0) {
        res.sendFile('files/Homework/Proof Homework/shrug.jpg', {
            root: root
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