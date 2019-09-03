import React from 'react';
import {Form, TextInput} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {FormButton, Link, PageTitle} from 'app/components';
import {connect} from "react-redux";

@connect((store, ownProps) => {
    return {};
})

export default class ForgotPassword extends React.PureComponent {

    state = {
        emailFormError: false,
        emailErrorMessage: '',
        sendEmail: false
    }

    handleInputChange = (name, value) => {
        this.setState({[name]: value});
    }

    handleSubmit = async () => {
        const formData = new FormData();
        formData.append('email', this.state.email);
        formData.append('club_id', fn.getClubId());
        formData.append('redirect_url', fn.getClubUrl());
        const response = await api.post('/auth/password-reset', formData);

        if (!api.error(response, false)) {
            this.setState({
                sendEmail: true
            });

        } else {
            const errorData = api.getErrorsHtml(response.data);
            this.setState({
                emailFormError: true,
                emailErrorMessage: errorData
            });
            this.refForm && this.refForm.hideLoader();
        }
    }

    render() {
        const {sendEmail} = this.state;
        return (
            <div id="content" className="site-content-inner forgot-password-component">
                <section className="section section-auth">
                    {!sendEmail ?
                        <React.Fragment>
                            <PageTitle value="Forgot password"/>
                            <p style={{textAlign:'center'}}>Please enter your email address to help us identify you</p>
                            <Form loader onSubmit={this.handleSubmit}
                                  ref={ref => this.refForm = ref}>
                                <TextInput
                                    className="tooltips"
                                    placeholder="Email"
                                    label="Email"
                                    name="email"
                                    onChange={this.handleInputChange}
                                    validation="required"
                                    prepend={<i className="ion-at"/>}
                                    wide
                                />
                                {this.state.emailFormError ?
                                    <p className="text-danger-light">{this.state.emailErrorMessage}</p> : ''}
                                <div className="form-actions">
                                    <Link to={url.login} className="button">Return to log in</Link>
                                    <FormButton label="Submit"/>
                                </div>
                            </Form>
                        </React.Fragment>:
                        <React.Fragment>
                            <div className="forgot-password-sent">
                                <section>
                                    <h2>Check your email</h2>
                                    <p>An email has been sent to {this.state.email && this.state.email} containing instructions on how to create a new password.</p>
                                </section>

                                <section>
                                    <p>If you didn’t receive the email please check your spam or junk folders for a message coming from mygrassroots-noreply@mgc.com</p>
                                </section>

                                <section>
                                    <Link to={url.login} className="button">RETURN TO LOG IN</Link>
                                </section>
                            </div>
                        </React.Fragment>
                    }
                </section>
            </div>
        );
    }

}
