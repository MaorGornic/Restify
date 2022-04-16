import {Link, Outlet} from "react-router-dom";
import axios from "axios";  
import { useMemo, useState, useEffect } from "react";  
import "../LandingNavBar/style.css";

const LandingLayout = () => {
    return <>
        <nav id="naving">
            <Link to="/"> Home </Link>
            <Link to="/login"> Login </Link>
            <Link to="/signup"> Signup </Link>
        </nav>

        <Outlet />
    </>
}

export default LandingLayout