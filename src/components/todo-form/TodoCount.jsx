import React from 'react'
import { useSelector } from 'react-redux'

const TodoCount = () => {
    const state = useSelector(state => state.todo.todos || []);
    return (
        <div className="score_container">
            <div className="score_box_1">
                <span>TOTAL NOTES : {state?.length}</span>
                {/* <span id="total_notes"> 0</span> */}
            </div>
        </div>)
}

export default TodoCount