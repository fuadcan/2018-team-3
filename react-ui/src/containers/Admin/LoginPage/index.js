import React from "react"
import { auth } from "../../../firebase"
import { compose, withState, withHandlers } from "recompose"
import PropTypes from "prop-types"
import "./styles.css"
import { HKButton } from "@heroku/react-hk-components"
import Header from "components/Header"

const AdminLoginPage = (props) => {
  return (<React.Fragment>
    <Header gameStart={false} textToDisplay="Admin page" />
    <div className="vh-100 flex justify-around align-center items-center landingPage flex-column">
      <div>
        <form className="wrapper">
          <input onChange={props.handleUsernameChange} className="loginPageInput userName" placeholder="Email" />
          <input type="password" onChange={props.handlePasswordChange} className="loginPageInput passWord" placeholder="Password" />
          <HKButton onClick={props.handleSignUp} className="loginBtn" type="primary">Login</HKButton>
        </form>
      </div>
    </div>
  </React.Fragment>)
}

AdminLoginPage.propTypes = {
  handleFormSubmit: PropTypes.func,
  handleUsernameChange: PropTypes.func,
  handlePasswordChange: PropTypes.func,
}

export default compose(
  withState("username", "updateUsername", ""),
  withState("password", "setPassword", ""),
  withHandlers({
    handleUsernameChange: ({ updateUsername }) => (e) => {
      updateUsername(e.target.value)
    },
    handlePasswordChange: ({ setPassword }) => (e) => {
      setPassword(e.target.value)
    },
    handleSignUp: (props) => async event => {
      event.preventDefault()
      try {
        const user = await auth
          .signInWithEmailAndPassword(props.username, props.password)
        localStorage.setItem("adminLoggedIn", true)
        props.history.push("/admin/cards")
      } catch (error) {
        alert(error)
      }
    }
  }),
)(AdminLoginPage)
