import React from "react"
import { compose, withState, withHandlers, branch, renderComponent } from "recompose"
import PropTypes from "prop-types"
import { HKButton } from "@heroku/react-hk-components"
import { constants as playersConstants } from "reducers/Players"
import { withFormik } from "formik"
import Header from "components/Header"

// components
import MainPage from "../MainPage"

import "./styles.css"

const InputFeedback = ({ error }) =>
  error ? <div className="input-feedback b f4">{error}</div> : null

const Label = ({ error, className, children, ...props }) => {
  return (
    <label className="label f3 black-60" {...props}>
      {children}
    </label>
  )
}

const TextInput = ({ type, id, label, error, value, onChange, className, ...props }) => {
  return (
    <div className="pb5">
      <Label htmlFor={id} error={error}>
        {label}
      </Label>
      <input
        id={id}
        className={`${className} username`}
        type={type}
        value={value}
        onChange={onChange}
        {...props}
      />
      <InputFeedback error={error} />
    </div>
  )
}

const EnhancedLoginPageForm = withFormik({
  mapPropsToValues: (props) => ({
    username: props.username,
  }),
  // Custom sync validation
  validate: values => {
    let errors = {};
    if (!values.username) {
      errors.username = "Required"
    } else {
      errors.username = ""
    }
    return errors
  },
})((props) => {
  return <form onSubmit={(e) => {
    e.preventDefault()
    props.handleSubmit()
    if (props.errors.username === "") {
      props.handleFormSubmit(props.values.username)
    }
  }}>
    <TextInput
      id="username"
      type="text"
      label="username"
      placeholder="Please enter your username..."
      error={props.touched.username && props.errors.username}
      value={props.values.username}
      onChange={props.handleChange}
      onBlur={props.handleBlur}
      className={props.errors.username ? "username error" : "username"}
    />
    <HKButton className="joinButton tc flex center" type="primary" onClick={() => {
      props.handleSubmit()
      if (props.errors.username === "") {
        props.handleFormSubmit(props.values.username)
      }}
    }> <div>Join</div> </HKButton>
    </form>
}
)

const LandingPage = (props) => {
  return (<React.Fragment>
    <Header gameStart={false} textToDisplay="Landing Page" />
    <div className="vh-100 flex justify-around align-center items-center landingPage flex-column">
      <div className="instructions f1 black-80 pa4">
        <div className="pa2 tc">
          <div className="b">
            Please read the below instructions before entering the game room:
          </div>
          <div className="list instructionsText">
            <li className="pa2"> There are a total of 4 participants in the game who have 4 cards each. </li>
            <li className="pa2"> The goal of the game is to exchange cards until each participant is able to form a set of 4 cards of a kind. </li>
            <li className="pa2"> Drag and drop a card into a player box to trade cards with another user.</li>
          </div>
        </div>
      </div>
      <div className="wrapper">
        <EnhancedLoginPageForm {...props} />
      </div>
    </div>
  </React.Fragment>)
}

LandingPage.propTypes = {
  handleFormSubmit: PropTypes.func,
  handleInputChange: PropTypes.func,
  setInstructions: PropTypes.func,
  showInstructions: PropTypes.bool,
}

export default compose(
  withState("username", "setUsername", ""),
  withState("showInstructions", "setInstructions", false),
  withHandlers({
    handleInputChange: ({ setUsername }) => (e) => {
      setUsername(e.target.value)
    },
    handleFormSubmit: (props) => (username) => {
      props.dispatch({
        type: playersConstants.CREATE_PLAYER,
        username: username
      })
    }
  }),
  branch(
    ({ isLoggedIn }) => isLoggedIn,
    renderComponent(MainPage),
  )
)(LandingPage)
