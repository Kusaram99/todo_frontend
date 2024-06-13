import React from 'react'
import FormContainer from './FormContainer'
import FormUpdate from '../form-update/FormUpdate'
import TodosArticle from '../todosbox/TodosArticle' 

const FormMainContainer = () => {
 
    return (
        <React.Fragment>
            <FormUpdate />
            <FormContainer />
            <TodosArticle />
        </React.Fragment>
    )
}

export default FormMainContainer