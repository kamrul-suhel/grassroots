import React from 'react';
import {Dialog, Form, TextInput} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {Back, FormButton, PageTitle} from 'app/components';

export default class EditPassword extends React.PureComponent {

    state = {
        error: false,
        errorMessage: ''
    }

    handleInputChange = (name, value) => {
        this.setState({[name]: value});
    }

    handleSubmit = async () => {
        const formData = new FormData();
        formData.append('password', this.state.password);
        formData.append('password_confirmation', this.state.password_confirmation);
        formData.append('password_reset', true);

        const response = await api.update(`/users/${this.props.params.userId}/password`, formData);

        if (!api.error(response, false)) {
            this.refForm && this.refForm.hideLoader();
            const franchiseId = response.data.franchise_id;
            fn.navigate(`franchises/${franchiseId}`);
        } else {
            const errorHtml = api.getErrorsHtml(response.data);
            this.setState({
                errorMessage: errorHtml,
                error: true
            });
            this.refDialog.open()
            this.refForm && this.refForm.hideLoader();
        }
    }

    closeBox = () => {
        this.setState({
            errorMessage: '',
            error: false
        });
        this.refDialog.close()
    }

    render() {
        const {params} = this.props
        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Update password"
                           faq={true}
                           faqLink={fn.getFaqLink(`caChangePassword`, `/${params.clubSlug}/`)}/>

                <Form loader onSubmit={this.handleSubmit} className="form-section" ref={ref => this.refForm = ref}>
                    <TextInput
                        prepend={<i className="ion-locked"/>}
                        className="tooltips"
                        label="Password"
                        type="password"
                        name="password"
                        validation="required"
                        placeholder="Password"
                        onChange={this.handleInputChange}/>

                    <TextInput
                        prepend={<i className="ion-locked"/>}
                        className="tooltips"
                        label="Confirm password"
                        type="password"
                        validation="required"
                        name="password_confirmation"
                        placeholder="Confirm password"
                        onChange={this.handleInputChange}/>

                    <div className="form-actions">
                        <Back className="button">Back</Back>
                        <FormButton label="Save"/>
                    </div>
                </Form>

                <Dialog
                    showCloseButton={false}
                    ref={ref => this.refDialog = ref}
                    className='text-danger'
                    title=''
                    content={
                        <React.Fragment>
                            <div className={"dialog-left-sidebar"}>
                                <img src={'/images/ball-soccer.png'}/>
                            </div>
                            <div className={"dialog-right-side"}>
                                <h3>Error!</h3>
                                {this.state.errorMessage}
                            </div>
                        </React.Fragment>}
                    buttons={[
                        <button className="button" onClick={() => this.closeBox()}>Go Back</button>,
                    ]}
                >
                    <button className="button hidden"></button>
                </Dialog>
            </div>
        );
    }

}
