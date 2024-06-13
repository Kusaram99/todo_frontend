import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'

// fetch todos 
export const fetchTodos = createAsyncThunk('action/fetchTodos', async () => {

    const local = localStorage.getItem('refreshToken');
    if (!local) {
        return []
    } else {
        try {

            // extract user auth from local storage
            const { _id, accessToken } = JSON.parse(local);
            const headers = {
                'Authorization': `Bearer ${accessToken}`
            };

            // send request
            const response = await axios.get(`${import.meta.env.VITE_API_TODO_URL}/get-user-data/${_id}`, { headers })
            return response?.data?.data?.result
        } catch (error) {
            if (error.response?.status === 401) {
                return await handleTokenExpiration();
            } else {
                console.log("Error adding todo: ", error);
            }
            console.log("error:========== ", error)
        }
        // return response.data
    }
    return [];
})

// expired token handler
const handleTokenExpiration = async () => {

    try {
        const { refreshToken } = JSON.parse(localStorage.getItem('refreshToken'));
        const response = await axios.post(`${import.meta.env.VITE_API_LOGIN_AND_SIGNUP_URL}/token`, {
            refreshToken: `Bearer ${refreshToken}`
        });

        if (response?.status === 200) {
            return await refreshTokenHandler(response);
        }
    } catch (error) {
        console.error("Refresh token is expired: ", error);
    }
};

// handle refresh token and then sen get request to the server
const refreshTokenHandler = async (response) => {
    if (response?.status === 200) {
        try {
            // store new generated token to the localstorage
            const { refreshToken, accessToken } = response.data.data;
            const oldStorage = JSON.parse(localStorage.getItem('refreshToken'));
            oldStorage.refreshToken = refreshToken;
            oldStorage.accessToken = accessToken;
            localStorage.setItem('refreshToken', JSON.stringify(oldStorage));

            // get user todos document
            const { _id } = oldStorage;
            const headers = {
                'Authorization': `Bearer ${accessToken}`
            };
            const result = await axios.get(`${import.meta.env.VITE_API_TODO_URL}/get-user-data/${_id}`, { headers })
            return result?.data?.data?.result
        } catch (error) {
            console.log("Error after refreshing token: ", error);
        }
    }
    return []
};

// to get avatar url in intial stage if user all ready login
const { avatar } = JSON.parse(localStorage.getItem('refreshToken')) || {};

const initialState = {
    todos: [],
    todoDatatoUpdate: {
        formDataUpdateHandler: undefined,
        alertHandler: false,
        todoReadHandler: undefined,
    },
    isUserLogIn: avatar || "",
    loading: false,
    error: null,
}


const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        addTodo: (state, action) => {
            // console.log("action.payload: ", action.payload);
            const todo = {
                ...action.payload
            }
            state.todos.push(todo);
        },
        deleteTodo: (state, action) => {
            // console.log("delte---action.payload: ", action.payload);
            state.todos = state.todos.filter(todo => todo._id !== action.payload);
        },
        updateTodo: (state, action) => {
            // console.log("-updateTodo: ", action.payload);
            const todos = state.todos.map(todo => {
                if (todo._id === action.payload._id) {
                    todo.title = action.payload.title;
                    todo.textarea = action.payload.textarea;
                }
                return todo;
            })
            state.todos = todos;
        },
        asClickEventHandler: (state, action) => {
            console.log("asClickEventHandler action.payload---------: ", action.payload);
            if (action.payload.action === 'formDataUpdateHandler') {
                // her find method will return array's first element if condition match elese return undefined
                state.todoDatatoUpdate.formDataUpdateHandler = state.todos.find(todo => todo._id === action.payload._id);
            }
            else if (action.payload.action === 'todoReadHandler') {
                // her find method will return array's first element if condition match elese return undefined
                state.todoDatatoUpdate.todoReadHandler = state.todos.find(todo => todo._id === action.payload._id);
            } else if (action.payload.action === 'alertHandler') {
                state.todoDatatoUpdate.alertHandler = action.payload.alertHandler;
            }
        },
        userLogIn: (state, action) => {
            state.isUserLogIn = action.payload;
        },
        userLogOut: (state, action) => {
            state.isUserLogIn = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                // console.log("payload: ", action.payload)w
                state.loading = false;
                state.todos = action.payload;
                // console.log("state.todo: ---", state.todos)
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message
            })
    }
})

export const {
    addTodo,
    deleteTodo,
    updateTodo,
    asClickEventHandler,
    userLogOut,
    userLogIn
} = todoSlice.actions;

export default todoSlice.reducer;