import axios from "axios";  
import { useMemo, useState, useEffect } from "react";  
import {Link} from "react-router-dom";

const Home = () => {
    document.body.style = 'background: rgb(71, 64, 210); background: linear-gradient(to top,rgba(137, 247, 254, 1),rgba(102, 166, 255, 1));';
    return <div className="Landing">
        Never stop exploring. Trust in Restify. Hurry up and join our community now! <br></br>
        <Link to="/signup" id="join" className="btn btn-primary">Join now!</Link> </div>
}

export default Home;