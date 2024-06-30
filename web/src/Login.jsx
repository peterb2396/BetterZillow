
import axios from 'axios'
import {useState} from "react"
const Login = (props) => {

  let ogButtonTxt = "Sign in";
  const [buttonText, setButtonText] = useState(ogButtonTxt)
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [confirm, setConfirm] = useState(false)
  const [error, setError] = useState()


  function login()
  {
    setButtonText("Logging in...")
    axios.post(`${props.SERVER_URL}/login`, {
      email: email,
      password: pass
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then ((res) => {
      // 200 means logged in
      // 201 means created new account, need to verify
      if (res.status === 201)
      {
        setConfirm(true)
      }
      else // logged in
      {
        // we need to retrieve the bookmarks and explored
        props.loggedIn(res.data)
      }
    })
    .catch((e) => {
      setError(e)
      console.log(e.response.data.message)

    })
  }
  if (error)
  {
    return (
      <div style = {{display: 'flex', justifyContent: 'center', height: "90vh", alignItems: 'center'}}> 
        <p>Oh no! An error occured.</p>
        <p>{error.code}: {error.response?.data.message? error.response.data.message : error.message}</p>
      </div>
    )
  }

  if (confirm)
  {
    return (
      <div style = {{display: 'flex', justifyContent: 'center', height: "90vh", alignItems: 'center'}}> 
        <p>Almost there!</p>
        <p>Please click the link in your email, and then refresh this page.</p>
      </div>
    )
  }

  
  return (
    <div style = {{display: 'flex', height: "90vh", justifyContent: 'center', alignItems: 'center'}}>
      <div className="login-container">
        <p style = {{fontWeight: 100, fontSize: 20, alignSelf: 'center'}}>Sign in/up</p>

        <div class="form-floating mb-3">
          <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" onChange={(e)=> {setEmail(e.target.value)}}/>
          <label for="floatingInput">Email</label>
        </div>
        
        <div class="form-floating">
          <input type="password" class="form-control" id="floatingPassword" placeholder="Password" onChange={(e)=> {setPass(e.target.value)}}/>
          <label for="floatingPassword">Password</label>
        </div>

        <button style = {{marginTop: 10}}disabled = {buttonText !== ogButtonTxt} type="button" class="btn btn-primary" onClick={login}>{buttonText}</button>

        
      </div>
    </div>
  );

  
  
};

export default Login;
