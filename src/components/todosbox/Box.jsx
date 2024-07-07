import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { deleteTodo, asClickEventHandler } from '../../features/todo/todoSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../loader/Loader';

const Box = ({ index, todo }) => {

    // console.log("todo in box: ", todo);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [deleteBtnLoader, setDeleteBtnLoader] = useState(undefined);
    const textAreaRef = useRef(null);

    const deleteHandler = async (todoId) => {
        // enable loading icon for delete button
        setDeleteBtnLoader(todoId);
        try {
            const { accessToken } = JSON.parse(localStorage.getItem('refreshToken'));
            const headers = {
                'Authorization': `Bearer ${accessToken}`
            };

            const response = await axios.delete(`${import.meta.env.VITE_API_TODO_URL}/delete-todo/${todoId}`, { headers });

            if (response?.status === 200) {
                dispatch(deleteTodo(todoId));
            }
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    const { refreshToken } = JSON.parse(localStorage.getItem('refreshToken'));
                    const refreshResponse = await axios.post(`${import.meta.env.VITE_API_LOGIN_AND_SIGNUP_URL}/token`, {
                        refreshToken: `Bearer ${refreshToken}`
                    });

                    if (refreshResponse?.status === 200) {
                        handleTokenRefresh(refreshResponse, todoId);
                    }
                } catch (refreshError) {
                    navigate('/login');
                    console.error("Refresh token is expired: ", refreshError);
                }
            } else {
                console.error("Error deleting todo: ", error);
            }
        } finally {
            // disable loading icon for delete button
            setDeleteBtnLoader("")
        }
    };

    const handleTokenRefresh = async (res, todoId) => {
        if (res?.status === 200) {
            try {
                const { refreshToken, accessToken } = res.data.data;
                const oldStorage = JSON.parse(localStorage.getItem('refreshToken'));

                oldStorage.refreshToken = refreshToken;
                oldStorage.accessToken = accessToken;
                localStorage.setItem('refreshToken', JSON.stringify(oldStorage));

                const headers = {
                    'Authorization': `Bearer ${accessToken}`
                };

                const response = await axios.delete(`${import.meta.env.VITE_API_TODO_URL}/delete-todo/${todoId}`, { headers });

                if (response?.status === 200) {
                    dispatch(deleteTodo(todoId));
                }
            } catch (error) {
                console.error("Error after refreshing token: ", error);
            }
        }
    };

    useEffect(() => {
        // console.log("ref", textAreaRef.current)
        textAreaRef.current.innerHTML = todo.textarea?.length > 560 ? todo.textarea?.slice(0, 560) + "..." : todo.textarea + "...";
    })

    return (
        <div className="list-container">

            <h3 className="l-h3"> {index + 1})
                <span className="num">{todo.title.length > 28 ? todo.title.slice(0, 28) + '...' : todo.title}</span>
            </h3>
            <p className="l-p">
                {/* {todo.textarea?.length > 560 ? todo.textarea?.slice(0, 560) + "..." : todo.textarea + "..."} */}
                <span ref={textAreaRef}></span>
                <span
                    className="read_more_btn"
                    onClick={() => dispatch(asClickEventHandler({ action: 'todoReadHandler', _id: todo._id }))}>
                    Read 📖
                </span>
            </p>
            <div className="time-container">
                <span className="date_text">Date: </span><span className="current_date">{new Date(todo.createdAt).toDateString()}</span>
            </div>
            <div className='box_btn_container'>
                <button
                    style={deleteBtnLoader === todo._id ? { pointerEvents: 'none', cursor: 'not-allowed', opacity: "0.5" } : {}}
                    className="btn deleteBtn"
                    onClick={() => deleteHandler(todo._id)}>
                    {deleteBtnLoader === todo._id ?
                        <Loader width='30' height='30' />
                        :
                        "Delete"
                    }
                </button>
                <button
                    className="btn"
                    onClick={() => dispatch(asClickEventHandler({ action: 'formDataUpdateHandler', _id: todo._id }))}>Edit</button>
            </div>
        </div>
    )
}

export default Box