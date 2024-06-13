import React, { useEffect, useState } from 'react'
import "./Header.css"
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { userLogOut } from '../../features/todo/todoSlice'
import dp from './mypasphoto.jpg'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

const Header = () => {

    // nav handler variable for responsive nav
    const [isSmallDevice, SetIsSmallDevice] = useState(null);
    // const [refreshToken, SetRefreshToken] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isUserLogIn } = useSelector((state) => state.todo)
    // console.log("head: ", isUserLogIn)

    const [dpUrl, setDpUrl] = useState("");

    const location = useLocation();

    // log out handler
    const logOutHandler = async () => {
        const { accessToken, refreshToken } = JSON.parse(localStorage.getItem("refreshToken")) || {};

        const headers = {
            "Authorization": `Bearer ${accessToken}`
        }

        try {


            const response = await axios.post(`${import.meta.env.VITE_API_LOGOUT_URL}/logout`, {}, { headers });
            if (response.status === 200) {
                alert("Log Out Successfully!");
                console.log("first--- reponse: ", response)
            }

        } catch (error) {
            if (error.response.status === 401) {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_API_REFRESH_TOKEN_URL}/api/v1/users/token`, {
                        refreshToken: `Bearer ${refreshToken}`
                    });
                    if (response.status === 200) {
                        refreshTokenHandler(response);
                    }
                } catch (error) {
                    console.log("error first one------", error)
                }
            }
            console.log("first Error: ", error)
        } finally {
            // logoute user in any condition
            localStorage.removeItem('refreshToken');
            navigate('/login');
            SetIsSmallDevice(false)
            dispatch(userLogOut(""));
        }
    }

    // refresh token handler
    const refreshTokenHandler = async (resp) => {
        // console.log("refresh Todo: ", todoData)
        if (resp?.status === 200) {
            try {
                const { accessToken } = resp.data.data;

                const headers = {
                    'Authorization': `Bearer ${accessToken}`
                };

                const result = await axios.post(`${import.meta.env.VITE_API_LOGOUT_URL}/logout`, {}, { headers });
                if (result.status === 200) {
                    alert("Log Out Successfully!");
                    console.log("second----- result: ", result)
                }
            } catch (error) {
                console.log("Error after refreshing token: ", error);
            }
        }
    };

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('refreshToken'));
        if (token) {
            setDpUrl(token.avatar)
        } else {
            setDpUrl(dp);
        }
    }, [])

    return (
        <header>
            <nav className="navbar">
                <h1 className="logo">Daily List</h1>
                <div className='nav_btns_container'>
                    <ul className='navigate_btn_container'>
                        <li><Link
                            to="/"
                            className={`${location.pathname === '/' ? 'active' : ''}`}  >
                            Home</Link></li>
                        {JSON.parse(localStorage.getItem("refreshToken")) &&
                            <li><Link
                                to="/todo"
                                className={`${location.pathname === '/todo' ? 'active' : ''}`} >
                                Create Todo</Link></li>
                        }
                    </ul>
                    <div className='login_btn_container'>
                        {!JSON.parse(localStorage.getItem('refreshToken')) ?
                            <button
                                onClick={() => navigate('/login')}>
                                LogIn / SignUp
                            </button>
                            :
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "revert" }}>
                                {/* <span className='cursor-pointer'>Log Out</span> */}

                                <div
                                    title='Profile'
                                    className='cursor-pointer dp_container mx-10'>
                                    <img
                                        loading='lazy'
                                        src={isUserLogIn ? isUserLogIn : dp}
                                        width='50'
                                        alt='img' />
                                </ div>
                                <span
                                    className='cursor-pointer'
                                    onClick={logOutHandler} >Log Out</span>
                            </div>
                        }
                    </div>
                </div>
                <span
                    className="material-symbols-outlined menu_btn"
                    style={{ cursor: "pointer" }}
                    onClick={() => SetIsSmallDevice(true)}>
                    menu
                </span>

                <div className={`responsive_nav_btns_container ${isSmallDevice ? 'hide_nv_btn' : ''}`}>
                    <div className='responsive_profile_container'>
                        {JSON.parse(localStorage.getItem('refreshToken')) &&
                            <div
                                title='Profile'
                                className='cursor-pointer dp_container'>
                                <img
                                    loading='lazy'
                                    src={isUserLogIn ? isUserLogIn : dp}
                                    width='50'
                                    alt='img'
                                    onClick={() => SetIsSmallDevice(false)} />
                            </ div>
                        }
                    </div>
                    <ul className='resp_nav_btns'>
                        <li>
                            <Link
                                to="/"
                                onClick={() => SetIsSmallDevice(false)}>
                                Home
                            </Link>
                        </li>

                        {JSON.parse(localStorage.getItem('refreshToken')) &&
                            <li>
                                <Link
                                    to='/todo'
                                    onClick={() => SetIsSmallDevice(false)}>
                                    Make Todo
                                </Link>
                            </li>
                        }
                    </ul>
                    <div className='resp_login_btns_container'>
                        {!JSON.parse(localStorage.getItem('refreshToken')) ?
                            <button onClick={() => {
                                SetIsSmallDevice(false);
                                navigate('/login')
                            }}>LogIn/SignUp</button>
                            :
                            <button onClick={logOutHandler}>Log Out</button>
                        }
                    </div>

                    <span
                        className="material-symbols-outlined closeBtn"
                        onClick={() => SetIsSmallDevice(false)}>
                        close
                    </span>
                </div>
            </nav>
        </header>
    )
}

export default Header