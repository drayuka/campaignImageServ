import * as React from "react";
import { pageStates } from "./PageRoot";

export class NavBar extends React.Component {
    constructor(props: any) {
        super(props);
    }
    props: {
        onNav: (pageState: pageStates) => void,
        pageState: pageStates
    }
    render () {
        let self = this;

        let links = [];
        let linkTypes : {name: string, stateName: pageStates}[] = [
            {name: 'Simulate', stateName: 'simulate'},
            {name: 'Tests', stateName: 'tests'},
            {name: 'Campaigns', stateName: 'campaigns'},
            {name: 'Users', stateName: 'users'}
        ]
        for(let i = 0; i < linkTypes.length; i++) {
            let link = linkTypes[i];
            if(this.props.pageState == link.stateName) {
                links.push(<li className="nav-item active" onClick={(e) => this.props.onNav(link.stateName)}>
                    <a className="nav-link" href='#'>{link.name}</a>
                </li>);
            } else {
                links.push(<li className="nav-item" onClick={(e) => this.props.onNav(link.stateName)}>
                    <a className="nav-link" href='#'>{link.name}</a>
                </li>);
            }
        }

        return <header className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" onClick={(e) => this.props.onNav('simulate')}>Campaign Image Server</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav mr-auto">
                    {links}
                </ul>
            </div>
        </header>
    }
}