import React from "react";
import * as styles from "./style.module.css";
import BACKEND_URL from "../backend-url";
const LoginEndpoint = `${BACKEND_URL}/login`;

const Login = ({ setIsLoading, setUserInfo, setDisplayMsg }) => {
    const authenticate = (username, password) => {
        setIsLoading(true);
        return fetch(LoginEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
            credentials: "include",
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                setIsLoading(false);
                return res;
            })
            .catch((error) => {
                setIsLoading(false);
                console.log(error);
            });
    };

    return (
        <div className={styles.container} data-testid="login">
            <form
                onSubmit={(ev) => {
                    ev.preventDefault();
                    authenticate(
                        document.forms[0].username.value,
                        document.forms[0].password.value,
                    ).then((result) => {
                        if (result.isAuthenticated === false) {
                            setDisplayMsg(
                                "Could not authenticate using the credentials provided",
                            );
                        }
                        setUserInfo(result);
                    });
                }}
            >
                <div>
                    <input
                        type="text"
                        required
                        placeholder="<user@email.com>"
                        name="username"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        required
                        placeholder="<password>"
                        name="password"
                    />
                </div>
                <button>Enter</button>
            </form>
        </div>
    );
};

export default Login;
