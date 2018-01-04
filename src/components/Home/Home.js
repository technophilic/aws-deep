import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import {Fab,
    Snackbar,
    Toolbar,
    TemporaryDrawer,
    TemporaryDrawerHeader,
    TemporaryDrawerContent,
    ToolbarSection,
    ToolbarTitle,
    ToolbarMenuIcon,
    List,
    ListItem,
    ListItemText,
    ListItemStartDetail} from 'rmwc'
import './Home.css'
import find from 'lodash/indexOf'
import done from './done.svg'
navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            cartdata:[],
            aadhardata:'',
            aadhar:false,
            itemqr:false,
            cartopen:false,
            snackbarIsOpen:false,
            transactionID:'Z07BSNEWI43',
            success:true,
            tempOpen:false,
            delay: 300,
            result: 'No result',
        };
        console.log(props);


        this.handleScan = this.handleScan.bind(this);
        this.logout = this.logout.bind(this,props.onLogout);
        this.sendData = this.sendData.bind(this);
        this.reset = this.reset.bind(this);
    }
    logout(cb){
        this.reset();
        console.log('local logout called !');
        cb();
    }
    handleScan(data){
        if(data){
            if (navigator.vibrate) {
                navigator.vibrate(300);
            }
            if(this.state.aadhar){
                this.setState({
                    aadhardata:data,
                    aadhar:false,
                    itemqr:true
                });
            }
            if(this.state.itemqr){
                let cartDat=this.state.cartdata;
                let search=find(cartDat,data);
                console.log(find,search);
                if(search!==-1){
                    this.setState({snackbarIsOpen: true})
                }
                else{
                    cartDat.push(data);
                    this.setState({
                        cartdata:cartDat
                    });
                    console.log(this.state.cartdata);
                }

            }
        }
    }
    handleError(err){
        console.error(err)
    }
    reset(){
        this.setState({
            cartdata:[],
            aadhardata:'',
            aadhar:true,
            itemqr:false,
            cartopen:false,
            snackbarIsOpen:false,
            transactionID:'',
            success:false,
            tempOpen:false,
            delay: 300,
            result: 'No result',
        });
    }
    sendData(){

    }
    render(){
        return(
        <div>
            {/* With multiple sections */}
            <Toolbar style={{backgroundColor:'#ff4081'}}>
                <ToolbarSection alignStart>
                    <ToolbarMenuIcon use="menu" onClick={() => this.setState({tempOpen: !this.state.tempOpen})}/>
                    <ToolbarTitle>SubConn</ToolbarTitle>
                </ToolbarSection>
            </Toolbar>
            <TemporaryDrawer
                open={this.state.tempOpen}
                onClose={() => this.setState({tempOpen: false})}
            >
                <TemporaryDrawerHeader style={{ backgroundColor: '#ff4081',color:'white' }}>
                    Menu
                </TemporaryDrawerHeader>
                <TemporaryDrawerContent>
                    <ListItem onClick={this.reset}>
                        <ListItemStartDetail>home</ListItemStartDetail>
                        <ListItemText>Home</ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemStartDetail>compare_arrows</ListItemStartDetail>
                        <ListItemText>Transaction History</ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemStartDetail>warning</ListItemStartDetail>
                        <ListItemText>Complaints</ListItemText>
                    </ListItem>
                    <ListItem onClick={this.logout}>
                        <ListItemStartDetail>input</ListItemStartDetail>
                        <ListItemText>Logout</ListItemText>
                    </ListItem>
                </TemporaryDrawerContent>
            </TemporaryDrawer>
            {this.state.aadhar?
                <div>
                    <QrReader
                        delay={this.state.delay}
                        onError={this.handleError}
                        onScan={this.handleScan}
                        style={{width: '100%'}}
                        className="qr-container"
                        resolution={800}
                    />
                    <div className="row">
                        <h4 style={{textAlign:'center'}}>Scan aadhar card of customer</h4>
                    </div>
                </div>:''
            }
            {this.state.itemqr?
                <div>
                    <QrReader
                        delay={this.state.delay}
                        onError={this.handleError}
                        onScan={this.handleScan}
                        style={{width: '100%'}}
                        className="qr-container"
                        resolution={800}
                    />
                    <div className="row">
                        <h4 style={{textAlign:'center'}}>Scan Qr code of the items</h4>
                    </div>
                    <div className="row" style={{position:'absolute',bottom:'10px',width:'100%'}}>
                        <div className="col s4">
                            <Fab>clear</Fab>
                        </div>
                        <div className="col s4" style={{textAlign:'center'}}>
                            <Fab>shopping_cart</Fab>
                            <Fab mini style={{pointerEvents:'none',transform:'scale(0.7)translate(-20px,30px)',boxShadow:'none',position:'absolute'}}><small style={{fontFamily:"roboto',sans-serif !important"}}>{this.state.cartdata.length}</small></Fab>
                        </div>
                        <div className="col s4" style={{textAlign:'right'}}>
                            <Fab>check</Fab>
                        </div>
                    </div>
                </div> :''
            }
            {this.state.cartopen?
                <div>

                </div> :''
            }
            {this.state.success?
                <div>
                    <div className="row" style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'100%'}}>
                        <div className="col s8 push-s2 m6 push-m3">
                            <div className="row" style={{width:'70%',margin:'0 auto'}}>
                                <img src={done} style={{width:'100%',height:'auto'}} alt=""/>
                            </div>
                            <div className="row" style={{textAlign:'center'}}>
                                <h4>Transaction successful</h4>
                                <h6>ID : {this.state.transactionID}</h6>
                            </div>
                        </div>
                    </div>
                    <div style={{position:'absolute',bottom:'15px','right':'15px'}}>
                        <Fab onClick={this.reset}>check</Fab>
                    </div>
                </div> :''
            }
            <Snackbar
                show={this.state.snackbarIsOpen}
                onClose={evt => this.setState({snackbarIsOpen: false})}
                message="This item is already scanned"
            />
        </div>
        )
    }
}
export default Home;