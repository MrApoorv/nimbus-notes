import React, { useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const Login = (props) => {
    const [creds,setCreds]=useState({email:"",password:""});
    const host="http://localhost:5000"
    let history=useHistory();
    const handleSubmit= async (e)=>{
        e.preventDefault();
        const response = await fetch(`${host}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email:creds.email,password:creds.password})
        });
        const json= await response.json();
        console.log(json);
        if(json.success){
            localStorage.setItem('token',json.authToken)
            props.showAlert("Login Successfull", 'success')
            history.push("/");
        }
        else{
            props.showAlert("Invalid Credentials", 'danger')
        }
    }
    const onChange = (e) => {
        setCreds({ ...creds, [e.target.name]: e.target.value })
    }
  return (
    <>
        <h1>Login to Continue to Nimbus Notes</h1>
      <form onSubmit={handleSubmit}>
          <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input type="email" className="form-control" id="email" value={creds.email} onChange={onChange} name="email" aria-describedby="emailHelp"/>
          </div>
          <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" value={creds.password} onChange={onChange} name="password" id="password"/>
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
      </form>
      </>
  )
}

export default Login