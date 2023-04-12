import React, { useState, useEffect } from "react"
import { Input } from "antd"
import AuthLayout from "../../common/components/layout/Auth"
import { auth, db } from "../../utils/firebase"
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

    const user = auth.currentUser
    const uid = user.uid
    db.collection("users")
      .where("userId", "==", uid)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data()
          const username = userData.username
          console.log("Username:", username)
        } else {
          console.log("No user with this UID found.")
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error)
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
