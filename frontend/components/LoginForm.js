import React, { useState } from 'react'
import PT from 'prop-types'
import { axiosWithAuth } from './axiosWithAuth'



export default function LoginForm(props) {
  const { login } = props
  const [form, setForm] = useState({username: "", password: ""})
  
  // ✨ where are my props? Destructure them here

  const onChange = (evt) => {
    setForm({ ...form,
      [evt.target.name]: evt.target.value.trim()})
  }

  const onSubmit = evt => {
    evt.preventDefault()
    login(form)
    setForm({
      ...form,
      username: "",
      password: ""
    })
  }
  
  // ✨ implement

  const isDisabled = () => {
  if(form.username.length >=3 &&
    form.password.length >=8 ){
      return false
    }else{
      return true
    }
    }
  
    // ✨ implement
    // Trimmed username must be >= 3, and
    // trimmed password must be >= 8 for
    // the button to become enabled
  

  return (
    <form id="loginForm" onSubmit={onSubmit}>
      <h2>Login</h2>
      <input
        name="username"
        maxLength={20}
        value={form.username}
        onChange={onChange}
        placeholder="Enter username"
        id="username"
      />
      <input
        type="password"
        name="password"
        maxLength={20}
        value={form.password}
        onChange={onChange}
        placeholder="Enter password"
        id="password"
      />
      <button type="submit" 
      
      disabled={
       isDisabled()
      }
      
      id="submitCredentials">Submit credentials</button>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
LoginForm.propTypes = {
  login: PT.func.isRequired,
}
