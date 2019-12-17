import React from 'react';
import {withRouter} from 'react-router-dom'
import LoginForm from '../components/login';
import './LoginPage.css';

const LoginPage = ({history}) =>{
    const handleHistoryPush=()=>{
        console.log('跳转')
        history.push('/');
    }
    return (
        <>
        <div className="login-wrapper">
        <LoginForm  handleHistoryPush={handleHistoryPush} history={history}/>
        </div>
        </>
    )
}

export default withRouter(LoginPage) ;