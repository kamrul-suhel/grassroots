import React, {PureComponent} from 'react'
import {Dialog, Form, TextInput} from "@xanda/react-components"
import {fn, api} from "app/utils";
import {url} from 'app/constants'

export default class EditMessage extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {}
    }

    handleInputChange = (name, value) => {
        this.setState({[name]: value});
    }

    handleUpdateMessage = async () => {
        const {message} = this.props
        const {description} = this.state

        // Check description is exists
        if (_.isEmpty(description)) {
            return
        }

        let formData = new FormData()
        description && formData.append('content', description)
        formData.append('topic_id', message.topic_id)

        const updateMessageUrl = `${url.message}/${message.message_id}`
        const response = await api.update(updateMessageUrl, formData)

        if (!api.error(response)) {
            this.props.closeMessageDialog('update')
        }
    }

    closeDialog = () => {
        this.props.closeMessageDialog('close')
    }

    renderMessageContent = () => {
        const {message} = this.props

        return <div className="dialog-content-full">
            <TextInput
                label="Description"
                name="description"
                onChange={this.handleInputChange}
                textarea
                validation="required"
                value={message.content}
                wide
                rows={10}
            />
        </div>
    }

    render() {
        const {message} = this.props
        return <Dialog
            onClose={this.closeDialog}
            showCloseButton={false}
            title={`${message.author_name}`}
            content={this.renderMessageContent()}
            buttons={[
                <button key={'close'}
                        className="button"
                        onClick={this.closeDialog}>Cancel
                </button>,
                <button key={'update'}
                        className="button hover-blue"
                        onClick={this.handleUpdateMessage}
                >Update message</button>
            ]}
        >
        </Dialog>
    }

}