import React, { Component } from 'react';
import './App.css';
import BankPage from './Components/BankPage';
import SearchPage from './Components/SearchPage';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';

require('dotenv').config()



export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      MainBankList: [],
      isloading: true,
      Cities: ["MUMBAI", "DELHI", "KOLKATA", "BANGALORE", "CUTTACK"],
    }
  }

  componentDidMount() {
    var done = -this.state.Cities.length;
    var banklist = {};
    for (var i = 0; i < this.state.Cities.length; i++) {
      banklist[this.state.Cities[i]] = [];
      axios.get(process.env.REACT_APP_BankListAPI + this.state.Cities[i])
        .then((response) => {
          response = response.data; done++;
          banklist[response[0].city] = response;
          if (done === 0) {
            this.setState({
              MainBankList: banklist,
              isloading: false
            })
          }

        })
        .catch(function (error) {
          alert(error);
        })
    }
  }

  render() {
    return (
      <div className="App">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsnpm install --save react-router-domnpm install --save react-router-domnpm install --save react-router-domnpm install --save react-router-domVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossOrigin="anonymous" />
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossOrigin="anonymous"></script>

        <Switch>
          <Route path="/" exact component={() => <BankPage Cities={this.state.Cities} BankList={this.state.MainBankList} isloading={this.state.isloading} />} />
          <Route
            exact path="/bank/:id"
            render={(props) => <SearchPage {...props} BankList={this.state.MainBankList} isloading={this.state.isloading} />}
          />
          <Route>
            <div> <h1>404.. Not Found!</h1> </div>
          </Route>
        </Switch>
      </div >
    )
  }
}