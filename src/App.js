import React, {Component} from 'react';
import Login from './components/Login/Login'
import Home from './components/Home/Home'
import './App.css';
import db from './database'

class App extends Component {
    constructor(props) {
        super(props);
        console.log(db);
        this.state={
            loading:true,
            login:false,
            home:false,
            token:''
        };
        this.logout = this.logout.bind(this);
        this.getToken = this.getToken.bind(this);
    }
    componentDidMount(){
        let self=this;
        db.getItem('agent').then(function(value) {
            // This code runs once the value has been loaded
            // from the offline store.
            let dispLogin;
            console.log(value);
            dispLogin = value === null; //true if no data i.e login section is to be displayed
            self.setState({
                loading:false,
                login:dispLogin,
                home:!dispLogin,
                token:(!dispLogin)?value.token:''
            });
        }).catch(function(err) {
            // This code runs if there were any errors
            console.log(err);
        });

    }
    getToken(){
        return this.state.token;
    }
    logout(){
        let self=this;
        db.clear().then(function() {
            // Run this code once the database has been entirely deleted.
            console.log('Agent has been logged out');
            self.setState({
                login:true,
                home:false
            });
        }).catch(function(err) {
            // This code runs if there were any errors
            console.log(err);
        });
    }
    render() {
        return (
            <div>
                {
                    this.state.loading?
                        <div>
                            <h3 style={{textAlign:'center'}}>App is loading ...</h3>
                        </div>:''
                }
                {
                    this.state.login? <Login onLogin={
                        ()=>this.setState({
                            login:false,
                            home:true
                        })
                    }/>:''
                }
                {
                    this.state.home? <Home getToken={this.getToken} onLogout={this.logout}/>:''
                }
            </div>
        );
    }
}

export default App;
