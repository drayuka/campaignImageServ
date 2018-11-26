import * as React from "react";
import {campaign} from "../Campaigns";
import * as _ from "lodash";


export class ReorderCampaigns extends React.Component {
    constructor(props: any) {
        super(props);
        let self = this;
        let sorted = _.cloneDeep(self.props.campaigns).sort((a,b) => a['priority'] - b['priority']);
        self.state = {
            displayedCampaigns: sorted
        }
    }
    state: {
        displayedCampaigns: campaign[]
    }
    props: {
        campaigns: campaign[],
        onSave: (campaigns: campaign[]) => void
    }
    swapPriority(a: campaign, b: campaign) {
        let self = this;
        self.setState((state: ReorderCampaigns['state'], props) => {
            let newCampaigns = _.cloneDeep(state.displayedCampaigns);
            
            for(let i = 0; i < newCampaigns.length; i++) {
                if(newCampaigns[i].id == a.id) {
                    newCampaigns[i].priority = b.priority;
                } else if(newCampaigns[i].id == b.id) {
                    newCampaigns[i].priority = a.priority;
                }
            }
            newCampaigns.sort((a,b) => a['priority'] - b['priority']);
            return {
                displayedCampaigns: newCampaigns
            }
        });
    }
    render () {
        let self = this;
        let rows = [];
        let columnHeaders = 
        <thead key="columnNames">
            <tr>
                <th scope="col"></th>
                <th scope="col">Id</th>
                <th scope="col">Type</th>
                <th scope="col">Criteria</th>
                <th scope="col">Image</th>
            </tr>
        </thead>
        for(let i = 0; i < self.state.displayedCampaigns.length; i++) {
            let campaign = self.state.displayedCampaigns[i];
            let next = self.state.displayedCampaigns[i + 1];
            let prev = self.state.displayedCampaigns[i - 1];

            let upButton = <button type="button" className="btn btn-default" onClick={self.swapPriority.bind(self, campaign, prev)}>
                <span>Up</span>
            </button>  

            let downButton = <button type="button" className="btn btn-default" onClick={self.swapPriority.bind(self, campaign, next)}>
                <span>Down</span>
            </button>  


            if(i == 0) {
                upButton = <button type="button" className="btn btn-default" style={{visibility:"hidden"}}>
                    <span>Up</span>
                </button>
            } else if(i == self.state.displayedCampaigns.length -1) {
                downButton = <button type="button" className="btn btn-default" style={{visibility:"hidden"}}>
                    <span>Down</span>
                </button>
            }
            rows.push(
                <tr key={campaign.id}>
                    <th>
                        {upButton}
                        {downButton}
                    </th>
                    <td scope="row">{campaign.id}</td>
                    <td>{campaign.type}</td>
                    <td>{campaign.criteria}</td>
                    <td>{campaign.image}</td>
                </tr>
            )
        }

        return <div className="container">
            <table className="table">
                {columnHeaders}
                <tbody>
                    {rows}
                </tbody>
            </table>
            <button type="button" className="btn btn-default" onClick={(e) => self.props.onSave(self.state.displayedCampaigns)}>Save</button>
        </div>;
    }
}