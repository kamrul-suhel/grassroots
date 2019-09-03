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


export default class Add extends React.PureComponent {

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
            ],

            clubs: [],
            accounts: []
        }

    }

    async componentDidMount() {
        const franchiseId = this.props.routeParams.franchiseId;

        const response = await api.get(`/franchises/${franchiseId}/clubs?type=dropdown`);
        let clubs = [{id:'na', title:'na'}];
        clubs.push(...response.data.clubs)

        this.setState({
            clubs: clubs
        });
    }

    handleInputChange = (name, value) => {
        this.setState({
            [name]: value
        })
    }

    getAccountType = async (franchiseId, clubId) => {
        const response = await api.get(`accounts/franchise/${franchiseId}/club/${clubId}`);

        this.setState({
            accounts: response.data
        });
    }

    closeBox = () => {
        this.setState({
            statementError: false,
            errorMessage: ''
        })
        this.refDialog.close()
    }

    handleSubmit = async () => {
        const {state, props} = this;
        // Make invoice
        let formData = new FormData();
        state.amount && formData.append('amount', state.amount);
        state.date && formData.append('date', state.date);
        state.registerType && formData.append('register_type', state.registerType);
        state.description && formData.append('description', state.description);
        formData.append('franchise_id', props.routeParams.franchiseId);
        state.selectedClub && formData.append('club_id', state.selectedClub);

        const response = await api.post('/statements', formData);
        this.refForm.hideLoader();

        if(!api.error(response, false)){
            fn.navigate(`franchises/${props.params.franchiseId}`);
        }
        else {
            const errorHtml = api.getErrorsHtml(response.data);

            this.setState({
                statementError: true,
                errorMessage : errorHtml,
            });
        }
        this.refForm && this.refForm.hideLoader();
        this.refDialog.open()
    }

    render() {
        const {registerTransactions, clubs} = this.state;
        const {props} = this;

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
                            placeholder="Date"
                            validation="required"
                            onChange={this.handleInputChange}
                            prepend={<i className="icon ion-calendar"></i>}
                        />
                        <div style={{width: '400px'}}></div>

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
                            placeholder="Select Club"
                            label="Select Club"
                            options={clubs}
                            name="selectedClub"
                            skipInitialOnChangeCall
                            onChange={this.handleInputChange}
                            validation="required"
                            prepend={<i className="ion-ios-book-outline"/>}
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
                        <Link className={'button'}
                              to={`/franchises/${props.params.franchiseId}`}>Go Back
                        </Link>

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