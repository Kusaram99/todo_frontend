import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTodo } from '../../features/todo/todoSlice'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../loader/Loader';

const FormMain = () => {

    const [formData, SetFormData] = useState({ title: "", textarea: "" });

    // loader handler as submit button
    const [loaderHandler, setLoaderHandler] = useState(undefined);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // onchange handler
    const onchangeHandler = (e) => {
        const { name, value } = e.target;
        SetFormData(prev => ({ ...prev, [name]: value }));
    }

    const onsubmitHandler = async (e) => {
        e.preventDefault();

        console.log("form data.....", formData)
        const { _id, accessToken } = JSON.parse(localStorage.getItem('refreshToken')) || {};
        if (!_id || !accessToken) {
            alert("Please log In once!");
            navigate("/login")
            return;
        }

        const { title, textarea } = formData;
        if ([title, textarea].some(val => val.trim() === "")) {
            alert("All fields are required!");
            return
        }
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        const todoData = {
            ...formData,
            userId: _id
        };

        try {
            setLoaderHandler(true);
            const response = await axios.post(`${import.meta.env.VITE_API_TODO_URL}/add-todo`, todoData, { headers });
            // console.log("first response: ",response)
            if (response?.status === 200) {
                // console.log("first condition..............")
                dispatch(addTodo(response.data.data));
                SetFormData({ title: "", textarea: "" })
            }
        } catch (error) {
            console.log("Main errror", error)
            if (error.response?.status === 401) {
                handleTokenExpiration(todoData);
            } else {
                console.log("Error adding todo: ", error);
            }
        } finally {
            // set false to loaderHandler
            setLoaderHandler(false);
        }
    };

    const handleTokenExpiration = async (todoData) => {

        try {
            const { refreshToken } = JSON.parse(localStorage.getItem('refreshToken'));
            const response = await axios.post(`${import.meta.env.VITE_API_LOGIN_AND_SIGNUP_URL}/token`, {
                refreshToken: `Bearer ${refreshToken}`
            });

            if (response?.status === 200) {
                refreshTokenHandler(response, todoData);
            }
        } catch (error) {
            navigate('/login');
            console.error("Refresh token is expired: ", error);
        }
    };

    const refreshTokenHandler = async (response, todoData) => {
        // console.log("refresh Todo: ", todoData)
        if (response?.status === 200) {
            try {
                const { refreshToken, accessToken } = response.data.data;
                const oldStorage = JSON.parse(localStorage.getItem('refreshToken'));

                oldStorage.refreshToken = refreshToken;
                oldStorage.accessToken = accessToken;
                localStorage.setItem('refreshToken', JSON.stringify(oldStorage));

                const headers = {
                    'Authorization': `Bearer ${accessToken}`
                };
                console.log("oldStorage: ", oldStorage)
                const retryResponse = await axios.post(`${import.meta.env.VITE_API_TODO_URL}/add-todo`, todoData, { headers });

                if (retryResponse?.status === 200) {
                    // console.log("second condition.................") 
                    dispatch(addTodo(retryResponse.data.data));
                }
            } catch (error) {
                console.log("Error after refreshing token: ", error);
            }
        }
    };


    return (
        <div className="form-container">
            <form className="todo-form" onSubmit={onsubmitHandler}>
                <div className="input_box">
                    <label htmlFor="todo">Title</label>
                    <input
                        className="todo-input "
                        type="text"
                        placeholder="Write here..."
                        name="title"
                        id="todo"
                        required
                        value={formData.title}
                        onChange={onchangeHandler} />
                </div>
                <div className="input_box">
                    <label htmlFor='textarea'>Notes</label>
                    <textarea
                        className="todo-input textarea"
                        name="textarea"
                        id="textarea"
                        required
                        placeholder="Write here..."
                        value={formData.textarea}
                        onChange={onchangeHandler}>
                    </textarea>
                </div>
                <div style={{
                    display: "flex",
                    flexDirection: "column", 
                    alignItems: "flex-start"
                }}>
                   {loaderHandler && <Loader />}
                    <button id="submit_btn">Submit</button>
                </div>
            </form >
        </div >
    )
}

export default FormMain