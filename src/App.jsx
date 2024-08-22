import React, {useEffect, useState} from 'react';
import Login from './Login/Login';
import Main from './Main/Main';
import Loader from './Loader/Loader';
import './style.css';
import BACKEND_URL from '/backend-url';
const IsAuthenticatedEndpoint = `${BACKEND_URL}/is-authenticated`;

const App = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({isAuthenticated: null});

    useEffect(() => {
        fetch(IsAuthenticatedEndpoint, {credentials: "include"})
            .then(result => result.json())
            .then((result)=>{
                setUserInfo(result);
            }).catch((error)=>{
                console.log('Has the backend url been properly configured by passing CALCULATOR_APP_BACKEND_URL environment when running this app?');
            })
    }, [])

    if (userInfo.isAuthenticated === null) {
        return <Loader show={true} />
    }

    if (userInfo.isAuthenticated === false) {
        return (
            <div style={{height:'100%'}}>
                <Loader show={isLoading} />
                <Login setIsLoading={setIsLoading} setUserInfo={setUserInfo} />
            </div>
        );
    }

    return (
        <div style={{height:'100%'}}>
            <Loader show={isLoading} />
            <Main setIsLoading={setIsLoading} userInfo={userInfo} setUserInfo={setUserInfo} />
        </div>
    );
}

export default App;
