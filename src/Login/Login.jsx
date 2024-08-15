import React, {useEffect} from 'react';
import './style.css';
import * as styles from './style.module.css';

const Login = () => {

    const authenticate = (user) => {
        return fetch("http://localhost:3000/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({user}),
            credentials: 'include'
        }).then((res) => {
            return res.json();
        }).then((res)=> {
            return res;
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        const authRes = authenticate("hello");
        authRes.then((res)=>{
            console.log(res);
            fetch("http://localhost:3000/is-authenticated", {credentials: "include"})
            //fetch("http://localhost:3000/is-authenticated")
        });
    }, [])

    return (
        <div className={styles.hi}>
            <div className={styles.hello}>Hi
            </div>
        </div>
    );
}

export default Login;
