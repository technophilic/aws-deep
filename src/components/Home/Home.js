import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import Webcam from 'react-webcam';
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
    Button,
    Icon,
    TextField,
    ListItem,
    ListItemText,
    ListItemStartDetail,
    Dialog,
    DialogRoot,
    DialogSurface,
    DialogHeader,
    DialogHeaderTitle,
    DialogBody,
    DialogFooter,
    DialogFooterButton,
    DialogBackdrop,
    GridList,
    GridTile,
    GridTilePrimary,
    GridTilePrimaryContent,
    GridTileSecondary,
    GridTileTitle,
    Card,
    CardPrimary,
    CardTitle,
    CardSubtitle,
} from 'rmwc'
import './Home.css'
import find from 'lodash/indexOf'
import done from './done.svg'
import weather from './weather.png'
import Loading from '../Loading/Loading'
import trans from '../../sample'
navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            cartdata:[],
            aadhardata:'',
            inventorydata:[],
            complaintqr:'',
            complainttext:'',
            aadhar:true,
            itemqr:false,
            cartopen:false,
            snackbarIsOpen:false,
            loading:false,
            transactionID:trans,
            complaints:false,
            inventory:false,
            success:false,
            tempOpen:false,
            notif:'',
            delay: 300,
            result: 'No result',
        };
        console.log(props);

        this.logout = this.logout.bind(this,props.onLogout);
        this.sendData = this.sendData.bind(this,props.getToken);
        this.sendComplaint = this.sendComplaint.bind(this,props.getToken);
        this.complaints = this.complaints.bind(this,props.getToken);
        this.reset = this.reset.bind(this);
        this.loading = this.loading.bind(this);
        this.getInventory = this.getInventory.bind(this,props.getToken);
    }
    logout(cb){
        this.reset();
        console.log('local logout called !');
        cb();
    }
    loading(){
        this.setState({
            aadhar:false,
            itemqr:false,
            cartopen:false,
            complaints:false,
            inventory:false,
            tempOpen:false,
            success:false,
            loading:true
        });
    }
    // handleScan(data){
    //     if(data){
    //         if (navigator.vibrate) {
    //             navigator.vibrate(300);
    //         }
    //         if(this.state.aadhar){
    //             this.setState({
    //                 aadhardata:data,
    //                 aadhar:false,
    //                 itemqr:true
    //             });
    //         }
    //         else if(this.state.itemqr){
    //             let cartDat=this.state.cartdata;
    //             let search=find(cartDat,data);
    //             console.log(find,search);
    //             if(search!==-1){
    //                 this.setState({snackbarIsOpen: true})
    //             }
    //             else{
    //                 cartDat.push(data);
    //                 this.setState({
    //                     cartdata:cartDat
    //                 });
    //                 console.log(this.state.cartdata);
    //             }
    //         }
    //         else if(this.state.complaints){
    //             this.setState({
    //                complaintqr:data
    //             });
    //             console.log(data);
    //         }
    //     }
    // }
    handleError(err){
        console.error(err)
    }
    reset(){
        this.setState({
            cartdata:[],
            aadhardata:'',
            inventorydata:[],
            complaintqr:'',
            complainttext:'',
            aadhar:true,
            itemqr:false,
            cartopen:false,
            snackbarIsOpen:false,
            loading:false,
            complaints:false,
            inventory:false,
            success:false,
            tempOpen:false,
            notif:'',
            delay: 300,
            result: 'No result',
        });
    }
    sendData(token){
        let self=this;
        // let formData = new FormData();
        navigator.geolocation.getCurrentPosition(function (position) {
            let location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            /*formData.append("token",token());
            formData.append("xml_data",self.state.aadhardata);
            formData.append("gps",JSON.stringify(location));
            formData.append("items",JSON.stringify(self.state.cartdata));*/

            console.log('sending data !');
            let data ={
                token:token(),
                xml_data:self.state.aadhardata,
                items:self.state.cartdata,
                gps:location
            };

            let xhr=new XMLHttpRequest();
            xhr.open('POST','https://subconn.herokuapp.com/transaction/aadhar',true);
            // xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onload=function () {
                console.log(xhr.responseText);
                self.setState({
                    aadhar:false,
                    itemqr:false,
                    cartopen:false,
                    complaints:false,
                    inventory:false,
                    tempOpen:false,
                    success:true,
                    loading:false
                });
            };
            xhr.send(JSON.stringify(data));

            console.log(data);
        });
    }
    setRef = (webcam) => {
        this.webcam = webcam;
    };

    capture = () => {
        const imageSrc = this.webcam.getScreenshot();
    };
    getInventory(token){
        let self=this;
        let formData = new FormData();

        formData.append("token",token());
        this.loading();
        let xhr=new XMLHttpRequest();
        xhr.open('POST','https://subconn.herokuapp.com/agent/profile',true);
        xhr.onload=function () {
            console.log(xhr.responseText);
            let inventory=(JSON.parse(xhr.responseText)).itemcount;
            let invarr=[];
            for (let item in inventory){
                invarr.push({
                    name:item,
                    amount:inventory[item]
                })
            }
            console.log(invarr);
            self.setState({
                aadhar:false,
                itemqr:false,
                cartopen:false,
                complaints:false,
                inventory:true,
                tempOpen:false,
                inventorydata:invarr,
                success:false,
                loading:false
            });
        };
        console.log(formData);
        xhr.send(formData);
    }
    complaints(){
        let self=this;
        self.setState({
            aadhar:false,
            itemqr:false,
            cartopen:false,
            complaints:true,
            inventory:false,
            tempOpen:false,
            success:false,
            loading:false
        });
    }
    sendComplaint(token){
        let self=this;
        let formData = new FormData();

        formData.append("token",token());
        formData.append("comment",this.state.complainttext);
        formData.append("item",this.state.complaintqr);

        let xhr=new XMLHttpRequest();
        xhr.open('POST','https://subconn.herokuapp.com/agent/complaint',true);
        xhr.onload=function () {
            let res=JSON.parse(xhr.responseText);
            if(res.status===200){
                console.log('Complaint registered successfully !');
                self.setState({
                    snackbarIsOpen:true,
                    notif:'complaint registered successfully !',
                });
                self.reset();
            }
            else {
                self.setState({
                    snackbarIsOpen:true,
                    notif:'There was some error in registering your complaint , try again later .',
                });
            }
            console.log(xhr.responseText);
        };
        xhr.send(formData);
        console.log({
            token:token(),
            product:this.state.complaintqr,
            comment:this.state.complainttext
        });
    }
    render(){
        return(
        <div>
            {/* With multiple sections */}
            <Toolbar style={{backgroundColor:'#388e3c'}}>
                <ToolbarSection alignStart>
                    <ToolbarMenuIcon use="menu" onClick={() => this.setState({tempOpen: !this.state.tempOpen})}/>
                    <ToolbarTitle>SubConn</ToolbarTitle>
                </ToolbarSection>
            </Toolbar>
            <TemporaryDrawer
                open={this.state.tempOpen}
                onClose={() => this.setState({tempOpen: false})}
            >
                <TemporaryDrawerHeader style={{ backgroundColor: '#388e3c',color:'white' }}>
                    Menu
                </TemporaryDrawerHeader>
                <TemporaryDrawerContent>
                    <ListItem onClick={this.reset}>
                        <ListItemStartDetail>dashboard</ListItemStartDetail>
                        <ListItemText>Dashboard</ListItemText>
                    </ListItem>
                    <ListItem onClick={()=>{
                        this.setState({
                            aadhar:false,
                            itemqr:true,
                            cartopen:false,
                            complaints:false,
                            inventory:false,
                            tempOpen:false,
                            success:false,
                            loading:false
                        });
                    }}>
                        <ListItemStartDetail>add</ListItemStartDetail>
                        <ListItemText>Add Crop</ListItemText>
                    </ListItem>
                    <ListItem onClick={this.getInventory}>
                        <ListItemStartDetail>timeline</ListItemStartDetail>
                        <ListItemText>Timeline</ListItemText>
                    </ListItem>
                    <ListItem onClick={this.complaints}>
                        <ListItemStartDetail>contact_phone</ListItemStartDetail>
                        <ListItemText>Contact us</ListItemText>
                    </ListItem>
                    <ListItem onClick={this.logout}>
                        <ListItemStartDetail>input</ListItemStartDetail>
                        <ListItemText>Logout</ListItemText>
                    </ListItem>
                </TemporaryDrawerContent>
            </TemporaryDrawer>
            <Dialog
                open={this.state.cartopen}
                onClose={evt => this.setState({cartopen: false})}
            >
                <DialogRoot style={{ backgroundColor: '#388e3c'}}>
                    <DialogSurface>
                        <DialogHeader>
                            <DialogHeaderTitle style={{textAlign:'center'}}><h3>Cart</h3></DialogHeaderTitle>
                        </DialogHeader>
                        <DialogBody style={{maxHeight:'50vh',overflowY:'scroll'}}>
                            <div className="row">
                                <div className="col s3 inv-cols"><b>Sno</b></div>
                                <div className="col s6 inv-cols"><b>Item</b></div>
                                <div className="col s3 inv-cols"><b>Expiry Date</b></div>
                            </div>
                            {this.state.cartdata.map(function(object, i){
                                return <div className="row">
                                    <div className="col s3 inv-cols">{i+1}</div>
                                    <div className="col s6 inv-cols">{object.split('|')[0]}</div>
                                    <div className="col s3 inv-cols">{object.split('|')[2]}</div>
                                </div>;
                            })}
                        </DialogBody>
                        <DialogFooter>
                            <DialogFooterButton accept>Close</DialogFooterButton>
                        </DialogFooter>
                    </DialogSurface>
                    <DialogBackdrop />
                </DialogRoot>
            </Dialog>
            {this.state.aadhar?
                <div>
                    <h2 style={{textAlign:'center'}}>Dashboard</h2>
                    <div className="row">
                        <h3 style={{textAlign:'center'}}>Weather forecast</h3>
                        <Card style={{width: '320px',position:'relative',margin:'5px auto'}}>
                            <CardPrimary>
                                <CardTitle large>32c</CardTitle>
                                <CardSubtitle>Wednesday <br/> Humidity - 53%</CardSubtitle>
                            </CardPrimary>
                            <img src={weather} alt="" style={{float:'right',height:'64px',width:'64px',position:'absolute',top:'5px',right:'10px'}}/>
                        </Card>
                        <Card style={{width: '320px',position:'relative',margin:'5px auto'}}>
                            <CardPrimary>
                                <CardTitle large>32c</CardTitle>
                                <CardSubtitle>Wednesday <br/> Humidity - 53%</CardSubtitle>
                            </CardPrimary>
                            <img src={weather} alt="" style={{float:'right',height:'64px',width:'64px',position:'absolute',top:'5px',right:'10px'}}/>
                        </Card>
                        <Card style={{width: '320px',position:'relative',margin:'5px auto'}}>
                            <CardPrimary>
                                <CardTitle large>32c</CardTitle>
                                <CardSubtitle>Wednesday <br/> Humidity - 53%</CardSubtitle>
                            </CardPrimary>
                            <img src={weather} alt="" style={{float:'right',height:'64px',width:'64px',position:'absolute',top:'5px',right:'10px'}}/>
                        </Card>
                    </div>
                    <div className="row">
                        <h3 style={{textAlign:'center'}}>My crops</h3>
                        <GridList
                            tileGutter1={this.state.tileGutter1}
                            headerCaption={this.state.headerCaption}
                            twolineCaption={this.state.twolineCaption}
                            withIconAlignStart={this.state.withIconAlignStart}
                            tileAspect={this.state.tileAspect}
                        >
                            <GridTile >
                                <GridTilePrimary>
                                    <GridTilePrimaryContent>
                                        <img src="https://material-components-web.appspot.com/images/1-1.jpg" alt="test" />
                                    </GridTilePrimaryContent>
                                </GridTilePrimary>
                                <GridTileSecondary>
                                    <GridTileTitle></GridTileTitle>
                                </GridTileSecondary>
                            </GridTile>
                            <GridTile >
                                <GridTilePrimary>
                                    <GridTilePrimaryContent>
                                        <img src="https://material-components-web.appspot.com/images/1-1.jpg" alt="test" />
                                    </GridTilePrimaryContent>
                                </GridTilePrimary>
                                <GridTileSecondary>
                                    <GridTileTitle></GridTileTitle>
                                </GridTileSecondary>
                            </GridTile>
                        </GridList>
                    </div>
                </div>:''
            }
            {this.state.loading?<Loading/>:''}
            {this.state.itemqr?
                <div>
                    <div>
                        <Webcam
                            audio={false}
                            height={'100%'}
                            ref={this.setRef}
                            screenshotFormat="image/jpeg"
                            width={'100%'}
                        />
                        <div className="row" style={{marginTop:'15px'}}>
                            <div className="col s6" style={{textAlign:'center'}}>
                                <Button dense><Icon>camera</Icon></Button>
                            </div>
                            <div className="col s6" style={{textAlign:'center'}}>
                                <Button type="file" dense><Icon>file_upload</Icon></Button>
                            </div>
                        </div>

                    </div>
                </div> :''
            }
            {this.state.inventory?
                <div>
                    <div className="row">
                        <div className="col s12">
                            <h3 style={{textAlign:'center'}}>Inventory</h3>
                            <div className="row">
                                <div className="col s3 inv-cols"><b>Sno</b></div>
                                <div className="col s6 inv-cols"><b>Item</b></div>
                                <div className="col s3 inv-cols"><b>Amount</b></div>
                            </div>
                            {this.state.inventorydata.map(function(object, i){
                                return <div className="row">
                                    <div className="col s3 inv-cols">{i+1}</div>
                                    <div className="col s6 inv-cols">{object.name}</div>
                                    <div className="col s3 inv-cols">{object.amount}</div>
                                </div>;
                            })}
                        </div>
                    </div>
                </div> :''
            }
            {this.state.complaints?
                <div>

                </div>:''
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
                    <div style={{position:'fixed',bottom:'15px','right':'15px'}}>
                        <Fab onClick={this.reset}>check</Fab>
                    </div>
                </div> :''
            }
            <Snackbar
                show={this.state.snackbarIsOpen}
                onClose={evt => this.setState({snackbarIsOpen: false,notif:''})}
                message={(this.state.notif==='')?"This item is already scanned":this.state.notif}
            />
        </div>
        )
    }
}
export default Home;