import React from 'react';
import {api, fn} from 'app/utils';
import {Link} from 'react-router';
import {url} from 'app/constants';
import {Back, FormButton, PageTitle, FormSection} from 'app/components';
import {Select, Form, TextInput, DatePicker} from "@xanda/react-components";
import {connect} from "react-redux";

@connect((store) => {
    return {}
})


export default class Edit extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            invoice: {},
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

            accounts: []
        }
    }

    async componentDidMount() {
        const franchiseId = this.props.routeParams.franchiseId;

        const clubs = await api.get(`/franchises/${franchiseId}/clubs?type=dropdown`);
        const url = this.getUrl();

        // fetch data
        const response = await api.get(url);
        this.setState({
            invoice: {...response.data},
            clubs: clubs.data.clubs
        });
    }

    handleInputChange = (name, value) => {
        this.setState({
            [name]: value
        });

        if (name === 'selectedClub' && this.state.registerType && this.state.registerType !== 'fee') {
            const franchiseId = this.props.routeParams.franchiseId;
            const clubId = value;
            this.getAccountType(franchiseId, clubId);
        }
    }

    getAccountType = async (franchiseId, clubId) => {
        const response = await api.get(`accounts/franchise/${franchiseId}/club/${clubId}`);

        this.setState({
            accounts: response.data
        });
    }

    handleSubmit = async () => {
        const {
            amount,
            description,
            entityType,
            registerType,
            selectedClub,
            accountType,
            date
        } = this.state;
        const {routeParams} = this.props;

        let clubId = null;
        const url = this.getUrl();

        if(_.isObject(selectedClub)){
            clubId = selectedClub.id;
        }else {
            clubId = selectedClub;
        }

        let formData = new FormData();
        amount && formData.append('amount', amount);
        date && formData.append('date', date);
        registerType && formData.append('register_type', registerType);
        description && formData.append('description', description);
        entityType && formData.append('entity_type', entityType);
        formData.append('franchise_id', routeParams.franchiseId);
        selectedClub && formData.append('club_id', clubId);
        accountType && formData.append('account_id', accountType);

        const response = await api.update(url, formData);
        this.refForm.hideLoader();
        if (!api.error(response)) {
            fn.navigate(`franchises/${routeParams.franchiseId}`);
        }
    }

    getUrl() {
        const {query} = this.props.location;
        let url = '';
        if (query.invoice_id) {
            url = `/invoices/${query.invoice_id}`;
        }

        if (query.transaction_id) {
            url = `/transactions/${query.transaction_id}?type=single`;
        }
        return url;
    }

    render() {
        const {
            invoice,
            clubs,
            registerTransactions,
            registerType
        } = this.state;

        const selectClub = clubs && _.find(clubs, (club) => club.id === invoice.club_id);

        const description = invoice.note ? invoice.note : invoice.description


        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Edit Transaction"/>
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
                            value={invoice.date}
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
                            value={description}
                            onChange={this.handleInputChange}
                        />

                        <Select
                            className="tooltips"
                            placeholder="Select Club"
                            label="Select Club"
                            skipInitialOnChangeCall
                            options={clubs}
                            value={selectClub}
                            name="selectedClub"
                            onChange={this.handleInputChange}
                            validation="required"
                            prepend={<i className="ion-ios-book-outline"/>}
                        />

                        <Select
                            className="tooltips"
                            placeholder="Transaction Type"
                            options={registerTransactions}
                            value={invoice.register_type}
                            label="Transaction Type"
                            name="registerType"
                            onChange={this.handleInputChange}
                            validation="required"
                            prepend={<i className="ion-ios-book-outline"/>}
                        />

                        <TextInput
                            className="tooltips"
                            placeholder="Amount"
                            label="Amount"
                            name="amount"
                            value={invoice.amount}
                            onChange={this.handleInputChange}
                            validation="required"
                            prepend="£"
                        />
                    </FormSection>

                    <div className="form-actions">
                        <Link to={`franchises/${this.props.routeParams.franchiseId}`}
                              className="button">
                            Cancel
                        </Link>

                        <button className="button hover-blue">Update</button>
                    </div>
                </Form>

            </div>
        )
    }
}