import * as express from "express";
import * as fs from "fs";


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


app.get('/campaignImage', function (req, res) {
    try {
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
    } catch(err) {
        res.sendStatus(500);
        console.log(err.stack);
    }
});

export { app };