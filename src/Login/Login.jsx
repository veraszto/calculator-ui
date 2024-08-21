import React, {useEffect} from 'react';
import * as styles from './style.module.css';

const Login = ({setIsLoading, setUserInfo}) => {

    const authenticate = (username, password) => {
        setIsLoading(true);
        return fetch("http://localhost:3000/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username, password}),
            credentials: 'include'
        }).then((res) => {
            return res.json();
        }).then((res)=> {
            setIsLoading(false);
            return res;
        }).catch((error) => {
            setIsLoading(false);
            console.log(error);
        });
    }


    return (
        <div className={styles.container}>
            <form onSubmit={(ev)=>{
                ev.preventDefault();
                authenticate(document.forms[0].username.value, document.forms[0].password.value)
                    .then((result)=>{
                        setUserInfo(result);
                    });
            }}>
                <div>
                    <input 
                        defaultValue="garbini@gmail.com" 
                        type="text" required 
                        placeholder="<user@email.com>" name="username" 
                    />
                </div>
                <div>
                    <input 
                        defaultValue="12345" type="password" required 
                        placeholder="<password>" name="password" 
                    />
                </div>
                <button>Enter
                </button>
            </form>
        </div>
    );
}

export default Login;
