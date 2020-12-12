import React from 'react';
import { Link } from 'react-router-dom';
import useLoginStatus from '../hooks/useLoginStatus';
import {logout} from '../services/authService';


export default function NavBar(props){

    const setLoggingout = () => { 
        logout(); // deletes jwt token from storage
        props.setOnlineStatus(false);   //calls parent logout in app.js etc..
    }
    const LoginStatus = useLoginStatus;
    
    return ( 
            <div className="menu-outer">
                <div className="table">
                    <ul id="horizontal-list">
                        {props.onLineStatus &&<li><LoginStatus isAuthed={props.onLineStatus}></LoginStatus></li>} {/* remove conditional to show logged out status ==>  props.onLineStatus &&  */}
                        {!props.onLineStatus && <li><button> <Link to="/login">Login</Link></button></li>}
                        {props.onLineStatus && <li><button><Link to="/pantry">My Pantry</Link></button></li>}
                        <li><button><Link to="/something">Something</Link></button></li>
                        <li><button><Link to="/something">Something Else</Link></button></li>
                        <li><button><Link to="/about">About</Link></button></li>
                        {props.onLineStatus && <li><button onClick={() => setLoggingout()}>Logout</button></li>}
                    </ul>
                </div>
            </div> 
            );
}
 