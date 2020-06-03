import React, { useEffect } from 'react'
import axios from 'axios';
// import { response } from 'express';

function LandingPage(props) {

    useEffect(() => {
        axios.get('/api/hello')
        .then(response => { console.log(response)})
    }, []);

    const onClickHandler = () => {
        axios.get('/api/users/signout')
            .then(response => {
                if(response.data.success) {
                    props.history.push("/signin");
                } else {
                    alert("로그아웃 실패");
                }
            });
    };

    return (
        <div style={{ 
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <h1>시작 페이지</h1>

            <button onClick={onClickHandler}>
                로그아웃
            </button>
        </div>
            
    )
}

export default LandingPage
