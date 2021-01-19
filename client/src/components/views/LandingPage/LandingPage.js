import React from 'react';
import { withRouter } from 'react-router-dom'; 
import axios from 'axios';
function LandingPage() {

    async function getData() {
        const response = await axios.get('/api/apt');
        console.log(response.data);
        return response.data;
    }
    

    return(


        <div>
            <button onClick={getData}> Load More</button>
        </div>


)
}

export default withRouter(LandingPage)