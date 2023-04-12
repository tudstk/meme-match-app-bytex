import React, { useState } from "react"
import { Input } from "antd"
import AuthLayout from "../../common/components/layout/Auth"
import { auth } from "../../utils/firebase"
import { useNavigate } from "react-router-dom"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [signupError, setSignupError] = useState("")

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        localStorage.setItem("isLoggedIn", "true")
        navigate("/")
      })
      .catch((error) => {
        setSignupError(error.message)
      })
  }

  return (
    <AuthLayout
      errorMessage={signupError}
      submitText="Login"
      redirectLink="/auth/register"
      redirectLinkText="Register"
      handleSubmit={handleLogin}
    >
      <Input
        autoComplete="email"
        label="Email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        autoComplete="password"
        type="password"
        label="Password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
    </AuthLayout>
  )
}

export default Login
