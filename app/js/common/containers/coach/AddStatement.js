import React from 'react';
import {connect} from 'react-redux';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {Link} from 'react-router';
import {Back, FormButton, PageTitle, FormSection} from 'app/components';
import {Select, Form, TextInput, Dialog, DatePicker} from "@xanda/react-components";

@connect((store) => {
    return {
        club: store.club
    }
})


export default class AddStatement extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            statementError: false,
            errorMessage: '',
            registerTransactions: [
                {
                    id: 'fee',
                    title: 'Fee'
                },
                {
                    id: 'credit',
                    title: 'Credit'
                },
                {
                    id: 'receipt',
                    title: 'Receipt'
                }
            ]
        }

    }

    handleInputChange = (name, value) => {
        this.setState({
            [name]: value
        })
    }

    closeBox = () => {
        this.setState({
            statementError: false,
            errorMessage: ''
        })
        this.refDialog.close()
    }

    handleSubmit = async () => {
        const {state, props} = this
        const userId = props.params.userId

        // Make invoice
        let formData = new FormData()
        formData.append('type', 'coach')
        state.amount && formData.append('amount', state.amount)
        state.date && formData.append('date', state.date)
        state.registerType && formData.append('register_type', state.registerType)
        state.description && formData.append('description', state.description)
        formData.append('user_id', userId)
        formData.append('status', 3) // Manual invoice or transaction

        const response = await api.post(`${url.statement}`, formData)

        if(!api.error(response, false)){
            fn.navigate(`${url.coach}/${userId}`)
        } else {
            const errorHtml = api.getErrorsHtml(response.data)

            this.setState({
                statementError: true,
                errorMessage : errorHtml,
            });
            this.refDialog.open()
        }
        this.refForm && this.refForm.hideLoader()
    }

    render() {
        const {registerTransactions} = this.state;
        return (
            <div id="content" className="site-content-inner add-statement">
                <PageTitle value="Add Transaction"/>
                <Form
                    loader
                    className="form-section"
                    onSubmit={() => this.handleSubmit(false)}
                    ref={ref => this.refForm = ref}
                >
                    <FormSection>
                        <DatePicker
                            className="tooltips date-picker"
                            label="Date of birth"
                            name="date"
                            pastOnly
                            placeholder="Date"
                            validation="required"
                            onChange={this.handleInputChange}
                            prepend={<i className="icon ion-calendar"></i>}
                        />

                        <TextInput
                            className="tooltips"
                            label="Description"
                            autoComplete="off"
                            placeholder="Description"
                            prepend={<i className="icon ion-compose"></i>}
                            name="description"
                            onChange={this.handleInputChange}
                        />

                        <Select
                            className="tooltips"
                            placeholder="Transaction Type"
                            options={registerTransactions}
                            label="Transaction Type"
                            name="registerType"
                            onChange={this.handleInputChange}
                            validation="required"
                            prepend={<i className="ion-ios-book-outline"/>}
                        />

                        <TextInput
                            className="tooltips"
                            autoComplete="off"
                            placeholder="Amount"
                            type={"number"}
                            label="Amount"
                            name="amount"
                            onChange={this.handleInputChange}
                            prepend="£"
                            validation="required"
                        />
                    </FormSection>

                    <div className="form-actions">
                        <Back className="button">Go back</Back>

                        <button className="button hover-blue">Save</button>
                    </div>
                </Form>

                <Dialog
                    ref={ref => this.refDialog = ref}
                    close={false}
                    showCloseButton={false}
                    title=""
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
        )
    }
}