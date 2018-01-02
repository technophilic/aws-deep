import React, {Component} from 'react';
import Login from './components/Login/Login'
import Home from './components/Home/Home'
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>
                {/*<Login/>*/}
                <Home/>
            </div>
        );
    }
}

export default App;
