import React from 'react';
import {Form, Select, TextInput} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {Back, FormButton, PageTitle} from 'app/components';
import {connect} from "react-redux";

@connect((store, ownProps) => {
    return {};
})

export default class Add extends React.PureComponent {

    constructor(props) {
        super(props);

        this.clubId = this.props.params.clubId;

        this.state = {
            accountTypes: [],
        };
    }

    componentWillMount = async () => {
        const accountTypes = await api.get('/account-types');
        this.setState({accountTypes: accountTypes.data.entities});
    }

    handleInputChange = (name, value) => {
        this.setState({[name]: value});
    }

    handleSubmit = async () => {
        const {
            title,
            accountType,
            accountNumber,
            bankName,
            sortCode
        } = this.state

        // Check account_number is 8 or less
        if(accountNumber && accountNumber.length >! 8){
            this.refForm && this.refForm.hideLoader();
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('type_id', accountType);
        accountNumber && formData.append('account_number', accountNumber);
        bankName && formData.append('bank_name', bankName);
        sortCode && formData.append('sort_code', sortCode);

        const response = await api.post('/accounts', formData);

        if (!api.error(response)) {
            fn.navigate(url.account);
            this.props.dispatch({
                type: 'OPEN_SNACKBAR_MESSAGE',
                option: {
                    message: 'Account has been created successfully!',
                    color: 'dark'
                }
            })
        } else {
            this.refForm && this.refForm.hideLoader();
        }
    }

    render() {
        const {accountTypes} = this.state;

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Add account"/>
                <Form loader onSubmit={this.handleSubmit} className="form-section" ref={ref => this.refForm = ref}>
                    <TextInput
                        className="tooltips"
                        placeholder="Account name"
                        label="Account name"
                        name="title"
                        onChange={this.handleInputChange}
                        validation="required"
                        prepend={<i className="ion-person"/>}
                    />
                    <Select
                        className="tooltips"
                        placeholder="Account type"
                        label="Account type"
                        name="accountType"
                        onChange={this.handleInputChange}
                        options={accountTypes}
                        validation="required"
                        prepend={<i className="ion-card"/>}
                    />

                    {this.state.accountType === 1 &&
                    <React.Fragment>
                        <TextInput
                            className="tooltips"
                            placeholder="Bank name"
                            label="Bank name"
                            name="bankName"
                            onChange={this.handleInputChange}
                            validation="required"
                            prepend={<i className="ion-home"/>}
                        />
                        <TextInput
                            className="tooltips"
                            placeholder="Account number"
                            label="Account number"
                            name="accountNumber"
                            onChange={this.handleInputChange}
                            validation="required"
                            prepend={<i className="ion-ios-keypad-outline"/>}
                        />
                        <TextInput
                            className="tooltips"
                            placeholder="Sort code"
                            label="Sort code"
                            name="sortCode"
                            onChange={this.handleInputChange}
                            validation="required"
                            prepend={<i className="ion-ios-barcode-outline"/>}
                        />
                    </React.Fragment>
                    }

                    {this.state.accountType === 3 &&
                    <React.Fragment>
                        <TextInput
                            className="tooltips"
                            placeholder="Bank name"
                            label="Bank name"
                            name="bankName"
                            onChange={this.handleInputChange}
                            validation="required"
                            prepend={<i className="ion-home"/>}
                        />
                        <TextInput
                            className="tooltips"
                            placeholder="Account number"
                            label="Account number"
                            name="accountNumber"
                            onChange={this.handleInputChange}
                            validation="required"
                            prepend={<i className="ion-ios-keypad-outline"/>}
                        />
                        <TextInput
                            className="tooltips"
                            placeholder="Sort code"
                            label="Sort code"
                            name="sortCode"
                            onChange={this.handleInputChange}
                            validation="required"
                            prepend={<i className="ion-ios-barcode-outline"/>}
                        />
                    </React.Fragment>
                    }

                    <div className="form-actions">
                        <Back className="button">Cancel</Back>
                        <FormButton label="Save"/>
                    </div>
                </Form>
            </div>
        );
    }

}
