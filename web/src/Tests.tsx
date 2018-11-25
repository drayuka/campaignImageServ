import * as React from "react";

export class Tests extends React.Component {
    constructor(props: any) {
        super(props);
        let self = this;
        this.state = {
            testOutput: ''
        };
        self.startRunTests();
    }
    state: {
        testOutput: string
    }
    startRunTests = async () => {
        var self = this;
        const response = await fetch('/tests');
        response.text().then( function (text) {
            self.setState({
                testOutput: text
            })
        });

    }
    render () {
        var self = this;
        return <div className='container' dangerouslySetInnerHTML={{__html: self.state.testOutput}}></div>
    }
}