import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import {Fab,Snackbar} from 'rmwc'
import './Home.css'
import find from 'lodash/indexOf'

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            cartdata:[],
            aadhardata:'',
            aadhar:false,
            itemqr:true,
            cartopen:false,
            snackbarIsOpen:false,
            transactionID:'',
            success:false,
            delay: 300,
            result: 'No result',
        };
        this.handleScan = this.handleScan.bind(this);
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
    render(){
        return(
        <div>
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
                    <h4 style={{textAlign:'center'}}>Scan aadhar card .</h4>
                    <p>Data : {this.state.aadhardata}</p>
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
                    <div className="row" style={{paddingTop:'20px',paddingLeft:'10px',paddingRight:'10px'}}>
                        <div className="col s6">
                            <Fab>shopping_cart</Fab>
                            <Fab mini style={{pointerEvents:'none',transform:'scale(0.7)translate(-20px,10px)',boxShadow:'none'}}><small style={{fontFamily:"roboto',sans-serif !important"}}>{this.state.cartdata.length}</small></Fab>
                        </div>
                        <div className="col s6" style={{textAlign:'right'}}>
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
                    <QrReader
                        delay={this.state.delay}
                        onError={this.handleError}
                        onScan={this.handleScan}
                        style={{width: '100%'}}
                        className="qr-container"
                        resolution={800}
                    />
                    <p>{this.state.result}</p>
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