import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import { ProtectedRoute } from './ProtectedRoute'
import axios from 'axios'
import { axiosWithAuth } from './axiosWithAuth'



const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState(null)
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate("/",{ replace: true}) }/* ✨ implement */
  const redirectToArticles = () => { navigate("/articles",{ replace: true})} /* ✨ implement */

  const logout = () => {
    redirectToLogin()
    if(localStorage.getItem('token')){
      localStorage.removeItem('token')
      setMessage("Goodbye!")
    }
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

  const login = (form) => {
    
    setSpinnerOn(true)
    axiosWithAuth().post("/login", form)
    .then(res =>{
      console.log(res)
      localStorage.setItem("token", res.data.token)
      setMessage(res.data.message)
      redirectToArticles()
    })
    .catch(err=>{
      setMessage(err.response.data.message)
    })
    setSpinnerOn(false)
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  }

  const getArticles = () => {
    setMessage("")
    setSpinnerOn(true)

    axiosWithAuth().get("/articles")
    .then(res =>{
      console.log(res)
      setArticles(res.data.articles)
      setMessage(res.data.message)
    })
    .catch(err=>{
      setMessage(err.response.data.message)
    })

    setSpinnerOn(false)
    
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  }

  const postArticle = article => {  
    setMessage("")
    setSpinnerOn(true)
    axiosWithAuth().post("/articles", article)
    .then(res =>{
      console.log(res)
      setArticles([...articles, res.data.article]) 
      setMessage(res.data.message)
    })
    .catch(err=>{
      console.log({err})
    })

    setSpinnerOn(false)
    
  }
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  const putArticle=(article_id)=>{
    setCurrentArticleId(article_id)
  }

  const thisSubmit = (article) =>{
    if(currentArticleId){
      updateArticle(article)
    } else{
      postArticle(article)
    }
  }

  const updateArticle = article => {
    const { article_id, ...changes } = article
    setSpinnerOn(true)
    axiosWithAuth().put(`/articles/${article_id}`, changes)
    .then(res =>{
      setArticles(articles.map(art =>{
        return art.article_id === article_id ? res.data.article : art
      }))
      setMessage(res.data.message)
      setCurrentArticleId(null)
    })
    .catch(err=>{
      console.log({err})
    })
    setSpinnerOn(false)
  }
    // ✨ implement
    // You got this!

  const deleteArticle = article_id => {
     axiosWithAuth().delete(`articles/${article_id}`)
    .then(res =>{
      console.log(res)
      setMessage(res.data.message)
      setArticles(articles.filter(art => {
        art.articles_id !== article_id
      }))
    })
    .catch(err =>{
      console.log({err})
    })
  }
  
    // ✨ implement

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <React.StrictMode>
      <Spinner spinnerOn={spinnerOn}/>
      <Message message ={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login ={login}/>} />
          
          <Route path="/articles" element={
            <>
          <ProtectedRoute>
              <Articles 
              articles={articles}
              getArticles={getArticles} 
              message ={message}
              putArticle={putArticle} 
              deleteArticle={deleteArticle} 
              postArticle={postArticle}
              />
              <ArticleForm 
              thisSubmit={thisSubmit}
              articles={articles.find(art=> art.article_id === currentArticleId)}
              getArticles={getArticles}
              updateArticle={updateArticle} 
              deleteArticle={deleteArticle}
              postArticle={postArticle} 
              message={message}/>
              </ProtectedRoute>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </React.StrictMode>
  )
}
