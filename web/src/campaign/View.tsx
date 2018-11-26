import * as React from "react";
import { campaign } from "../Campaigns";

export class ViewCampaigns extends React.Component {
    constructor(props: any) {
        super(props);
    }
    props : {
        campaigns: campaign[]
    }
    render () {
        let self = this;
        let rows = [];
        let columnHeaders = 
        <thead key="columnNames">
            <tr>
                <th scope="col">Id</th>
                <th scope="col">Priority</th>
                <th scope="col">Type</th>
                <th scope="col">Criteria</th>
                <th scope="col">Image</th>
                <th scope="col"></th>
            </tr>
        </thead>
    for(let i = 0; i < self.props.campaigns.length; i++) {
        let campaign = self.props.campaigns[i];
        rows.push(
            <tr key={campaign.id}>
                <th scope="row">{campaign.id}</th>
                <td>{campaign.priority}</td>
                <td>{campaign.type}</td>
                <td>{campaign.criteria}</td>
                <td>{campaign.image}</td>
            </tr>
        )
    }

    return <table className="table">
        {columnHeaders}
        <tbody>
            {rows}
        </tbody>
    </table>;
    }
}