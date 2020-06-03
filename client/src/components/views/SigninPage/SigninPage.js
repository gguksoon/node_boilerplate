import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { signinUser } from '../../../_actions/user_action';

function SigninPage(props) {
    const dispatch = useDispatch();

    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();

        // State안에 저장됨
        console.log('Email', Email);
        console.log('Password', Password);

        let body = {
            email: Email,
            password: Password
        }

        dispatch(signinUser(body))
            .then(response => {
                if(response.payload.signinSuccess) {
                    props.history.push('/');
                } else {
                    alert(response.payload.message);
                }
            });
    }

    return (
        <div style={{ 
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            
            <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />

                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />

                <br/>

                <button>
                    Signin
                </button>
            </form>
        </div>
    )
}

export default SigninPage
