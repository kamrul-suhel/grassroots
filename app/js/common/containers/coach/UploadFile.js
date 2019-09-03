import React, {PureComponent} from 'react'
import {
    Dialog,
    FileUpload,
    Form,
    DatePicker
} from "@xanda/react-components"
import {fn, api} from 'app/utils'
import { fetchData} from "app/actions";

export default class UploadFile extends PureComponent {

    constructor(props) {
        super(props)
    }

    handleInputChange = (name, value) => {
        this.setState({
            [name]: value
        })
    }

    handleSubmit = async () => {
        const {
            uploadedFile,
            expireDate
        } = this.state
        const {
            doc
        } = this.props
        const scanId = doc.scan_id
        const userId = this.props.params.userId

        let formData = new FormData()
        uploadedFile && formData.append('file', uploadedFile)
        expireDate && formData.append('expire', expireDate)

        const uploadUrl = `scans/${scanId}`
        const response = await api.update(uploadUrl, formData)

        if (!api.error(response)) {
            this.refDialog.close()
            this.props.fetchCoach()
        }
    }

    handleCloseDialog = () => {
        this.refDialog.close()
    }

    renderDialogBody = () => {
        return (
            <div className="w-100">
                <Form onSubmit={this.handleSubmit}
                      ref={ref => this.refFormUpload = ref}>
                    <DatePicker
                        validation="required"
                        futureOnly
                        yearDropdownItemNumber={3}
                        showYearSelect
                        label="Expire Date"
                        prepend={<i className="icon ion-android-calendar"></i>}
                        name="expireDate"
                        onChange={this.handleInputChange}
                    />

                    <FileUpload
                        name="uploadedFile"
                        label="Upload File"
                        prepend={<i className="icon ion-android-upload"></i>}
                        onChange={this.handleInputChange}
                    />
                    <div className="form-actions">
                        <button type="cancel"
                                onClick={this.handleCloseDialog}
                                className="button">Cancel
                        </button>

                        <button type="submit"
                                className="button">Upload file
                        </button>
                    </div>
                </Form>
            </div>
        )
    }

    render() {

        const {doc} = this.props
        const title = `${doc.title} - (${doc.type})`
        console.log("Type is: ", )

        return (
            <Dialog
                ref={ref => this.refDialog = ref}
                title={`Upload new ${title}`}
                showCloseButton={false}
                content={this.renderDialogBody()}
            >
                <div className="upload-file">
                    <button className="button"><i className="icon ion-upload"></i>
                    </button>
                </div>
            </Dialog>
        )
    }
}