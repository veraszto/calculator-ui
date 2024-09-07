import React from "react";
import * as styles from "./style.module.css";

const Loader = ({ show }) => {
    return (
        <div
            className={styles.loader}
            style={{ display: (show && "flex") || "none" }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,500,500">
                <circle cx="250" cy="250" r="220" />
            </svg>
        </div>
    );
};

export default Loader;
