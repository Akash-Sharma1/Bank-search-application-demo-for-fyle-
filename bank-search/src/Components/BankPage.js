import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';

export default class BankPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            Favorites: {},
            SelectedCity: "MUMBAI",
            Cities: ["MUMBAI", "DELHI", "KOLKATA", "BANGALORE", "CUTTACK"],
            Rows: 5,
            Onscreenlist: [],
            Pagenumber: 0,
            TotalPages: 0,
            isloading: true,
            Banklist: [],
        }
        this.changebank = this.changebank.bind(this);
        this.refreshlist = this.refreshlist.bind(this);
        this.domatch = this.domatch.bind(this);
        this.changefav = this.changefav.bind(this);
        this.matchbysearch = this.matchbysearch.bind(this);
    }

    changebank() {
        axios.get(process.env.REACT_APP_BankListAPI + this.state.SelectedCity)
            .then((response) => {
                response = response.data;
                this.setState({
                    Banklist: response,
                    isloading: false
                }, () => this.refreshlist())
            })
            .catch(function (error) {
                alert(error);
            })
    }

    changefav(ifsc, b) {
        var newfav = this.state.Favorites;
        newfav[ifsc] = b
        this.setState({
            Favorites: newfav
        })
    }

    domatch(text, search) {
        if (text.length < search.length) return false;
        text = text.toString();
        search = search.toString();
        var a = text.toLowerCase();
        var b = search.toLowerCase();
        for (var i = 0; i < search.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    matchbysearch(BankList) {
        var search = "";
        if (document.getElementById("searchinput") !== null) search = document.getElementById("searchinput").value;

        if (search !== "") {
            var templist = [];
            for (var i = 0; i < BankList.length; i++) {
                for (var keys in BankList[i]) {
                    if (this.domatch(BankList[i][keys], search)) {
                        templist.push(BankList[i]);
                        break;
                    }
                }
            }
            BankList = templist;
        }
        return BankList
    }

    refreshlist() {
        var BankList = this.state.Banklist;
        console.log(BankList);
        if (typeof (BankList) === "undefined") return;

        BankList = this.matchbysearch(BankList);

        var totalP = parseInt(BankList.length / this.state.Rows);
        if (BankList.length % this.state.Rows == 0) totalP--;
        var currpage = this.state.Pagenumber;
        currpage = Math.max(0, currpage);
        currpage = Math.min(totalP, currpage);

        this.setState({
            TotalPages: totalP,
            Pagenumber: currpage,
            isloaded: true,
        })

        if (BankList.length % this.state.Rows > 0) totalP++;
        var newlist = []
        for (var i = currpage * this.state.Rows; i < currpage * this.state.Rows + this.state.Rows; i++) {
            if (i >= BankList.length) break;
            newlist.push(BankList[i]);
        }
        this.setState({ Onscreenlist: newlist });
    }

    componentDidMount() {
        this.changebank();
    }

    render() {
        let Datatobeshown;
        if (this.state.isloading === true) {
            Datatobeshown = <div><h4 className="initialentry">Fetching Data...</h4></div>
        }
        else if (this.state.Onscreenlist.length === 0) {
            Datatobeshown = <h4 className="initialentry">Nothing to Show... :(</h4>
        } else {
            Datatobeshown = <div className="initialentry">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Mark</th>
                            <th>Bank Name</th>
                            <th>IFSC code</th>
                            <th>Bank ID</th>
                            <th>Branch</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.Onscreenlist.map((B) =>
                            <OneRow key={B.ifsc} B={B} fav={this.state.Favorites[B.ifsc]} changefav={this.changefav} addbank={this.props.addbank} />)}
                    </tbody>
                </table>
            </div>
        }
        return (
            <div style={{ height: "100%" }}>
                <select className="form-control selectbox" onChange={(e) => {
                    if (this.state.SelectedCity == e.target.value) return;
                    this.setState({ SelectedCity: e.target.value, Pagenumber: 0, isloading: true }, () => {
                        this.changebank();
                    })
                }} >
                    {this.state.Cities.map((c) => { return <option key={c}>{c}</option> })}
                </select>

                <div className="mainbody">
                    <div className="mb" style={{ minHeight: 36 }}>
                        <span className="leftside">List of banks in {this.state.SelectedCity}</span>
                        <span className="rightside">
                            <div className="btn-group">
                                <input id="searchinput" type="search" className="form-control" disabled={!this.state.isloaded} placeholder="Search" onChange={() => this.refreshlist()} />
                                <span id="searchclear" className="glyphicon glyphicon-remove-circle" onClick={
                                    () => { document.getElementById("searchinput").value = ""; this.refreshlist(); }
                                }></span>
                            </div>
                        </span>
                    </div>

                    {Datatobeshown}

                    <div style={{ display: "block", }}>
                        <div className="sameline" style={{ width: "32%" }}>
                            <div className="sameline mr">Rows per page: </div>
                            <select className="form-control" style={{ display: "inline-block", width: "40%" }}
                                onChange={(e) => {
                                    this.setState({ Rows: parseInt(e.target.value) }, () => { this.refreshlist(); })
                                }} >
                                <option>5</option>
                                <option>10</option>
                                <option>15</option>
                            </select>
                        </div>
                        <div className="sameline" style={{ width: "60%" }}>
                            <img src={require('../chevron-left.svg')} alt="1" className="App-logo"
                                style={{ opacity: (this.state.Pagenumber == 0) ? "30%" : "100%" }}
                                onClick={() => {
                                    this.setState({ Pagenumber: 0 }, () => { this.refreshlist(); })
                                }} />
                            <img src={require('../chevron-left (1).svg')} alt="2" className="App-logo"
                                style={{ opacity: (this.state.Pagenumber == 0) ? "30%" : "100%" }}
                                onClick={() => {
                                    this.setState({ Pagenumber: Math.max((parseInt(this.state.Pagenumber) - 1), 0) }, () => { this.refreshlist(); });
                                }} />

                            <div className="sameline" style={{ width: "30%", textAlign: "center" }}>Page number : {this.state.Pagenumber} of {this.state.TotalPages}</div>

                            <img src={require('../chevron-right.svg')} alt="3" className="App-logo"
                                style={{ opacity: (this.state.Pagenumber == this.state.TotalPages) ? "30%" : "100%" }}
                                onClick={() => {
                                    this.setState({ Pagenumber: Math.min((parseInt(this.state.Pagenumber) + 1), this.state.TotalPages) }, () => { this.refreshlist(); });
                                }} />
                            <img src={require('../chevron-right (1).svg')} alt="4" className="App-logo"
                                style={{ opacity: (this.state.Pagenumber == this.state.TotalPages) ? "30%" : "100%" }}
                                onClick={() => {
                                    this.setState({ Pagenumber: this.state.TotalPages }, () => { this.refreshlist(); })
                                }} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export class OneRow extends Component {
    componentDidMount() {
        if (typeof (this.props.fav) === "undefined") {
            this.props.changefav(this.props.B.ifsc, false);
        }
    }

    render() {
        let image = <img src={require('../create-new.svg')} alt="34" className="App-logo2" onClick={() => {
            this.props.changefav(this.props.B.ifsc, !this.props.fav);
        }} />;
        if (this.props.fav) image = <img src={require('../check-mark.svg')} alt="44" className="App-logo2" onClick={() => {
            this.props.changefav(this.props.B.ifsc, !this.props.fav);
        }} />;
        return (
            <tr>
                <td style={{ width: "5%" }} >
                    {image}
                </td>
                <td style={{ width: "40%" }} ><Link onClick={() => this.props.addbank(this.props.B)} style={{ textDecoration: "none", color: "#282c34" }} to={"/bank/" + this.props.B.bank_id}> {this.props.B.bank_name}  </Link></td>
                <td style={{ width: "10%" }}>{this.props.B.ifsc}</td>
                <td style={{ width: "10%" }}>{this.props.B.bank_id}</td>
                <td style={{ width: "30%" }}>{this.props.B.branch}</td>
            </tr>
        )
    }
}
