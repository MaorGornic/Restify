import {Link, Outlet} from "react-router-dom";
import axios from "axios";  
import { useMemo, useState, useEffect } from "react";  
import "../LandingNavBar/style.css";

const LandingLayout = () => {
    return <>
        <nav id="naving">
            <Link to="/" class="nav-item"> Home </Link>
            <Link to="/login" class="nav-item"> Login </Link>
            <Link to="/signup" class="nav-item"> <button className="signButton">Sign Up</button> </Link>
        </nav>

        <Outlet />
    </>
}

export default LandingLayout