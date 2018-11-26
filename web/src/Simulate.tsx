    import * as React from "react";

    export class Simulate extends React.Component {
        constructor(props: any) {
            super(props);
            let self = this;
            self.state = {
                userId: undefined,
                imageUserId: undefined
            };
        }
        state: {
            userId : number | undefined,
            imageUserId: number | undefined
        }
        getImage() {
            let self = this;
            self.setState((state: Simulate["state"], props) => ({
                imageUserId: state.userId
            }));
        }
        changeUserId(event:React.ChangeEvent<HTMLInputElement>) {
            let self = this;
            self.setState({
                userId: event.currentTarget.value
            });
        }
        render () {
            var self = this;
            let image;
            if(self.state.imageUserId) {
                image = <div className="card bg-dark text-dark">
                    <img className="card-img" src={"/campaign/image?userId=" + self.state.imageUserId + "&randTime=" + (new Date()).getTime()}></img>
                    <div className="card-img-overlay">
                        <h5 className="card-title">Campaign Image</h5>
                        <p className="card-text">Campaign Image for user with Id of: {self.state.userId}</p>
                    </div>
                </div>
            }
            return <div className="container">
                <form>
                    <div className="form-group">
                        <label htmlFor="userIdInput">User Id</label>
                        <input type="text" className="form-control" id="userId" aria-describedby="userIdHelp" placeholder="Enter UserId" onChange={self.changeUserId.bind(self)}></input>
                        <small id="userIdHelp" className="form-text text-muted">User id of user you would like to test</small>
                    </div>
                    <button type="submit" className="btn btn-primary" onClick={self.getImage.bind(self)}>Submit</button>
                </form>

                {image}
            </div>
        }
    }