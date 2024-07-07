import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { asClickEventHandler, updateTodo } from '../../features/todo/todoSlice'
import axios from 'axios'
import Loader from '../loader/Loader';


import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


// Define toolbar options
const modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'color': [] }, { 'background': [] }],
    ],
};


const FormUpdate = () => {
    // extract store state
    const state = useSelector(state => state.todo?.todoDatatoUpdate.formDataUpdateHandler);

    // state variable for form data handler
    const [formData, SetFormData] = useState({ title: "", textarea: "" });

    const quillRef = useRef(null);

    // create dispatch function
    const dispatch = useDispatch();

    // lader handler variable
    const [loaderHandler, setLoaderHandler] = useState(undefined);

    // onchange handler 
    const onchangeHandler = (e) => {
        const { name, value } = e.target;
        SetFormData(prev => ({ ...prev, [name]: value }));
    }

    // quill onchange handler
    const quillHandler = (value) => {
        SetFormData(prev => ({ ...prev, textarea: value }))
        // console.log("quill values: ", value)
    }

    // update handler
    const updateHandler = async (e) => {
        e.preventDefault();

        // get value of buttons as user click
        const action = e.nativeEvent.submitter.value;

        // accessToken with header for update todo
        const { accessToken } = JSON.parse(localStorage.getItem('refreshToken'));
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        // form data for update todo
        const updatedTodoData = {
            ...formData,
            todoId: state._id
        };

        if (action === 'update') {
            try {
                setLoaderHandler(true);
                const response = await axios.patch(`${import.meta.env.VITE_API_TODO_URL}/update-todo`, updatedTodoData, { headers });

                if (response?.status === 200) {
                    console.log("response: ", response);
                    dispatch(updateTodo(response.data.data));
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
            }
        } else if (action === 'cancel') {
            console.log('Form submission was canceled.');
        }
        dispatch(asClickEventHandler({ action: 'formDataUpdateHandler', id: "" }));
    };

    const handleTokenExpiration = async (updatedTodoData) => {

        try {
            const { refreshToken } = JSON.parse(localStorage.getItem('refreshToken'));
            const response = await axios.post(`${import.meta.env.VITE_API_LOGIN_AND_SIGNUP_URL}/token`, {
                refreshToken: `Bearer ${refreshToken}`
            });

            if (response?.status === 200) {
                refreshTokenHandler(response, updatedTodoData);
            }
        } catch (error) {
            navigate('/login');
            console.error("Refresh token is expired: ", error);
        }
    };

    const refreshTokenHandler = async (resp, updatedTodoData) => {
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

                const response = await axios.put(`${import.meta.env.VITE_API_TODO_URL}/update-todo`, updatedTodoData, { headers });

                if (response?.status === 200) {
                    dispatch(updateTodo(response.data.data));
                }
            } catch (error) {
                console.error("Error after refreshing token: ", error);
            }
        }
    };


    useEffect(() => {
        SetFormData(pre => (
            {
                ...pre,
                title: state?.title || '',
                textarea: state?.textarea || '',
            }
        ))
    }, [state]);

    return (
        <div className={`todo_update_container ${state ? 'update_form_show' : 'update_form_hide'}`}>
            <div className="form-container form-container2">
                <form className="todo-form" onSubmit={updateHandler}>
                    <div className="input_box">
                        <label htmlFor="title">Title</label>
                        <input
                            className="todo-input title_text_update"
                            type="text"
                            placeholder="Write here..."
                            name="title"
                            id="todo"
                            value={formData?.title}
                            onChange={onchangeHandler} />
                    </div>

                    <div style={{ marginTop: "10px" }}>
                        <label>Textarea</label>

                        <ReactQuill
                            value={formData.textarea}
                            ref={quillRef}
                            modules={modules}
                            style={{
                                maxHeight: "200px",
                                height: 'auto'
                            }}
                            onChange={quillHandler} />
                    </div>

                    <div className="update_btn_container box_btn_container ">
                        <button
                            type='submit'
                            value="update"
                            className="update_btn deleteBtn" >
                            {loaderHandler ?
                                <Loader width='30' height='30' />
                                :
                                "Update"
                            }
                        </button>
                        <button
                            className="update_btn"
                            type='submit'
                            value="cancel">Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div >
    )
}

export default FormUpdate