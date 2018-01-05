import React, {Component} from 'react';
import './Login.css';
import {FormField, TextField, Grid, GridCell, Button, Card, Icon} from 'rmwc';
import db from '../../database'
import logo from './icon.png'
class Login extends Component {
    constructor(props) {
        super(props);
        this.state={
            id:'',
            password:''
        };
        this.login = this.login.bind(this,props.onLogin);
        this.store = this.store.bind(this);
    }
    login(cb){
        let self=this;
        let formData = new FormData();

        formData.append("uid",this.state.id);
        formData.append("password",this.state.password);

        let xhr=new XMLHttpRequest();
        xhr.open('POST','https://subconn.herokuapp.com/agent/login',true);
        xhr.onload=function () {
            console.log(xhr.responseText);
            self.store(xhr.responseText,cb);
        };
        xhr.send(formData);
    }
    store(data,cb){
        let x=JSON.parse(data);
        if(x.status==="200"){
            db.setItem('agent', x).then(function (value) {
                // Do other things once the value has been saved.
                console.log('Logged in and stored in db');
                console.log(value);
                cb(x.token);
            }).catch(function(err) {
                // This code runs if there were any errors
                console.log(err);
            });
        }

    }
    render() {
        return (
            <div>
                <h1 style={{'textAlign':'center'}}>
                    <img src={logo} style={{height:'auto',width:'100px'}} alt=""/>
                </h1>
                <h1 style={{'textAlign':'center'}}>
                    Subconn - Login
                </h1>
                <Grid>
                    <GridCell desktop="6" phone="4">
                        <Card className="form-card">
                            <Grid>
                                <GridCell span="12">
                                    <FormField className="form-field">
                                        <TextField label="Aadhar ID" id="aadhar" className="text-field" value={this.state.id} onChange={event => this.setState({id: event.target.value})}/>
                                    </FormField>
                                </GridCell>
                                <GridCell span="12">
                                    <FormField className="form-field">
                                        <TextField label="Password" id="agent" type="password" className="text-field" value={this.state.password} onChange={event => this.setState({password: event.target.value})}/>
                                    </FormField>
                                </GridCell>
                                <GridCell span="12">
                                    <Button raised onClick={this.login} style={{ backgroundColor: '#ff4081',color:'white' }}>Login</Button>
                                </GridCell>
                            </Grid>
                        </Card>
                    </GridCell>
                </Grid>
            </div>
        );
    }
}

export default Login;
