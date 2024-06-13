import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LogInContainer.css'
import InputBox from './InputBox'
import SubmitBtn from './SubmitBtn'
import LogInLeftSideCom from './LogInLeftSideCom'
import axios from 'axios'
import FileUploader from './FileUploader'
import { useDispatch } from 'react-redux'
import { userLogIn } from '../../features/todo/todoSlice'

const LogInContainer = () => {

    const [signupUserData, SetSignupUserData] = useState(
        {
            username: "",
            fullName: "",
            password: "",
            checkPassword: "",
            email: "",
            avatar: null
        });

    const [loginUserData, SetLoginUserData] = useState(
        {
            email: "",
            password: ""
        }
    )

    // for navigate login and signup button
    const [uploadFileIconHandler, setUploadFileIconHandler] = useState('tab-1');

    // loader handler
    const [loaderHandler, setLoaderHandler] = useState({ Login: false, Signup: false });

    // create dispatch function
    const dispatch = useDispatch();

    // const [isUserLogInHandleForm, SetIsUserLogInHandleForm] = useState(null);

    // navigate 
    const navigate = useNavigate();

    //onchange data handler to collect new user data from signup form
    const onchangeSingupHandler = (e) => {
        const { name, value } = e.target;
        // console.log("Signup name: " + name + " Signup value: " + value)
        SetSignupUserData(prev => ({ ...prev, [name]: value }))
        // console.log("new user: ", loginUserData)
    }

    // onchaneg data handler to collect old user data from login form
    const onchangeLoginHandler = (e) => {
        const { name, value } = e.target;
        // console.log("Login name: " + name + " Login value: " + value)
        SetLoginUserData(prev => ({ ...prev, [name]: value }))
    }

    // onchange handler for navigate login and signup button
    const onchangeBtnHandler = (e) => {
        setUploadFileIconHandler(e.target.id)
    }

    // file handler
    const fileHandler = (e) => {
        console.log("files: ", e.target.files[0])
        const file = e.target.files[0];
        if (!file) return;
        SetSignupUserData(prev => ({ ...prev, "avatar": file }));
    }

    // onSubmit handler for new user as SignUp
    const onsubmitToNewUser = async (e) => {
        e.preventDefault();

        console.log("new user: ", signupUserData)

        const { username, fullName, password, checkPassword, email } = signupUserData;
        // check re-type password and is data empty or not
        if (password !== checkPassword) {
            alert("Please add valid password🔑!");
            return;
        }

        if ([username, fullName, email].some(val => val?.trim() === "")) {
            alert("All input values are required")
            return;
        }

        try {
            // set loading true to signup
            setLoaderHandler(prev => ({ ...prev, Signup: true }))

            const formData = new FormData();
            formData.append('username', signupUserData.username);
            formData.append('fullName', signupUserData.fullName);
            formData.append('password', signupUserData.password);
            formData.append('email', signupUserData.email);
            if (signupUserData.avatar) {
                formData.append('avatar', signupUserData.avatar);
            }
            // send post request to server
            const respons = await axios.post(`${import.meta.env.VITE_API_LOGIN_AND_SIGNUP_URL}/register`, formData)
            console.log("new User successfull: ", respons)
            // check is response successfull
            if (respons?.status === 200) {
                // extract refresh token from response
                const { refreshToken, accessToken } = respons?.data?.data;
                const { _id, createdAt, avatar } = respons?.data?.data?.user
                localStorage.setItem('refreshToken', JSON.stringify({ _id, createdAt, avatar, refreshToken, accessToken }));
                SetSignupUserData({})
                navigate('/todo')
                dispatch(userLogIn(avatar));
            }
        } catch (error) {
            // Extract the error message using a regular expression
            const errorMessage = error.response.data.match(/<pre>(.*?)<br>/s);
            // alert user if error gets
            if (errorMessage) {
                alert(errorMessage[1])
                console.log('Error:', errorMessage[1]);
            }
            console.log("Error: ", error);
        } finally {
            // set loading false to signup
            setLoaderHandler(prev => ({ ...prev, Signup: false }))
        }
    }

    // onSubmit handler for login user
    const onsubmitToOldUser = async (e) => {
        e.preventDefault();
        const { email, password } = loginUserData
        if ([email, password].some(val => val.trim() === "")) {
            alert("All field is required!")
            return
        }
        try {
            // set loading true to login
            setLoaderHandler(prev => ({ ...prev, Login: true }))

            // send post request to server
            const respons = await axios.post(`${import.meta.env.VITE_API_LOGIN_AND_SIGNUP_URL}/login`, loginUserData)
            console.log("logIN: ", respons)
            // check is response successfull
            if (respons?.status === 200) {
                // extract refresh token from response
                const { refreshToken, accessToken } = respons?.data?.data;
                const { _id, createdAt, avatar } = respons?.data?.data?.user
                localStorage.setItem('refreshToken', JSON.stringify({ _id, createdAt, avatar, refreshToken, accessToken }));
                // set empty to form
                SetLoginUserData({})
                // navigate to todo route
                navigate('/todo')
                dispatch(userLogIn(avatar));
            }

        } catch (error) {
            // Extract the error message using a regular expression
            const errorMessage = error.response.data.match(/<pre>(.*?)<br>/s);
            console.log("errorMessage: ", errorMessage)
            // alert user if error gets
            if (errorMessage) {
                alert(errorMessage[1])
                console.log('Error:', errorMessage[1]);
            }
            console.log("Error: ", error);
        } finally {
            // set loading false to login
            setLoaderHandler(prev => ({ ...prev, Login: false }))
        }

    }

    return (
        <div className='login_wrap_container'>
            <LogInLeftSideCom />
            <div id='right_side_container'>
                <div className="login-wrap">
                    <div className="login-html">
                        <input
                            id="tab-1"
                            type="radio"
                            name="tab"
                            className="sign-in"
                            defaultChecked={true}
                            onChange={onchangeBtnHandler} />
                        <label
                            htmlFor="tab-1"
                            className="tab" >
                            LogIn</label>
                        <input
                            id="tab-2"
                            type="radio"
                            name="tab"
                            className="sign-up"
                            onChange={onchangeBtnHandler} />
                        {<label
                            htmlFor="tab-2"
                            className="tab"
                            style={JSON.parse(localStorage.getItem('refreshToken')) ?
                                {
                                    opacity: '0',
                                    pointerEvents: 'none'
                                }
                                : {}}>SignUp
                        </label>}
                        <div className="login-form">
                            <div className="sign-in-htm">
                                <InputBox
                                    labelName="Email Address"
                                    labelClass="label"
                                    forValue="pass"
                                    typeValue="text"
                                    inputClass="input"
                                    name="email"
                                    value={loginUserData}
                                    onchange={onchangeLoginHandler} />
                                <InputBox
                                    labelName="Password"
                                    labelClass="label"
                                    forValue="pass"
                                    typeValue="password"
                                    inputClass="input"
                                    name='password'
                                    value={loginUserData}
                                    onchange={onchangeLoginHandler} />
                                <SubmitBtn
                                    typeValue='submit'
                                    classValue="button"
                                    value="Sign In"
                                    onclick={onsubmitToOldUser}
                                    loading={loaderHandler.Login} />
                                <div className="hr"></div>
                                <div className="foot-lnk">
                                    <a href="#forgot">Forgot Password?</a>
                                </div>
                            </div>
                            {!JSON.parse(localStorage.getItem('refreshToken')) &&
                                < div className="sign-up-htm">
                                    <InputBox
                                        labelName="Full Name"
                                        labelClass="label"
                                        forValue="fullname"
                                        typeValue="text"
                                        inputClass="input"
                                        name="fullName"
                                        value={signupUserData}
                                        onchange={onchangeSingupHandler} />
                                    <InputBox
                                        labelName="Username"
                                        labelClass="label"
                                        forValue="user"
                                        typeValue="text"
                                        inputClass="input"
                                        name="username"
                                        value={signupUserData}
                                        onchange={onchangeSingupHandler} />
                                    <InputBox
                                        labelName="Password"
                                        labelClass="label"
                                        forValue="pass"
                                        typeValue="password"
                                        inputClass="input"
                                        name="password"
                                        value={signupUserData}
                                        onchange={onchangeSingupHandler} />
                                    <InputBox
                                        labelName="Repeat Password"
                                        labelClass="label"
                                        forValue="pass"
                                        typeValue="password"
                                        inputClass="input"
                                        name="checkPassword"
                                        value={signupUserData}
                                        onchange={onchangeSingupHandler} />
                                    <InputBox
                                        labelName="Email Address"
                                        labelClass="label"
                                        forValue="pass"
                                        typeValue="text"
                                        inputClass="input"
                                        name="email"
                                        value={signupUserData}
                                        onchange={onchangeSingupHandler} />
                                    <SubmitBtn
                                        typeValue='submit'
                                        classValue="button"
                                        value="Sign Up"
                                        onclick={onsubmitToNewUser}
                                        loading={loaderHandler.Signup} />
                                    <div className="hr"></div>
                                    <div className="foot-lnk">
                                        <label htmlFor="tab-1"><a>Already Member?</a></label>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                {uploadFileIconHandler === 'tab-2' &&
                    <FileUploader
                        signupUserData={signupUserData}
                        fileHandler={fileHandler}
                    />
                }
            </div>
        </div >
    )
}

export default LogInContainer