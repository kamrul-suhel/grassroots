import React from 'react';
import {connect} from 'react-redux';
import {Form, TextInput} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {Back, PageTitle, ConfirmDialog} from 'app/components';

@connect((store, ownProps) => {
    return {
        clubAdmin: store.clubAdmin.collection[ownProps.params.userId] || {},
    };
})
export default class Edit extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            passwordError: null,
        }

        this.clubId = this.props.params.clubId;
        this.userId = this.props.params.userId;
    }

    componentWillMount() {
        this.props.dispatch(fetchData({
            type: 'CLUBADMIN',
            url: `/clubs/${this.clubId}/admins`,
        }));
    }

    handleInputChange = (name, value) => {
        this.setState({[name]: value, passwordError: null});
    }

    handleSubmit = async () => {
        // Validate password if change
        if (this.state.password) {
            const password = this.state.password;
            const confirmationPassword = this.state.confirmationPassword;

            if (password !== confirmationPassword) {
                this.refPasswordConfirm.setValidationMessage({valid: false, errors: ['Your passwords do not match.']});
                this.refForm && this.refForm.hideLoader();
                return false;
            }
        }

        const formData = new FormData();
        formData.append('email', this.state.email);
        formData.append('first_name', this.state.firstName);
        formData.append('last_name', this.state.lastName);
        this.state.password && formData.append('password', this.state.password);
        this.state.confirmationPassword && formData.append('password_confirmation', this.state.confirmationPassword);
        formData.append('telephone', this.state.telephone);

        const response = await api.update(`/users/${this.userId}`, formData);

        if (!api.error(response)) {
            this.dialogRef.close();
            this.props.dispatch({
                type:'OPEN_SNACKBAR_MESSAGE',
                option:{
                    message: "Club Admin details have been updated!",
                    color: "white"
                }
            })
            fn.navigate(`${url.club}/${this.clubId}/setup`);
        } else {
            this.refForm && this.refForm.hideLoader();
        }
    }

    render() {
        const {clubAdmin} = this.props;

        return (
            <div id="content" className="site-content-inner edit-admin-page">
                <PageTitle value="Edit Club Admin"/>

                <Form loader wide onSubmit={this.handleSubmit} className="form-section" ref={ref => this.refForm = ref}>
                    <TextInput
                        className="tooltips"
                        label="First Name"
                        placeholder="First Name"
                        name="firstName"
                        onChange={this.handleInputChange}
                        prepend={<i className="ion-person"/>}
                        validation="required"
                        value={clubAdmin.first_name}
                    />
                    <TextInput
                        className="tooltips"
                        placeholder="Last Name"
                        label="Last Name"
                        name="lastName"
                        onChange={this.handleInputChange}
                        prepend={<i className="ion-person"/>}
                        validation="required"
                        value={clubAdmin.last_name}
                    />
                    <TextInput
                        className="tooltips"
                        placeholder="Email"
                        label="Email"
                        name="email"
                        onChange={this.handleInputChange}
                        prepend={<i className="ion-at"/>}
                        validation="required"
                        value={clubAdmin.email}
                    />
                    <TextInput
                        className="tooltips"
                        placeholder="Telephone"
                        label="Telephone"
                        name="telephone"
                        onChange={this.handleInputChange}
                        prepend={<i className="ion-ios-telephone"/>}
                        value={clubAdmin.telephone}
                    />

                    <TextInput
                        ref={ref => this.refPasswordConfirm = ref}
                        className="tooltips"
                        placeholder="Change Password"
                        label="Change Password"
                        name="password"
                        onChange={this.handleInputChange}
                        prepend={<i className="ion-locked"/>}
                        type="password"
                        validation="min:8"
                    />

                    <TextInput
                        ref={ref => this.refPasswordConfirm = ref}
                        className="tooltips"
                        placeholder="Confirm Password"
                        label="Confirm Password"
                        name="confirmationPassword"
                        onChange={this.handleInputChange}
                        prepend={<i className="ion-locked"/>}
                        type="password"
                        validation="min:8"
                    />

                    {this.state.passwordError ? (
                        <ul className="error" style={{margin: '0'}}>
                            <li className="text-error">{this.state.passwordError}</li>
                        </ul>
                    ) : ''
                    }

                </Form>
                <div className="edit-admin-buttons">
                    <div className="back-button">
                        <Back className="button">Back</Back>
                    </div>

                    <ConfirmDialog
                        ref={ref => this.dialogRef = ref}
                        showCloseButton={false}
                            title=""
                        body={
                            <React.Fragment>
                                <h3>SATE SETUP CHANGES</h3>
                                <p>Are you sure you want to save these changes?</p>
                            </React.Fragment>
                            }
                        actions={[
                            <button key="cancel" className="button">Cancel</button>,
                            <button key="confirm" className="button" onClick={this.handleSubmit}>Save</button>
                        ]}
                    >
                        <div className="form-actions">
                            <button className="button hover-blue">
                                Save
                            </button>
                        </div>
                    </ConfirmDialog>
                </div>
            </div>
        );
    }

}
