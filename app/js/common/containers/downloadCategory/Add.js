import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Checkbox, FileUpload, Form, Select, TextInput} from "@xanda/react-components"
import {api} from 'app/utils'
import {FormButton, Back} from "app/components";
@connect((state)=> {
    return{
        me:state.me
    }
})
export default class Add extends PureComponent {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    handleInputChange = (name, value) => {
        this.setState({
            [name]: value
        })
    }

    handleSubmit = async () => {
        const { me } = this.props
        const {category} = this.state
        const clubId = me.data && me.data.club_id || 0;

        let formData = new FormData();
        formData.append('club_id', clubId)
        formData.append('category', category)

        const response = await api.post('download-categories', formData)
        if(!api.error(response)){
            this.props.closeDialog()
        }

        this.refForm && this.refForm.hideLoader();
    }

    handelClose = (e) => {
        e.preventDefault()
        this.props.closeDialog()
    }

    render() {
        return (
            <div className="add-download-category">
                <Form loader
                      onSubmit={this.handleSubmit}
                      className="form-section"
                      ref={ref => this.refForm = ref}>
                    <TextInput
                        placeholder="Category Name"
                        name="category"
                        onChange={this.handleInputChange}
                        validation="required"
                        prepend={<i className="ion-clipboard"/>}
                    />

                    <div className="form-actions">
                        <button className="button"
                                onClick={this.handelClose}>Cancel
                        </button>

                        <FormButton label="Add" />
                    </div>
                </Form>
            </div>
        )
    }
}