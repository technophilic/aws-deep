import React, {Component} from 'react';
import './Login.css';
import {FormField, TextField, Grid, GridCell, Button, Card, Icon} from 'rmwc';

class Login extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1 style={{'textAlign':'center'}}>
                    <Icon style={{'fontSize':'100px'}}>store_mall_directory</Icon>
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
                                        <TextField label="Agent ID" id="agent" className="text-field"/>
                                    </FormField>
                                </GridCell>
                                <GridCell span="12">
                                    <FormField className="form-field">
                                        <TextField label="Aadhar ID" id="aadhar" className="text-field"/>
                                    </FormField>
                                </GridCell>
                                <GridCell span="12">
                                    <FormField className="form-field">
                                        <TextField label="Password" id="agent" type="password" className="text-field"/>
                                    </FormField>
                                </GridCell>
                                <GridCell span="12">
                                    <Button raised>Login</Button>
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
