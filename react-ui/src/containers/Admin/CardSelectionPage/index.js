import React from "react"
import "./styles.css"
import { compose, lifecycle } from "recompose"
import CardSetTabs from "./components/CardSetTabs"
import { constants as adminConstants } from "reducers/Admin"
import { slide as Menu } from "react-burger-menu"
import MaterialIcon from "material-icons-react"
import { HKButton } from "@heroku/react-hk-components"

export default function CardSelectionPage(props) {
  const URL = process.env.REACT_APP_ENV ? "http://localhost:5000/admin/export" : "/admin/export"
  return (
    <div className="cardPage">
      <div className="sideBar">
        <Menu width="20%">
          <div className="row"><MaterialIcon icon="save_alt" color='white' />  <a id="home" className="menu-item" href={URL} >Export</a> </div>
        </Menu>
      </div>
      <HKButton className="hk-button--primary signOutBtn f3 mr3" onClick={props.adminUserSignOut} >Sign out</HKButton>
      <div className="pt7">
        <CardSetTabs {...props} />
      </div>
    </div>
  )
}
