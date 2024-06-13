import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { asClickEventHandler } from '../../features/todo/todoSlice'

const TodosArticle = () => {

    // extract store state
    const state = useSelector(state => state.todo?.todoDatatoUpdate.todoReadHandler);

    // console.log("state------------: ", state);
    // dispach function
    const dispatch = useDispatch();
    // state variable for article show
    const [articleShow, setArticleShow] = React.useState({ title: "", textarea: "" });

    // close button handler
    const closeBtnHandler = () => {
        dispatch(asClickEventHandler({ action: 'todoReadHandler', id: "" }));
    }

    useEffect(() => {
        setArticleShow(pre => (
            {
                ...pre,
                title: state?.title || '',
                textarea: state?.textarea || '',
            }
        ))
    }, [state]);


    return (
        <article className={`article_container ${state ? 'update_form_show' : 'update_form_hide'}`}>
            <div className="article_inner_container">
                <span
                    className="material-symbols-outlined"
                    id="close_btn"
                    onClick={closeBtnHandler}>
                    close
                </span>
                <h1 className="article_title">{articleShow.title}</h1>
                <p className="article_content">{articleShow.textarea}</p>
            </div>
        </article>
    )
}

export default TodosArticle