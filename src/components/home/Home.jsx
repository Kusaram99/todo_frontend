import React from 'react'
import './Home.css'
import { useNavigate } from 'react-router-dom'

const Home = () => {

    const navigate = useNavigate()

    return (

        <div className='home_container'>
            <div className='home_inner_container'>
                <h1>Make Your Daily Routien</h1>
                <p className='m-10'>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                <div className='home_btn_container'> 
                    {!localStorage.getItem('refreshToken') ?
                        <button
                        onClick={()=> navigate('/login')}
                        className='login_btn'>Let's create a account</button>
                        :
                        <button 
                        onClick={()=> navigate('/todo')}
                        className='signup_btn'>Let's Create</button>
                    }
                </div>
            </div>
        </div>
    )
}

export default Home;