import React, { Component } from 'react'

export default class SearchPage extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let body;
        if (this.props.isloading === true) {
            body = <h4>Fetching please wait...</h4>
        }
        else {
            body = <li key={this.props.B.ifsc}>{this.props.B.bank_name} - {this.props.B.ifsc}<div className="mainbody" style={{ height: "25vh", width: "90%", marginBottom: "2%" }} key={this.props.B.ifsc}>
                Bank IFSC = {this.props.B.ifsc}<br />
                Bank Id = {this.props.B.bank_id}<br />
                Branch = {this.props.B.branch}<br />
                Address = {this.props.B.address}<br />
                City = {this.props.B.city}<br />
                District = {this.props.B.district}<br />
                State = {this.props.B.state}<br />
            </div></li>
        }
        return (
            <div style={{ minHeight: "95vh", color: "#ffffff" }}>
                <h2 style={{ marginBottom: "2%" }}>Bank details with Bank ID = {this.props.match.params.id}</h2>
                <ol>{body}</ol>
            </div >
        )
    }
}
