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
            ],

            clubs: [],
            accounts: [],
            players:[],
            programmes:[]
        }

    }

    async componentDidMount() {
        const parentId = this.props.params.userId

        // Get this parent programme & player
        const response = await api.get(`/dropdown/parents/${parentId}/programmes-players`);

        let players = []
        let programmes = []
        if(!api.error(response)){
            players = [...response.data.players]
            programmes = [...response.data.programmes]
        }

        this.setState({
            players : players,
            programmes: programmes
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
        const {state, props} = this
        const userId = props.params.userId

        // Make invoice
        let formData = new FormData();
        formData.append('type', 'parent'); // Important default is club
        state.amount && formData.append('amount', state.amount);
        state.date && formData.append('date', state.date);
        state.registerType && formData.append('register_type', state.registerType);
        state.player && formData.append('player_id', state.player);
        // state.programme && formData.append('programme_id', state.programme);
        state.description && formData.append('description', state.description);
        formData.append('user_id', userId)

        const response = await api.post(`parents/${userId}/statements/create`, formData);

        if(!api.error(response, false)){
            fn.navigate(`${url.guardian}/${userId}`);
        }

        else {
            const errorHtml = api.getErrorsHtml(response.data);

            this.setState({
                statementError: true,
                errorMessage : errorHtml,
            });
            this.refDialog.open()
        }
        this.refForm && this.refForm.hideLoader();
    }

    render() {
        const {registerTransactions, players, programmes} = this.state;
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
                            pastOnly
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

                        {/*
                            TODO: maybe in future we need this
                        */}
                        {/*<Select*/}
                        {/*    className="tooltips"*/}
                        {/*    placeholder="Select Programme"*/}
                        {/*    label="Select Programme"*/}
                        {/*    options={programmes}*/}
                        {/*    name="programme"*/}
                        {/*    skipInitialOnChangeCall*/}
                        {/*    validation={"required"}*/}
                        {/*    onChange={this.handleInputChange}*/}
                        {/*    prepend={<i className="ion-ios-book-outline"/>}*/}
                        {/*/>*/}

                        <Select
                            className="tooltips"
                            placeholder="Select Player"
                            label="Select Player"
                            options={players}
                            name="player"
                            validation={"required"}
                            skipInitialOnChangeCall
                            onChange={this.handleInputChange}
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