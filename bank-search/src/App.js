import React, { Component } from 'react';
import './App.css';
import BankPage from './Components/BankPage';
import SearchPage from './Components/SearchPage';
import { Route, Switch } from 'react-router-dom';

require('dotenv').config()



export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isloading: true,
            bankDetail: {}
        }
        this.addbank = this.addbank.bind(this);
    }

    addbank(b) {
        this.setState({
            bankDetail: b,
            isloading: false,
        })
    }

    render() {
        return (
            <div className="App">
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossOrigin="anonymous" />
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsnpm install --save react-router-domnpm install --save react-router-domnpm install --save react-router-domnpm install --save react-router-domVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossOrigin="anonymous" />
                <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossOrigin="anonymous"></script>

                <Switch>
                    <Route path="/" exact component={() => <BankPage addbank={this.addbank} />} />
                    <Route
                        exact path="/bank/:id"
                        render={(props) => <SearchPage {...props} B={this.state.bankDetail} isloading={this.state.isloading} />}
                    />
                    <Route>
                        <div> <h1>404.. Not Found!</h1> </div>
                    </Route>
                </Switch>
            </div >
        )
    }
}