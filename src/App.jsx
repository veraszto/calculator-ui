import React, {useEffect, useState} from 'react';
import Login from './Login/Login';
import Main from './Main/Main';
import Loader from './Loader/Loader';
import './style.css';

const App = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/is-authenticated", {credentials: "include"})
            .then(result => result.json())
            .then((result)=>{
                setIsAuthenticated(result.isAuthenticated);
            })
    }, [])

    if (isAuthenticated === null) {
        return <Loader show={true} />
    }

    if (isAuthenticated === false) {
	    return (
            <div style={{height:'100%'}}>
                <Loader show={isLoading} />
                <Login setIsLoading={setIsLoading} />
            </div>
        );
    }

	return (
        <div style={{height:'100%'}}>
            <Loader show={isLoading} />
            <Main setIsLoading={setIsLoading} />
        </div>
    );
}

export default App;
