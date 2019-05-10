// vendors and utils libraries
import { compose, withState, withHandlers } from "recompose"
import { withFormik } from "formik"

// sub components
import AdminCardForm from "./AdminCardForm"

// styles
import "./styles.css"

const EnhancedAdminCardForm = withFormik({
    mapPropsToValues: (props) => ({
        primaryValue: props.primaryValue,
        secondaryValue: props.secondaryValue,
        imageUrl: props.imageUrl
    }),
    // Custom sync validation
    validate: values => {
        let errors = {};
        if (!values.imageUrl) {
            errors.imageUrl = "Required"
        } else {
            errors.imageUrl = ""
        }
        if (!values.secondaryValue) {
            errors.secondaryValue = "Required"
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                values.secondaryValue
            )
        ) {
            errors.secondaryValue = ""
        }
        if (!values.primaryValue) {
            errors.primaryValue = "Required"
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                values.primaryValue
            )
        ) {
            errors.primaryValue = ""
        }
        return errors
    },
})(AdminCardForm)

export default compose(
    withState("fileImageObject", "setFileImageObject", {}),
    withState("imageUrl", "setImageUrl", (props) => props.imageUrl ? props.imageUrl : ""),
    withState("disabled", "setDisabled", true),
    withHandlers({
        onImageChange: (props) => ({ imgProps, setFieldValue }) => {
            setFieldValue("imageUrl", imgProps[imgProps.length - 1].preview.url)
            props.setImageUrl(imgProps[imgProps.length - 1].preview.url)
            props.setFileImageObject(imgProps[imgProps.length - 1])
        },
        submitCardModifications: (props) => (values) => {
            props.updateAdminCard({
                id: props.index,
                card: {
                    imageUrl: props.imageUrl,
                    primaryValue: values.primaryValue,
                    secondaryValue: values.secondaryValue,
                    fileImageObject: props.fileImageObject,
                    cardSetName: props.cardSetName
                }
            })
        }
    })
)(EnhancedAdminCardForm)

