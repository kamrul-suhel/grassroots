import React from 'react';
import {connect} from 'react-redux';
import {Checkbox, Form, TextInput} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {Back, FormButton, PageTitle} from 'app/components';

@connect((store, ownProps) => {
    return {
        page: store.page.collection[ownProps.params.pageSlug] || {},
    };
})
export default class Edit extends React.PureComponent {

    componentWillMount = async () => {
        this.props.dispatch(fetchData({
            type: 'PAGE',
            url: `/pages/${this.props.params.pageSlug}`,
        }));
    }

    handleInputChange = (name, value) => {
        this.setState({[name]: value});
    }

    handleSubmit = async () => {
        const formData = new FormData();
        formData.append('content', this.state.content);

        const response = await api.post(`/pages/${this.props.page.id}`, formData);

        if (!api.error(response)) {
            fn.navigate(url.page);
            this.props.dispatch({
                type:'OPEN_SNACKBAR_MESSAGE',
                option: {
                    message: `Page has been updated!`,
                    color:'white'
                }
            })
        } else {
            this.refForm && this.refForm.hideLoader();
        }
    }

    render() {
        const {page} = this.props;

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Edit Legal & Content"/>
                <Form loader onSubmit={this.handleSubmit} className="form-section" ref={ref => this.refForm = ref}>
                    <div className="grid page-form">
                        <div className="grid-xs-10">
                            <TextInput
                                disabled
                                label="Title"
                                name="title"
                                onChange={this.handleInputChange}
                                value={page.title}
                                wide
                            />
                        </div>

                        <div className="grid-xs-10">
                            <TextInput

                                label="Content"
                                name="content"
                                onChange={this.handleInputChange}
                                textarea
                                validation="required"
                                value={page.content}
                                wide
                            />

                            <div className="form-actions">
                                <Back className="button">Back</Back>
                                <FormButton label="Save"/>
                            </div>
                        </div>
                    </div>

                </Form>
            </div>
        );
    }

}
