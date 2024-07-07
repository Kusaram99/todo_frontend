import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { asClickEventHandler, updateTodo } from '../../features/todo/todoSlice';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import axios from 'axios';
import Loader from '../loader/Loader';

// Define toolbar options
const modules = {
    toolbar: [
        // [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'color': [] }, { 'background': [] }],
    ],
};

const TodosArticle = () => {
    // extract store state
    const state = useSelector(state => state.todo?.todoDatatoUpdate.todoReadHandler);

    const dispatch = useDispatch();
    // state variable for article show
    const [articleShow, setArticleShow] = useState({ title: "", textarea: "" });
    const [loaderHandler, setLoaderHandler] = useState(false);

    const quillRef = useRef(null);

    // close button handler
    const closeBtnHandler = () => {
        dispatch(asClickEventHandler({ action: 'todoReadHandler', id: "" }));
    };

    // onchnage handler of quill
    const quillHandler = (value) => {
        setArticleShow(prev => ({ ...prev, textarea: value }))
        console.log(value)
    }

    // useEffect initial values handler
    useEffect(() => {
        console.log("state: ", state)
        setArticleShow(prev => ({
            ...prev,
            title: state?.title || '',
            textarea: state?.textarea || '',
        }));
    }, [state]);

    // save changes handler
    const saveHandler = async () => {
        console.log(quillRef.current?.value)
        setLoaderHandler(true);

        // accessToken with header for update todo
        const { accessToken } = JSON.parse(localStorage.getItem('refreshToken'));
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        // form data for update todo
        const updatedTodoData = {
            title: articleShow.title,
            textarea: quillRef.current?.value,
            todoId: state._id
        };

        try {

            const response = await axios.patch(`${import.meta.env.VITE_API_TODO_URL}/update-todo`, updatedTodoData, { headers });

            if (response?.status === 200) {
                console.log("response: ", response);
                dispatch(updateTodo(response.data.data));
                alert("Data successfully saved");
                setLoaderHandler(!loaderHandler)
            }


        } catch (error) {
            if (error.response?.status === 401) {
                console.log("Error: ", error)
                handleTokenExpiration(updatedTodoData);
            } else {
                const errorMessage = error.response.data.match(/<pre>(.*?)<br>/s);
                alert(errorMessage[1]);
                console.log("Error updating todo: ", error);
            }
        } finally {
            setLoaderHandler(false);
            dispatch(asClickEventHandler({ action: 'todoReadHandler', id: "" }));
        }

        const handleTokenExpiration = async (data) => {

            try {
                const { refreshToken } = JSON.parse(localStorage.getItem('refreshToken'));
                const response = await axios.post(`${import.meta.env.VITE_API_LOGIN_AND_SIGNUP_URL}/token`, {
                    refreshToken: `Bearer ${refreshToken}`
                });

                if (response?.status === 200) {
                    refreshTokenHandler(response, data);
                }
            } catch (error) {
                navigate('/login');
                console.error("Refresh token is expired: ", error);
            }
        };

        const refreshTokenHandler = async (resp, data) => {

            if (resp?.status === 200) {
                try {
                    const { refreshToken, accessToken } = resp.data.data;
                    const oldStorage = JSON.parse(localStorage.getItem('refreshToken'));

                    oldStorage.refreshToken = refreshToken;
                    oldStorage.accessToken = accessToken;
                    localStorage.setItem('refreshToken', JSON.stringify(oldStorage));

                    const headers = {
                        'Authorization': `Bearer ${accessToken}`
                    };

                    const response = await axios.put(`${import.meta.env.VITE_API_TODO_URL}/update-todo`, data, { headers });

                    if (response?.status === 200) {
                        dispatch(updateTodo(response.data.data));
                        alert("Data successfully saved");
                        setLoaderHandler(!loaderHandler);
                    }
                } catch (error) {
                    console.error("Error after refreshing token: ", error);
                }
            }
        };

    };

    return (
        <article className={`article_container ${state ? 'update_form_show' : 'update_form_hide'}`}>
            <div className="article_inner_container">
                <span
                    className="material-symbols-outlined"
                    id="close_btn"
                    onClick={closeBtnHandler}
                >
                    close
                </span>

                <h1 className="article_title">{articleShow.title}</h1>

                <ReactQuill
                    ref={quillRef}
                    theme="bubble"
                    value={articleShow.textarea}
                    modules={modules}
                    onChange={quillHandler}
                />

                <div>

                    {/* <button className="btn" onClick={saveHandler}>Save</button> */}

                    {articleShow?.textarea.length !== state?.textarea.length &&
                        <button
                            type='submit'
                            value="update"
                            className="btn"
                            onClick={saveHandler}
                            disabled={loaderHandler} >
                            {loaderHandler ?
                                <Loader width='30' height='30' />
                                :
                                "Save changes"
                            }
                        </button>
                    }
                </div>
            </div>
        </article>
    );
};

export default TodosArticle;