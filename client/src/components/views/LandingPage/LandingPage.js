import React,{ useEffect} from 'react'
import axios from 'axios';
import { withRouter } from 'react-router-dom'; 

function LandingPage() {

    useEffect(()=>{
        axios.get('/api/hello')
        .then(response => {console.log(response.data)})
    }, [])

    return (
        <div>
            LandingPage
        </div>
    )
}

export default withRouter(LandingPage)
