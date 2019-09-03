import React from 'react';
import {Dialog, Form, TextInput} from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import {fetchData} from 'app/actions';
import { Back, FormButton, PageTitle } from 'app/components';
import {connect} from "react-redux";

@connect((store, ownProps) => {
    console.log('Store: ', store);
    return{
        franchise: store.franchise.collection[ownProps.params.franchiseId] || {}
    }
})

export default class AccountManager extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            error: false,
            errorMessage: ''
        }
    }

    handleInputChange = (name, value) => {
        this.setState({ [name]: value });
    }

    handleSubmit = async () => {
        const formData = new FormData();

        formData.append('manager', this.state.Manager);
        formData.append('type', 'manager');

        const response = await api.post(`/franchises/${this.props.params.franchiseId}`, formData);

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
            this.refForm && this.refForm.hideLoader();
    }

    closeBox = () => {
        this.setState({
            errorMessage: '',
            error: false
        });
        this.refDialog.close()
    }

    render() {
        const {franchise} = this.props;

        return (
            <div id="content" className="site-content-inner account-manager">
                <PageTitle value="Set Account Manager" />

                <Form loader onSubmit={this.handleSubmit} className="form-section" ref={ref => this.refForm = ref}>
                    <TextInput
                        prepend={<i className="ion-person" />}
                        className="tooltips"
                        label="Manager Name"
                        type="name"
                        name="Manager"
                        value={franchise.manager_name}
                        validation="required"
                        placeholder="Manager Name"
                        onChange={this.handleInputChange} />


                    <div className="form-actions">
                        <Back className="button">Back</Back>
                        <FormButton label="Save" />
                    </div>
                </Form>

                <Dialog
                    showCloseButton={false}
                    ref={ref => this.refDialog = ref}
                    className='text-danger'
                    title=''
                    content={
                        <div className="dialog-body-inner">
                            <div className={"dialog-left-sidebar"}>
                                <img src={'/images/ball-soccer.png'}/>
                            </div>
                            <div className={"dialog-right-side"}>
                                <h3>Error!</h3>
                                {this.state.errorMessage}
                            </div>
                        </div>
                    }
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
