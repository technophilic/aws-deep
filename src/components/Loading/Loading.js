import React, {Component} from 'react';
import './Loading.css';

class Loading extends Component {
    constructor(props) {
        super(props);
        this.state={
            text:props.text||'Loading ...'
        };
    }
    render() {
        return (
            <div>
                <h3 style={{textAlign:'center'}}>{this.state.text}</h3>
            </div>
        );
    }
}

export default Loading;
