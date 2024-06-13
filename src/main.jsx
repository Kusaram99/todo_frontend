import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store } from './app/app.js'
import { Provider } from 'react-redux'
import Home from './components/home/Home'
import { RouterProvider, createBrowserRouter, Route, createRoutesFromElements } from 'react-router-dom'
import FormMainContainer from './components/todo-form/FormMainContainer.jsx'
import LogInContainer from './components/loginpages/LogInContainer.jsx'
import Layouts from './components/private-components/Layouts.jsx'

// routing 
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} >
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<LogInContainer />} />
      <Route element={<Layouts />} >
        <Route path="todo" element={<FormMainContainer />} />
      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)


