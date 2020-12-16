import React from 'react';
import { Link } from 'react-router-dom';
import useLoginStatus from '../hooks/useLoginStatus';
import {logout} from '../services/authService';
import { likeNav, searchNav, pantryNav } from '../util/imgPicker';
import '../index.css';

// A simple nav system for routing menu buttons to react router

export default function NavBar(props){

    const setLoggingout = () => { 
        logout(); // deletes jwt token from storage
        props.setOnlineStatus(false);   //calls parent logout in app.js etc..
    }
    const LoginStatus = useLoginStatus; // retrives user name
    const logged = props.onLineStatus;

    // implemented conditional place holders for quick styling 
    return ( 
            <div className="menu-outer">
                <div className="table">
                    <ul id="horizontal-list">
                        {logged && <li><LoginStatus className="user-status" isAuthed={logged}></LoginStatus></li>}
                        {!logged && <li><button className="user-status"> <Link to="/login" className="nav-text">Login</Link></button></li>}
                        <li className={logged? "show" : "inactive"}><button className="nav-icon"><Link to="/pantry" className="nav-text">My Pantry{pantryNav(logged)}</Link></button></li>
                        <li><button className="nav-icon"><Link to="/search" className="nav-text">Search{searchNav()}</Link></button></li>
                        <li><button className="nav-icon"><Link to="/fav" className="nav-text">Fav{likeNav()}</Link></button></li>
                        <li><button className="nav-icon"><Link to="/about" className="nav-text">About</Link></button></li>
                        <li className={logged? "show" : "hide"}><button className={"logout"} onClick={() => logged? setLoggingout() : null}><p>Logout</p></button></li>
                    </ul>
                </div>
            </div> 
            );
}
 