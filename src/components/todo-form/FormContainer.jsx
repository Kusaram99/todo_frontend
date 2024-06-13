import React,{useEffect} from 'react'
import TodoCount from './TodoCount'
import FormMain from './FormMain'
import Box from '../todosbox/Box'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTodos } from '../../features/todo/todoSlice'

const FormContainer = () => {

    // extract store state 
    const state = useSelector(state => state.todo.todos || []);
    // console.log("state: ", state);
    const dispatch = useDispatch();

    console.log()

    // call the fetchTodo function to get todos from server
    useEffect(() => {
        const local = localStorage.getItem('refreshToken');
        if(local){
            dispatch(fetchTodos());
        }
    }, [])

    return (
        <section className="todo-container">
            <TodoCount />
            <FormMain />
            <div className="todo-list">
                {
                    state.map((todo, index) => (
                        <Box key={todo._id} todo={todo} index={index} />
                    ))
                }
            </div>
        </section>
    )
}

export default FormContainer