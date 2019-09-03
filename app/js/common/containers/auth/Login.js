import React from 'react';
import {Form, TextInput} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {FormButton, Link, PageTitle} from 'app/components';

export default class Login extends React.PureComponent {

    state = {
        errorMessage: false,
        errorMessageText: ''
    }

    handleInputChange = (name, value) => {
        this.setState({
            errorMessage: false,
            errorMessageText: ''
        });
        this.setState({[name]: value});
    }

    handleSubmit = async () => {
        const { email, password } = this.state
        const { authClub } = this.props

        const formData = {
            auth: {
                username: email,
                password: password,
            },
            data: {
                club_id: authClub ? authClub.data.club_id : 0,
            },
        };

        const response = await api.send('auth/login', 'POST', formData);

        if (!api.error(response, false)) {
            fn.saveCookie('token', response.data, {
                path: '/',
                maxAge: 86400,
            });

            const parsedToken = fn.parseToken(response.data);
            let redirect = url.setting;

            if (parsedToken.role === 'groupadmin') {
                redirect = url.licence;
            } else if (parsedToken.role === 'superadmin') {
                redirect = url.package;
            }else if(parsedToken.role === 'coach'){
                redirect = `${url.calendar}`
            }else if(parsedToken.role === "guardian"){
                redirect = url.calendar
            }else if(parsedToken.role === "admin"){
                redirect = url.dashboard
            }
            this.refForm && this.refForm.hideLoader();

            fn.navigate(redirect);
        } else {
            const errorHtml = api.getErrorsHtml(response.data);
            this.setState({
                errorMessage: true,
                errorMessageText: errorHtml
            })

            this.refForm && this.refForm.hideLoader();
        }
    }

    renderRegisterButton = () => {
        if (this.props.authClub && this.props.authClub.data.club_id) {
            return <Link to={url.registerAccounts} className="button button-large"><span>New parents</span></Link>;
        }

        return <a href="http://grassroots.hostings.co.uk/buy" target="_blank" className="button button-large"><span>New Customer</span></a>;
    }

    render() {
        const forgotPassword = this.props.location.query;
        return (
            <div id="content" className="site-content-inner">
                <section className="section section-auth short login">
                    <PageTitle value="Log in"/>

                    {forgotPassword.forgot_password && <div className="text-danger-light">
                        <p>Please check your email to reset the password</p>
                    </div>}


                    <Form loader onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
                        <TextInput
                            wide
                            className="tooltips"
                            label="Email"
                            validation="required"
                            name="email"
                            placeholder="Email"
                            prepend={<i className="ion-at"/>}
                            onChange={this.handleInputChange}
                        />

                        <TextInput
                            wide
                            className="tooltips"
                            label="Password"
                            validation="required"
                            name="password"
                            placeholder="Password"
                            type="password"
                            prepend={<i className="ion-locked"/>}
                            onChange={this.handleInputChange}
                        />

                        <Link to={url.forgotPassword} className="link link-small darken forgot-password">Forgot Password?
                        </Link>

                        {this.state.errorMessage ?
                            <div className="text-danger-light form-actions">{this.state.errorMessageText}</div> : ''}
                        <div className="form-actions">
                            <FormButton large label="Log In"/>
                        </div>
                    </Form>
                </section>
            </div>
        );
    }

}
