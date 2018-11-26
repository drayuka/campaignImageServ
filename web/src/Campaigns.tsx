import * as React from "react";
import {ViewCampaigns} from "./campaign/View";
import {ReorderCampaigns} from "./campaign/Reorder";

export type campaignTypes = 'Geo' | 'Industry' | 'Company Size';
export type mode = 'reorder' | 'view';
export interface campaign {
    id: number,
    priority: number,
    type: campaignTypes,
    criteria: string,
    image: string
};

export class Campaigns extends React.Component {
    constructor(props: any) {
        super(props);
        let self = this;
        self.state = {
            mode: 'view',
            campaigns: [],
            loaded: false,
            loadProgress: 0
        };
        self.loadCampaigns();
    }
    state: {
        mode: mode
        campaigns: campaign[],
        loaded: boolean,
        loadProgress: number
    }
    changeMode (newMode: mode) {
        let self = this;
        self.setState({mode: newMode})
    }
    saveCampaignChanges(campaigns: campaign[]) {
        let self = this;
        self.putCampaigns(campaigns).then(() => {
            self.setState({
                campaigns: [],
                loaded: false,
                mode: 'view'
            });
            self.loadCampaigns();
        })
    }

    putCampaigns = async (newCampaigns: campaign[]) => {
        let self = this;
        let response = await fetch('/campaign/list', {
            method: "PUT",
            body: JSON.stringify(newCampaigns),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if(response.status !== 200) throw new Error('failed to save newly orderd campaigns to the server');
    }
    getForm () {
        let self = this;
        let form = <div></div>;
        if(!self.state.loaded) {
            form = <div className="progress">
                <div className="progress-bar" role="progressbar" aria-valuenow={self.state.loadProgress} aria-valuemin={0} aria-valuemax={100}></div>
            </div>
        } else if(self.state.mode == 'view') {
            form = <ViewCampaigns campaigns={self.state.campaigns}></ViewCampaigns>
        } else if(self.state.mode == 'reorder') {
            form = <ReorderCampaigns campaigns={self.state.campaigns} onSave={self.saveCampaignChanges.bind(self)}></ReorderCampaigns>
        }
        return form;
    }
    progressLoading () {
        let self = this;
        if(!self.state.loaded) {
            self.setState((state : Campaigns["state"], props) => ({
                loadProgress: state.loadProgress + Math.floor((100 - state.loadProgress) / 2)
            }));
            setTimeout(self.progressLoading.bind(self), 500);
        }
    }
    loadCampaigns () {
        let self = this;
        self.fetchCampaigns().then((res) => {
            self.setState({
                campaigns: res,
                loaded: true,
            });
        });
        setTimeout(self.progressLoading.bind(self), 500);
    }
    fetchCampaigns = async () => {
        let response = await fetch('/campaign/list');
        let json = await response.json();

        if(response.status !== 200) throw new Error('failed to get campaigns from server');

        return json;
    }
    render () {
        var self = this;
        let navs = [];
        let navInfo = [
            {name: 'View', modeName: 'view'},
            {name: 'Reorder', modeName: 'reorder'}
        ];
        for(let i = 0; i < navInfo.length; i++) {
            let nav = navInfo[i];
            let newNav;
            if(!self.state.loaded) {
                newNav = <a className="nav-link disabled">{nav.name}</a>
            } else if(nav.modeName == self.state.mode) {
                newNav = <a className="nav-link active" href="#" onClick={self.changeMode.bind(self,nav.modeName)}>{nav.name}</a>
            } else {
                newNav = <a className="nav-link" href="#" onClick={self.changeMode.bind(self,nav.modeName)}>{nav.name}</a>
            }
            navs.push(
                <li key={nav.modeName} className="nav-item">
                    {newNav}
                </li>
            );
        }
        let navigation = <ul className="nav nav-tabs">
            {navs}
        </ul>
        return <div className="container mt-4">
            {navigation}
            {self.getForm()}
        </div>
    }
}