import React from 'react';
import { Link } from 'react-router-dom';
import useLoginStatus from '../hooks/useLoginStatus';
import {logout} from '../services/authService';
import { likeNav, searchNav, pantryNav, loginIcon, qMark } from '../util/imgPicker';
import '../index.css';

// A simple nav system for routing menu buttons to react router

export default function NavBar(props){

    const setLoggingout = () => { 
        logout(); // deletes jwt token from storage
        props.setOnlineStatus(false);   //calls parent logout in app.js etc..
    }
    const LoginStatus = useLoginStatus; // retrives user name
    const logged = props.onLineStatus; // current login status from app.js for conditional rendering. perhaps use a context
    const children = props.children;

    return (
            <div className="menu-outer">
                    <ul id="horizontal-list">
                    {children}
                        {logged && <li><LoginStatus className="user-status" isAuthed={logged}></LoginStatus></li>}
                        {!logged && <li><button className="user-status"> <Link to="/login" className="nav-text">{loginIcon()}<br />Login</Link></button></li>}
                        {logged && <li><button className="nav-icon"><Link to="/pantry" className="nav-text">{pantryNav(logged)}<br />Pantry</Link></button></li>}
                        <li><button className="nav-icon"><Link to="/search" className="nav-text">{searchNav()}<br />Search</Link></button></li>
                        {logged && <li><button className="nav-icon"><Link to="/fav/recipes" className="nav-text">{likeNav()}<br />Favourites</Link></button></li>}
                        <li><button className="nav-icon"><Link to="/about" className="nav-text">{qMark()}<br />About</Link></button></li>
                        {logged && <li><button className={"logout"} onClick={() => logged && setLoggingout()}><p>Logout</p></button></li>}
                    </ul>
            </div> 
            );
}
 