import React, { useEffect, useState } from 'react'
import PT from 'prop-types'
import { axiosWithAuth } from './axiosWithAuth'

const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm(props) {
  const { postArticle, articles, currentArticleId, updateArticle, thisSubmit} = props
  const [values, setValues] = useState(initialFormValues)
  // ✨ where are my props? Destructure them here

  useEffect(()=>{
    if(articles) {
      setValues(articles)
    } else {
      setValues(initialFormValues)
    }
  },[articles])

  const onChange = (evt) => {
    setValues({ ...values,
      [evt.target.name]: evt.target.value})
  }

  const onSubmit = evt => {
    evt.preventDefault()
    thisSubmit(values)
    setValues(initialFormValues)
    }
    // ✨ implement
    // We must submit a new post or update an existing one,
    // depending on the truthyness of the `currentArticle` prop.
  // const resetForm =()=>{
  //   setValues({
  //     ...values,
  //     title: "",
  //     text: "",
  //     topic:""
  //   })
  // }
  const isDisabled = () => {
    if(values.title.length >=3 &&
       values.text.length >=3 &&
       values.topic !== ""
    ){
      return false
    }else{
      return true
    }
    // ✨ implement
    // Make sure the inputs have some values
  }

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>Create Article</h2>
      <input
        name="title"
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        name="text"
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange}
        name="topic" id="topic" 
        value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button type="submit" disabled={isDisabled()} id="submitArticle">Submit</button>
        <button >Cancel edit</button>
      </div>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
