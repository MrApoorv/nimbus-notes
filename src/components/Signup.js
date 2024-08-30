import React,{useState} from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const Signup = (props) => {
    const [creds, setCreds] = useState({name:"",email: "", password: "", cpassowrd:"" });
    const host = "http://localhost:5000"
    let history = useHistory();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const {name,email,password}=creds;
        const response = await fetch(`${host}/api/auth/createuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });
        const json = await response.json();
        console.log(json);
        if (json.success) {
            //Save token and redirect
            localStorage.setItem('token', json.authToken)
            props.showAlert("Account Created Successfully", 'success')
            history.push("/");
        }
        else {
            alert("Invalid creds")
        }
    }
    const onChange = (e) => {
        setCreds({ ...creds, [e.target.name]: e.target.value })
    }
    return (
        <div className='container'>
            <h1>Create account</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" onChange={onChange} name="name" aria-describedby="emailHelp" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" onChange={onChange} name="email" aria-describedby="emailHelp" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control"  onChange={onChange} name="password" id="password" minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control"  onChange={onChange} name="cpassword" id="cpassword" minLength={5} required />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    )
}

export default Signup