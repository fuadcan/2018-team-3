import React from "react"
import "./styles.css"
import { slide as Menu } from "react-burger-menu"
import MaterialIcon from "material-icons-react"
import { constants as adminConstants } from "reducers/Admin"
import axios from "axios"

export default function AdminMainPage(props) {
    const handleExport = () =>{
        console.log(props)
        axios.get("/admin/export")
            .then(function (response) {
                console.log(response)
            })
            .then(function (error) {
                console.log(error)
            })
    }

    return (
        <div className="exportContainer">
            <div>
                <Menu width={"20%"}>
                    <div className="row"><MaterialIcon icon="view_module" color="white" />  <a id="home" className="menu-item" href="/admin/cards">Cardsets</a> </div>
                </Menu>
            </div>
            <div className="buttonContainer">
                <button onClick={handleExport} className="button Exportbutton">Export Experiment Data</button>
            </div>
        </div>
    )
}
