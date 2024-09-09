import React, { useEffect, useState } from "react";
import Login from "./Login/Login";
import Main from "./Main/Main";
import Loader from "./Loader/Loader";
import "./style.css";
import BACKEND_URL from "./backend-url";
export const IsAuthenticatedEndpoint = `${BACKEND_URL}/is-authenticated`;

const App = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({ isAuthenticated: null });
    const [displayMsg, setDisplayMsg] = useState(null);

    useEffect(() => {
        fetch(IsAuthenticatedEndpoint, { credentials: "include" })
            .then((result) => result.json())
            .then((result) => {
                return setUserInfo(result);
            })
            .catch((error) => {
                console.log(
                    "Is the backend up and has the backend url been properly configured by passing CALCULATOR_APP_BACKEND_URL environment when running this app?",
                );
            });
        document.body.addEventListener("click", function () {
            setDisplayMsg(null);
        });
    }, []);

    const messageContainer = displayMsg && (
        <div id="msg">
            <article>{displayMsg}</article>
        </div>
    );

    if (userInfo.isAuthenticated === null) {
        return <Loader show={true} />;
    }

    if (userInfo.isAuthenticated === false) {
        return (
            <div style={{ height: "100%" }}>
                <Loader show={isLoading} />
                {messageContainer}
                <Login
                    setIsLoading={setIsLoading}
                    setUserInfo={setUserInfo}
                    setDisplayMsg={setDisplayMsg}
                />
            </div>
        );
    }

    return (
        <div style={{ height: "100%" }}>
            <Loader show={isLoading} />
            {messageContainer}
            <Main
                setIsLoading={setIsLoading}
                setUserInfo={setUserInfo}
                setDisplayMsg={setDisplayMsg}
            />
        </div>
    );
};

export default App;
