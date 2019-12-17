import React from 'react';
import Register from '../components/register';
import {
    Button
  } from 'antd';

const RegisterPage=({history})=>{
    return (
        <>
        <div>
        <Button type="primary" onClick={()=>{
            history.push('/login');
            //console.log(history)
          }}>
              返回
            </Button>
        <Register></Register>
        </div>
        </>
    )
}

export default RegisterPage;