import React, { Component } from 'react'

export default class SearchPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            List: [],
            isloaded: false,
        }
        this.renderlist = this.renderlist.bind(this);
    }

    renderlist() {
        this.setState({ isloaded: true });
        var templist = [];
        for (var keys in this.props.BankList) {
            for (var i = 0; i < this.props.BankList[keys].length; i++) {
                if (parseInt(this.props.BankList[keys][i].bank_id) === parseInt(this.props.match.params.id)) {
                    templist.push(this.props.BankList[keys][i]);
                }
            }
        }
        this.setState({ List: templist });
    }

    render() {
        let body;
        if (this.props.isloading === true && this.state.isloaded === false) {
            body = <h4>Fetching please wait...</h4>
        }
        else {
            if (this.state.isloaded === false) this.renderlist();
            body = this.state.List.map((B) => {
                return <li key={B.ifsc}>{B.bank_name} - {B.ifsc}<div className="mainbody" style={{ height: "25vh", width: "90%", marginBottom: "2%" }} key={B.ifsc}>
                    Bank IFSC = {B.ifsc}<br />
                    Bank Id = {B.bank_id}<br />
                    Branch = {B.branch}<br />
                    Address = {B.address}<br />
                    City = {B.city}<br />
                    District = {B.district}<br />
                    State = {B.state}<br />
                </div></li>
            })
        }
        return (
            <div style={{ minHeight: "95vh", color: "#ffffff" }}>
                <h2 style={{ marginBottom: "2%" }}>Bank details with Bank ID = {this.props.match.params.id}</h2>
                <ol>{body}</ol>
            </div >
        )
    }
}
