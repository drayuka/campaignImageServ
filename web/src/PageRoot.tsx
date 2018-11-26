import * as React from "react";
import {NavBar} from "./NavBar";
import {Simulate} from "./Simulate";
import {Tests} from "./Tests";
import {Campaigns} from "./Campaigns";

export type pageStates = 'campaigns' | 'tests' | 'simulate'

export class PageRoot extends React.Component {
    constructor(props: any) {
        super(props);
        let self = this;
        self.state = {
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
        if(self.state.pageState == 'simulate') {
            current = <Simulate />
        } else if(self.state.pageState == 'tests') {
            current = <Tests />
        } else if(self.state.pageState == 'campaigns') {
            current = <Campaigns />
        } else {
            current = <div>error</div>
        }
        return <div>
            <NavBar onNav={self.onNav.bind(self)} pageState={self.state.pageState}></NavBar>
            {current}
        </div>

    }
}