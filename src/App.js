import React, {Component} from 'react';
import Login from './components/Login/Login'
import Home from './components/Home/Home'
import Loading from './components/Loading/Loading'
import './App.css';
import db from './database'
import Snackbar from 'rmwc/Snackbar'

class App extends Component {
    constructor(props) {
        super(props);
        console.log(db);
        this.state={
            // loading:true,
            login:false,
            home:true,
            tempOpen:false,
            notif:'',
            token:'',
            delay: 300
        };
        this.logout = this.logout.bind(this);
        this.getToken = this.getToken.bind(this);
    }
    /*componentDidMount(){
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

    }*/
    getToken(){
        return this.state.token;
    }
    logout(){
        let self=this;
        let formData = new FormData();

        formData.append("token",this.getToken());

        let xhr=new XMLHttpRequest();
        xhr.open('POST','https://subconn.herokuapp.com/agent/logout',true);
        xhr.onload=function () {
            let res=JSON.parse(xhr.responseText);
            if(res.status===200){
                db.clear().then(function() {
                    // Run this code once the database has been entirely deleted.
                    console.log('Agent has been logged out');
                    self.setState({
                        snackbarIsOpen:true,
                        notif:'Logged out successfully !',
                        login:true,
                        home:false
                    });
                    setTimeout(()=>self.setState({
                        snackbarIsOpen:false
                    }),200)
                }).catch(function(err) {
                    // This code runs if there were any errors
                    console.log(err);
                });
            }
            else {
                self.setState({
                    snackbarIsOpen:true,
                    notif:"We couldn't log you out !",
                });
            }
            console.log(xhr.responseText);
        };
        xhr.send(formData);
    }
    render() {
        return (
            <div>
                {
                    this.state.loading?
                        <Loading/>:''
                }
                {
                    this.state.login? <Login onLogin={
                        (token)=>this.setState({
                            login:false,
                            home:true,
                            token:token
                        })
                    }/>:''
                }
                {
                    this.state.home? <Home getToken={this.getToken} onLogout={this.logout}/>:''
                }
                <Snackbar
                    show={this.state.snackbarIsOpen}
                    onClose={evt => this.setState({snackbarIsOpen: false,notif:''})}
                    message={(this.state.notif==='')?"Logged out":this.state.notif}
                    dismissesOnAction="true"
                />
            </div>
        );
    }
}

export default App;
