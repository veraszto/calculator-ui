import React, {useEffect, useState} from 'react';
import * as styles from './style.module.css';


const Samples = "5+5 ; 102 - 2 ; 10*10 ; 125 / 25 ; sqroot900 ; random_string";

const Main = ({setIsLoading, userInfo, setUserInfo}) => {

    const [records, setRecords] = useState([]);
    const [headRecord, setHeadRecord] = useState(null);

    useEffect(() => {
        reloadRecords();        
    }, []);

    const checkIsAuthenticated = (res) => {
        if (res.isAuthenticated === false) {
            setUserInfo({isAuthenticated: false});
        }
        return res;
    }

    const logout = () => {
        fetch("http://localhost:3000/logout", {credentials: "include"})
            .then(result => result.json())
            .then((result)=>{
                setUserInfo({isAuthenticated: false});
            })
    }

    const fetchRecords = (skip = 0) => {
        return fetch("http://localhost:3000/records", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({skip}),
            credentials: 'include'
        }).then(res => res.json())
        .then((res)=> {
            return checkIsAuthenticated(res);
        }).catch((error) => {
            setIsLoading(false);
            console.log(error);
        });
    }

    const reloadRecords = () => {
        setIsLoading(true);
        fetchRecords().then((res)=>{
            console.log(res);
            setRecords(res);
            setHeadRecord(res[0]);
            setIsLoading(false);
        });
    }

    const putOperation = (operation) => {
        setIsLoading(true);
        return fetch("http://localhost:3000/operation", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({operation}),
            credentials: 'include'
        }).then(res => res.json())
        .then((res)=> {
            setIsLoading(false);
            checkIsAuthenticated(res);
            if (!res.error){
                reloadRecords();
            }
        }).catch((error) => {
            setIsLoading(false);
            console.log(error);
        });
    }

    if (!records.length || !headRecord) {
        return null;
    }

    return (
        <div className={styles.container}>
            <section className={styles.header} style={{flex:1}}>
                <div>
                    <article>Credits:<span>{headRecord.user_balance}</span>
                    </article>
                    <article>{headRecord.user[0].username}: {headRecord.user[0]._id}
                    </article>
                </div>
                <button onClick={logout}>Logout
                </button>
            </section>
            <section style={{flex:1}}>
                <form onSubmit={(ev)=>{
                    ev.preventDefault();
                    putOperation(ev.target.operation.value);

                }}>
                    <div>
                        <div style={{paddingBottom:'1rem'}}>Hi! These are samples of operations that can be performed separated by semi-colons(;), please only either of them at a time, for instance, 10*10
                        </div>
                        <div style={{paddingBottom:'1rem'}}>{Samples}
                        </div>
                        <div className={styles.inputDiv}><input type="text" required placeholder={Samples} name="operation" />
                        </div>
                        <button>Submit operation
                        </button>
                    </div>
                </form>
            </section>
            <section className={styles.records} style={{flex:2}}>
                <article>
                    <div>Queried
                    </div>
                    <div>Operation response
                    </div>
                    <div>Operation type
                    </div>
                    <div>Operation cost
                    </div>
                    <div>Balance after execution
                    </div>
                </article>
                {
                    records.filter(record => record.operation_response !== undefined)
                        .map((record, index) => {
                            return (
                                <article key={index}>
                                    <div>{record.queried}
                                    </div>
                                    <div>{record.operation_response}
                                    </div>
                                    <div>{record.operation[0]?.type}
                                    </div>
                                    <div>{record.operation[0]?.cost}
                                    </div>
                                    <div>{record.user_balance}
                                    </div>
                                </article>
                            )
                        })
                }
            </section>
        </div>
    );
}

export default Main;
