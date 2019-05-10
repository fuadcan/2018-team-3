import React from "react"
import { HKButton } from "@heroku/react-hk-components"
import "./styles.css"
import { compose, withState } from "recompose"
import Files from "react-files"

const InputFeedback = ({ error }) =>
    error ? <div className="input-feedback b f5">{error}</div> : null;

const Label = ({ error, className, children, ...props }) => {
    return (
        <label className="label f3" {...props}>
            {children}
        </label>
    );
};

const TextInput = ({ type, id, label, error, value, onChange, className, ...props }) => {
    return (
        <div className={className}>
            <Label htmlFor={id} error={error}>
                {label}
            </Label>
            <input
                id={id}
                className="text-input"
                type={type}
                value={value}
                onChange={onChange}
                {...props}
            />
            <InputFeedback error={error} />
        </div>
    );
};

const AdminCardForm = (props) => {
    const {
        values,
        touched,
        errors,
        handleBlur,
        handleSubmit,
        handleChange,
        setFieldValue
    } = props
    return <form>
        <div className={`${props.disabled ? "" : "editableMode"} AdminCard`}>
            <div className="w-100 tr">
                {
                    props.disabled ?
                        <HKButton
                            type="primary"
                            onClick={() => {
                                props.setDisabled(false)
                            }}><i className="material-icons">
                                edit</i>
                        </HKButton>
                        : <HKButton
                            type="primary"
                            onClick={(e) => {
                                e.preventDefault()
                                handleSubmit(e)
                                if (errors.secondaryValue === "" && errors.primaryValue === "" && errors.imageUrl === "") {
                                    props.setDisabled(true)
                                    props.submitCardModifications({
                                        primaryValue: values.primaryValue,
                                        secondaryValue: values.secondaryValue,
                                    })
                                }
                            }}>
                            <i className="material-icons">
                                check</i>
                        </HKButton>
                }
            </div>
            <div className={`${props.disabled ? "disabled" : ""} w-100`}>
                <div className={`cardimage w-100 ${errors.imageUrl === "Required" ? "noUploadedImage" : ""}`}>
                    <Files
                        className='files-dropzone'
                        onChange={(imgProps) => {
                            props.onImageChange({
                                imgProps: imgProps,
                                setFieldValue: setFieldValue
                            })
                        }}
                        accepts={['image/*']}
                        maxFileSize={1000000000}
                        minFileSize={0}
                        clickable
                    >
                        {
                            props.imageUrl
                                ? <img alt="adminImage" src={props.imageUrl} />
                                : !props.disabled
                                && <button type="button" className="addImageButton"><i className="material-icons">add</i></button>

                        }
                    </Files>
                    <InputFeedback error={errors.imageUrl} />
                </div>
                <div>
                    <div className="flex pa2 pt4">
                        <TextInput
                            id="primaryValue"
                            type="text"
                            label="Primary Value"
                            placeholder="Please enter primary value"
                            error={touched.primaryValue && errors.primaryValue}
                            value={values.primaryValue}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </div>
                    <div className="flex pa2">
                        <TextInput
                            id="secondaryValue"
                            type="text"
                            label="Secondary Value"
                            placeholder="Secondary value..."
                            error={touched.secondaryValue && errors.secondaryValue}
                            value={values.secondaryValue}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </div>
                </div>
            </div>
        </div>
    </form >
}

export default compose(
    withState("disabled", "setDisabled", true),
)(AdminCardForm)