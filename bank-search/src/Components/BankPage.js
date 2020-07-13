import React, { Component } from 'react'
import axios from 'axios';



export default class BankPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isloading: -1,
            Banklist: {},
            SelectedCity: "MUMBAI",
            Cities: ["MUMBAI", "DELHI", "KOLKATA", "BANGALORE", "CUTTACK"],
            Rows: 5,
            Onscreenlist: [],
            Pagenumber: 0,
            TotalPages: 0,
        }
        this.refreshlist = this.refreshlist.bind(this);
        this.domatch = this.domatch.bind(this);
    }

    domatch(text, search) {
        if (text.length < search.length) return false;
        text = text.toString();
        search = search.toString();
        var a = text.toLowerCase();
        var b = search.toLowerCase();
        for (var i = 0; i < search.length; i++) {
            if (a[i] != b[i]) return false;
        }
        return true;
    }

    refreshlist() {
        var banklist = this.state.Banklist[this.state.SelectedCity];

        var search = document.getElementById("searchinput").value;

        if (search != "") {
            var templist = [];
            for (var i = 0; i < banklist.length; i++) {
                for (var keys in banklist[i]) {
                    if (this.domatch(banklist[i][keys], search)) {
                        templist.push(banklist[i]);
                        break;
                    }
                }
            }
            banklist = templist;
        }

        var totalP = parseInt(banklist.length / this.state.Rows);
        var currpage = this.state.Pagenumber;
        currpage = Math.max(0, currpage);
        currpage = Math.min(totalP, currpage);
        this.setState({
            TotalPages: totalP,
            Pagenumber: currpage
        })
        if (banklist.length % this.state.Rows > 0) totalP++;
        var newlist = []
        for (var i = currpage * this.state.Rows; i < currpage * this.state.Rows + this.state.Rows; i++) {
            if (i >= banklist.length) break;
            newlist.push(banklist[i]);
        }
        this.setState({ Onscreenlist: newlist });
    }

    componentDidMount() {
        var done = -this.state.Cities.length;
        var banklist = {};
        for (var i = 0; i < this.state.Cities.length; i++) {

            banklist[this.state.Cities[i]] = [];

            axios.get(process.env.REACT_APP_BankListAPI + this.state.Cities[i])
                .then((response) => {
                    response = response.data;

                    done++; this.setState({ isloading: done });

                    banklist[response[0].city] = response;
                    this.setState({ Banklist: banklist }, () => { this.refreshlist(); });
                })
                .catch(function (error) {
                    alert(error);
                })
        }
        this.setState({ Banklist: banklist });
    }

    render() {
        let Datatobeshown;
        if (this.state.isloading !== 0) { Datatobeshown = <div><h4 style={{ minHeight: "62.8vh", marginBottom: "5px" }}>Fetching Data...</h4></div> }
        else if (this.state.Onscreenlist.length == 0) {
            Datatobeshown = <h4 style={{ minHeight: "62.8vh", marginBottom: "5px" }}>Nothing to Show... :(</h4>
        } else {
            Datatobeshown = <div style={{ minHeight: "62.8vh", marginBottom: "5px" }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Actions</th>
                            <th>Bank Name</th>
                            <th>IFSC code</th>
                            <th>Bank ID</th>
                            <th>Branch</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.Onscreenlist.map((B) => {
                            return <tr key={B.ifsc}>
                                <td>Fav?</td>
                                <td style={{ width: "30%" }}>{B.bank_name}</td>
                                <td style={{ width: "10%" }}>{B.ifsc}</td>
                                <td style={{ width: "10%" }}>{B.bank_id}</td>
                                <td style={{ width: "30%" }}>{B.branch}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        }
        return (
            <div style={{ height: "100%" }}>
                <select className="form-control selectbox" onChange={(e) => {
                    this.setState({ SelectedCity: e.target.value, Pagenumber: 0 }, () => { this.refreshlist(); })
                }} >
                    {this.state.Cities.map((c) => { return <option key={c}>{c}</option> })}
                </select>

                <div className="mainbody">
                    <div className="mb" style={{ minHeight: 36 }}>
                        <span className="leftside">List of banks in {this.state.SelectedCity}</span>
                        <span className="rightside">
                            <div className="btn-group">
                                <input id="searchinput" type="search" className="form-control" placeholder="Search" onChange={() => this.refreshlist()} />
                                <span id="searchclear" className="glyphicon glyphicon-remove-circle" onClick={
                                    () => { document.getElementById("searchinput").value = ""; this.refreshlist(); }
                                }></span>
                            </div>
                        </span>
                    </div>

                    {Datatobeshown}

                    <div style={{ display: "block", }}>
                        <div className="sameline" style={{ width: "32%" }}>
                            <div className="sameline mr" >Rows per page: </div>
                            <select className="form-control sameline" style={{ width: "40%" }}
                                onChange={(e) => {
                                    this.setState({ Rows: parseInt(e.target.value) }, () => { this.refreshlist(); })
                                }} >
                                <option>5</option>
                                <option>10</option>
                                <option>15</option>
                            </select>
                        </div>
                        <div className="sameline" style={{ width: "50%" }}>
                            <img src={require('../chevron-left.svg')} alt="1" className="App-logo" onClick={() => {
                                console.log("Clicked");
                                this.setState({ Pagenumber: 0 }, () => { this.refreshlist(); })
                            }} />
                            <img src={require('../chevron-left (1).svg')} alt="2" className="App-logo" onClick={() => {
                                this.setState({ Pagenumber: Math.max((parseInt(this.state.Pagenumber) - 1), 0) }, () => { this.refreshlist(); });
                            }} />

                            <div className="sameline" style={{ width: "30%", textAlign: "center" }}>Page number : {this.state.Pagenumber} of {this.state.TotalPages}</div>

                            <img src={require('../chevron-right.svg')} alt="3" className="App-logo" onClick={() => {
                                this.setState({ Pagenumber: Math.min((parseInt(this.state.Pagenumber) + 1), this.state.TotalPages) }, () => { this.refreshlist(); });
                            }} />
                            <img src={require('../chevron-right (1).svg')} alt="4" className="App-logo" onClick={() => {
                                this.setState({ Pagenumber: this.state.TotalPages }, () => { this.refreshlist(); })
                            }} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
