import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/auth"
import "firebase/compat/storage"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "fii-practic-bytex.firebaseapp.com",
  projectId: "fii-practic-bytex",
  storageBucket: "fii-practic-bytex.appspot.com",
  messagingSenderId: "1096904424169",
  appId: "1:1096904424169:web:9ff793371d58ef9c768e78",
}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

export { auth, db, storage }
export default firebase
