import React from "react"
import "./styles.css"
import { compose, withState, withHandlers, branch, renderComponent, lifecycle } from "recompose"
import PropTypes from "prop-types"
import { HKModal, HKButton } from "@heroku/react-hk-components"
import { Route, Switch, BrowserRouter } from "react-router-dom"
import { slide as Menu } from 'react-burger-menu'

export default function AdminMainPage(props) {
  return (<div className="">
    <Menu isOpen>
      <a id="home" className="menu-item" href="/admin/cards">Cardsets</a>
      <a id="contact" className="menu-item" href="/admin/export">Export</a>
    </Menu>
  </div>)
}

AdminMainPage.propTypes = {
  handleFormSubmit: PropTypes.func,
  handleInputChange: PropTypes.func,
}
