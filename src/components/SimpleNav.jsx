import React from 'react';
import { Link } from 'react-router-dom';
import useLoginStatus from '../hooks/useLoginStatus';
import {logout} from '../services/authService';
import { likeNav, searchNav, pantryNav } from '../util/imgPicker';
import '../index.css';


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
                        {!props.onLineStatus && <li><button className="nav-icon"> <Link to="/login" className="nav-text">Login</Link></button></li>}
                        {props.onLineStatus && <li><button className="nav-icon"><Link to="/pantry" className="nav-text">My Pantry{pantryNav()}</Link></button></li>}
                        <li><button className="nav-icon"><Link to="/search" className="nav-text">Search{searchNav()}</Link></button></li>
                        <li><button className="nav-icon"><Link to="/fav" className="nav-text">Fav{likeNav()}</Link></button></li>
                        <li><button className="nav-icon"><Link to="/about" className="nav-text">About</Link></button></li>
                        {props.onLineStatus && <li><button onClick={() => setLoggingout()}>Logout</button></li>}
                    </ul>
                </div>
            </div> 
            );
}
 