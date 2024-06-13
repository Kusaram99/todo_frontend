import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const Layouts = () => {
    const isUserLogIn = JSON.parse(localStorage.getItem('refreshToken'));
    
    return isUserLogIn ? <Outlet /> : <Navigate to="/" />
}

export default Layouts