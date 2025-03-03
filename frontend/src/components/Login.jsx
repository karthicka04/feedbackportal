import React,{useState,useEffect} from 'react'
import axios from "axios";
import Loader from "../compo/Loader";
import Error from "../compo/Error";
function Login() {
   
    const[email,setemail]=useState('')
    const[password,setpassword]=useState('')
    const[error,setError]=useState('')
   
    const [loading,setloading] = useState(false);
   
    async function login()
    {
        
            const user={
               
                email,
                password
               
            }
            try {
                    setloading(true);
                    const { data } = await axios.post('http://localhost:5000/api/auth/login',user);
                    
                    
                    setloading(false);

                    localStorage.setItem('currentUser',JSON.stringify(data));
                    window.location.href='/home'
                   
                    
                  } catch (error) {
                    setloading(false);
                    setError(true);
                  }
           
       
    }

  return (
    <div>
        {loading && (<Loader/>)}
        <div className="row justify-content-center mt-5">
            <div className="col-md-5 mt-5">
                {error && (<Error message='Invalid Credentials'/>)}
                <div className="bs">
                    <h2>Login</h2>
                   
                    <input type="text" className="form-control" placeholder="email" value={email} onChange={(e)=>{setemail(e.target.value)}}/>
                    <input type="text" className="form-control" placeholder="password" value={password} onChange={(e)=>{setpassword(e.target.value)}}/>
                    <button className='btn btn-primary mt-3' onClick={login}>Login</button>

                </div>
            </div>
        </div>
    </div>
  )
}

export default Login