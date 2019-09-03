import React from 'react';
import {Form, Select, TextInput} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {Back, FormButton, PageTitle} from 'app/components';
import {connect} from "react-redux";

@connect((store) => {
    return {
        clubAdmins: store.clubAdmin,
    };
})

export default class Add extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentWillMount = async () => {
    }

    handleInputChange = (name, value) => {
        this.setState({[name]: value});
    }

    handleSubmit = async () => {

        const formData = new FormData();
        this.state.content && formData.append('content', this.state.content)
        this.state.title && formData.append('title', this.state.title)

        const response = await api.post('/consents', formData);

        if (!api.error(response)) {
            fn.navigate(url.consent);
        } else {
            this.refForm && this.refForm.hideLoader();
        }
    }

    render() {
        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Create consent"/>
                <Form loader wide onSubmit={this.handleSubmit} className="form-section" ref={ref => this.refForm = ref}>
                    <TextInput
                        className="tooltips"
                        placeholder="Title"
                        label="Title"
                        name="title"
                        onChange={this.handleInputChange}
                        validation="required"
                        prepend={<i className="ion-ios-book-outline"/>}
                    />

                    <div></div>

                    <TextInput
                        className="tooltips"
                        placeholder="Content"
                        label="Content"
                        name="content"
                        onChange={this.handleInputChange}
                        textarea
                        validation="required"
                        wide
                    />

                    <div className="form-actions">
                        <Back className="button" confirm>Cancel</Back>
                        <FormButton label="Save"/>
                    </div>
                </Form>
            </div>
        );
    }

}
