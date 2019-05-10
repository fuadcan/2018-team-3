import firebaseConstArr from "./constants"
import firebase from "firebase"

firebase.initializeApp(firebaseConstArr)

export const auth = firebase.auth()

export const currentUser = firebase.auth().currentUser

export const database = firebase.database()

export const storageRef = firebase.storage().ref()

export const uiConfig = {
  signInFlow: "redirect",
  signInSuccessUrl: "/",
}

export default firebase
