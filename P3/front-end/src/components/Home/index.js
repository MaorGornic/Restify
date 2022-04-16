import axios from "axios";  
import { useMemo, useState, useEffect } from "react";  
import {Link} from "react-router-dom";

const Home = () => {
    return <div className="container">
        Never stop exploring. Trust in Restify. Hurry up and join our community now! <br></br>
        <Link to="/signup" id="join" className="btn btn-primary">Join now!</Link> </div>
}

export default Home;