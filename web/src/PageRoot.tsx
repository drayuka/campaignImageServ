import * as React from "react";
import {NavBar} from "./NavBar";
import {Simulate} from "./Simulate";
import {Tests} from "./Tests";
import {Users} from "./Users";
import {Campaigns} from "./Campaigns";

export type pageStates = 'users' | 'campaigns' | 'tests' | 'simulate'

export class PageRoot extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {
            pageState: 'simulate'
        }
    }
    state: {
        pageState: pageStates
    }
    onNav (destination: pageStates) {
        let self = this;
        console.log('navigating to ' + destination);
        self.setState({pageState: destination});
    }
    render () {
        let self = this;
        let current;
        if(this.state.pageState == 'simulate') {
            current = <Simulate />
        } else if(self.state.pageState == 'tests') {
            current = <Tests />
        } else if(self.state.pageState == 'campaigns') {
            current = <Campaigns />
        } else if(self.state.pageState == 'users') {
            current = <Users />
        } else {
            current = <div>error</div>
        }
        return <div>
            <NavBar onNav={this.onNav.bind(this)} pageState={this.state.pageState}></NavBar>
            {current}
        </div>

    }
}