import React, { useEffect, useState } from "react";
import * as styles from "./style.module.css";
import BACKEND_URL from "../backend-url";
const LogoutEndpoint = `${BACKEND_URL}/logout`;
export const RecordsEndpoint = `${BACKEND_URL}/records`;
const OperationEndpoint = `${BACKEND_URL}/operation`;
const SoftDeleteEndpoint = `${BACKEND_URL}/soft-delete`;

const Samples = "5+5 ; 102 - 2 ; 10*10 ; 125 / 25 ; sqroot900 ; random_string";

//https://fontawesome.com/icons/square-minus?f=classic&s=regular
const DeleteIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM152 232l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z" />
    </svg>
);

const Main = ({ setIsLoading, setUserInfo, setDisplayMsg }) => {
    const [records, setRecords] = useState([]);
    const [headRecord, setHeadRecord] = useState(null);
    const [skipRecords, setSkipRecords] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lockedSubmit, setLockedSubmit] = useState(false);

    useEffect(() => {
        reloadRecords();
    }, []);

    const checkIsAuthenticated = (res) => {
        if (res.isAuthenticated === false) {
            setUserInfo({ isAuthenticated: false });
        }
        return res;
    };

    const logout = () => {
        fetch(LogoutEndpoint, { credentials: "include" })
            .then((result) => result.json())
            .then((result) => {
                setUserInfo({ isAuthenticated: false });
            });
    };

    const fetchRecords = (skip = 0) => {
        return fetch(RecordsEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ skip }),
            credentials: "include",
        })
            .then((res) => res.json())
            .then((res) => {
                return checkIsAuthenticated(res);
            })
            .catch((error) => {
                setIsLoading(false);
                console.log(error);
            });
    };

    const reloadRecords = (skip = 0) => {
        setIsLoading(true);
        fetchRecords(skip).then((res) => {
            setRecords(res.records);
            if (skip === 0) {
                setHeadRecord(res.records[0]);
            }
            setSkipRecords(res.skip);
            setTotalRecords(res.totalRecords);
            setIsLoading(false);
        });
    };

    const softDelete = (recordId) => {
        setIsLoading(true);
        fetch(SoftDeleteEndpoint, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ recordId }),
            credentials: "include",
        })
            .then((res) => res.json())
            .then((res) => {
                checkIsAuthenticated(res);
                reloadRecords();
            })
            .catch((error) => {
                setIsLoading(false);
                console.log(error);
            });
    };

    const putOperation = (operation) => {
        setIsLoading(true);
        setLockedSubmit(true);
        return fetch(OperationEndpoint, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ operation }),
            credentials: "include",
        })
            .then((res) => res.json())
            .then((res) => {
                setIsLoading(false);
                setLockedSubmit(false);
                checkIsAuthenticated(res);
                if (!res.error) {
                    reloadRecords();
                } else {
                    setDisplayMsg(res.error);
                }
            })
            .catch((error) => {
                setIsLoading(false);
                setLockedSubmit(false);
                console.log(error);
            });
    };

    if (!records.length || !headRecord) {
        return null;
    }

    return (
        <div className={styles.container} data-testid="main">
            <section className={styles.header} style={{ flex: 1 }}>
                <div>
                    <article>
                        Credits:<span>{headRecord.user_balance}</span>
                    </article>
                    <article>
                        {headRecord.user?.[0]?.username}:{" "}
                        {headRecord.user?.[0]?._id}
                    </article>
                </div>
                <button onClick={logout}>Logout</button>
            </section>
            <section style={{ flex: 1 }}>
                <form
                    onSubmit={(ev) => {
                        ev.preventDefault();
                        ev.target.operation?.blur();
                        if (lockedSubmit) {
                            return;
                        }
                        putOperation(ev.target.operation.value);
                    }}
                >
                    <div>
                        <div style={{ paddingBottom: "1rem" }}>
                            Hi! These are samples of operations that can be
                            performed separated by semi-colons(;), please only
                            either of them at a time, for instance, 10*10
                        </div>
                        <div style={{ paddingBottom: "1rem" }}>{Samples}</div>
                        <div className={styles.inputDiv}>
                            <input
                                type="text"
                                required
                                placeholder={Samples}
                                name="operation"
                            />
                        </div>
                        <button>Submit operation</button>
                    </div>
                </form>
            </section>
            <section className={styles.records} style={{ flex: 2 }}>
                <article>
                    <div>Queried</div>
                    <div>Operation response</div>
                    <div>Operation type</div>
                    <div>Operation cost</div>
                    <div>Balance after execution</div>
                    <div>Date</div>
                    <div>Soft delete</div>
                </article>
                {records
                    .filter((record) => record.operation_response !== undefined)
                    .map((record, index) => {
                        return (
                            <article key={index} className="record">
                                <div>{record.queried}</div>
                                <div>{record.operation_response}</div>
                                <div>{record.operation?.[0]?.type}</div>
                                <div>{record.operation?.[0]?.cost}</div>
                                <div>{record.user_balance}</div>
                                <div>{record.date}</div>
                                <div className={styles.deleteButton}>
                                    <div
                                        onClick={function (ev) {
                                            softDelete(record._id);
                                        }}
                                    >
                                        {DeleteIcon}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                <section className={styles.paginationDescription}>
                    Showing:
                    {(totalRecords - skipRecords > 10 && 10) ||
                        totalRecords - skipRecords}
                    , Offset: {skipRecords}, Total: {totalRecords}
                </section>
                <section className={styles.paginationButtonsContainer}>
                    <button
                        onClick={() => {
                            let skip = skipRecords - 10;
                            if (skip < 0) {
                                skip = 0;
                            }
                            reloadRecords(skip);
                        }}
                        disabled={skipRecords === 0}
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => {
                            reloadRecords(skipRecords + 10);
                        }}
                        disabled={totalRecords - skipRecords < 10}
                    >
                        Next
                    </button>
                </section>
            </section>
        </div>
    );
};

export default Main;
