import React from 'react';
import {FileUpload, Form, Radio, Repeater, TextInput, Dialog, Table} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {
    FormButton,
    PageTitle,
    Link,
    FormSection,
    PageDescription
} from 'app/components';
import {connect} from "react-redux";

@connect((store) => {
    return {
        clubAdmins: store.clubAdmin
    };
})

export default class Setup extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            type: [],
            clubTypes: [
                {id: 'academy', title: 'Soccer School'},
                {id: 'fc', title: 'Football Club'},
                {id: 'both', title: 'Both'},
            ],
            confirmSubmit: false,
            deleteUser: {},
            formError: false,
            formErrorMessage: ''
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.params.clubId !== this.props.params.clubId) {
            nextProps.fetchData()
        }
    }

    deleteUser = (user) => {
        this.refDialog.open();

        this.setState({
            deleteUser: {...user}
        })
    }

    confirmDeleteUser = async () => {
        const response = await api.delete(`/users/${this.state.deleteUser.user_id}`);

        if (!api.error(response)) {
            this.props.fetchData();
            this.refDialog.close();
        }
    }

    closeDialogbox = () => {
        this.refDialog.close();

        this.setState({
            deleteUserId: 0
        })
    }

    hideSnackbar = () => {
        this.setState({
            openSnackBar: false
        })
    }

    formatSlug = (str) => {
        // const franchiseName = this.props.me.franchise_name && this.props.me.franchise_name.toLowerCase();
        const franchiseName = '';
        let lowerStr = '';
        if (!_.isEmpty(str)) {
            lowerStr = str.toLowerCase();
        } else {
            lowerStr = str;
        }

        let value = lowerStr;

        if (!lowerStr.startsWith(franchiseName)) {
            value = `${franchiseName}-${lowerStr}`;
        }

        return value.replace(/[^\w\- ]+/g, '').replace(/ +/g, '');
    }

    handleInputChange = (name, value) => {
        this.setState({[name]: value});

        if (name === 'title') {
            this.refSlug && this.refSlug.updateValue(this.formatSlug(value));
        }
    }

    handleCancelConfirmDialog = () => {
        this.refConfirmDialog.close();
        this.refForm && this.refForm.hideLoader();

        // set default state
        this.setState({
            confirmSubmit: false,
            deleteUserId: 0,
            formError: false,
            formErrorMessage: ''
        });
    }

    closeDialog = () => {
        this.refForm && this.refForm.hideLoader();
        this.refDialog.close();

        // set default state
        this.setState({
            confirmSubmit: false,
            deleteUserId: 0,
            formError: false,
            formErrorMessage: ''
        });
    }

    handleConfirmSubmit = () => {
        this.setState({
            confirmSubmit: true
        });
        this.handleSubmit(true);
    }

    handleSubmit = async (confirm = false) => {
        const clubId = _.parseInt(this.props.params.clubId);
        const licenceId = _.parseInt(this.props.location.query.licenceId);
        const vatNumber = this.state.isRegistered == 1 ? this.state.vatNumber : '';
        const vatRate = this.state.isRegistered == 1 ? this.state.vatRate : 0;

        if (!confirm && clubId === 0) {
            this.refConfirmDialog.open();
            return;
        }
        const formData = new FormData();

        // Check if has slug
        if (clubId === 0) {
            formData.append('slug', this.state.slug);
            formData.append('rel_club_package_id', licenceId);
        }

        formData.append('title', this.state.title);
        _.map(this.state.users, (o, i) => {
            if (o.first_name && o.last_name && o.email && o.password) {
                formData.append(`users[${i}][first_name]`, o.first_name);
                formData.append(`users[${i}][last_name]`, o.last_name);
                formData.append(`users[${i}][email]`, o.email);
                formData.append(`users[${i}][password]`, o.password);
                o.telephone && formData.append(`users[${i}][telephone]`, o.telephone);
            }
        });

        this.state.type && formData.append('type', this.state.type);
        this.state.address && formData.append('address', this.state.address);
        this.state.address2 && formData.append('address2', this.state.address2);
        this.state.city && formData.append('city', this.state.city);
        this.state.postcode && formData.append('postcode', this.state.postcode);
        this.state.email && formData.append('email', this.state.email);
        this.state.pic && formData.append('logo_url', this.state.pic);
        this.state.telephone && formData.append('telephone', this.state.telephone);
        this.state.town && formData.append('town', this.state.town);
        formData.append('vat_number', vatNumber);
        formData.append('vat_rate', vatRate);
        this.state.threshold && formData.append('threshold', this.state.threshold);
        this.state.fcCompany && formData.append('fc_company', this.state.fcCompany);
        this.state.ssCompany && formData.append('ss_company', this.state.ssCompany);
        this.state.website && formData.append('website', this.state.website);

        this.state.companyNumber && formData.append('company_number', this.state.companyNumber);
        this.state.faAffiliation && formData.append('fa_affiliation', this.state.faAffiliation);

        // Check is update or create
        let response = '';
        let create = false;

        if (clubId === 0) {
            create = true;
            response = await api.post('/clubs', formData);
        } else {
            create = false;
            response = await api.update(`/clubs/${clubId}`, formData);
        }

        if (!api.error(response, false)) {
            if (create) {
                const clubId = response.data.club_id;
                fn.navigate(`clubs/${clubId}/setup`)
            }

            this.refForm && this.refForm.hideLoader();
            this.refConfirmDialog.close();
        } else {
            // Error show message
            let errorHtml = api.getErrorsHtml(response.data, true)
            // Changing error message
            this.setState({
                formError: true,
                formErrorMessage: errorHtml
            });
        }
    }

    loginPortal = (event, redirectUrl) => {
        event.preventDefault();
        fn.logOut();
        const link = `${url.baseUrl}/${redirectUrl}`;
        let element = document.createElement("a");
        element.href = link;
        element.click();
    }

    renderLinkInfo = (admin, params) => {
        return (
            <li>
                <span>{admin}:</span>
                <button
                    className="btn-club-portal"
                    onClick={(e) => this.loginPortal(e, params)}>{url.baseUrl}/{params}</button>
                <Dialog
                    className="url-dialog"
                    showCloseButton={false}
                    title=""
                    content={
                        <div className="dialog-body-inner">
                            <div className={"dialog-left-sidebar"}>
                                <img src={'/images/ball-soccer.png'}/>
                            </div>
                            <div className={"dialog-right-side"}>
                                <h3>{admin}</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco</p>
                            </div>
                        </div>
                    }
                    buttons={[<button key="cancel" className="button">Go back</button>]}
                >
                    <div className="url-info">?</div>
                </Dialog>
            </li>
        )
    }

    render() {
        const {clubAdmins} = this.props;
        const clubId = _.parseInt(this.props.params.clubId);
        const {licence} = this.props;
        const {slug} = this.state;
        const {club, me} = this.props;

        const {clubTypes} = this.state;
        const isRegistered = (club.vat_rate || club.vat_number) ? 1 : 0;
        const academySelected = this.state.type && this.state.type.indexOf('fc') === -1;
        const fcSelected = this.state.type && this.state.type.indexOf('academy') === -1;

        const dialogContent = (
            <div>
                {this.state.formError ? <div className="text-danger">{this.state.formErrorMessage}</div> : null}
                {
                    clubId === 0 ? <div>
                        <p style={{marginBottom: '30px'}}>{`Package URL: `}
                            <strong>{`mygrassrootsclub.com/${slug}`}</strong></p>
                        <p className="text-danger">Once you click SAVE SETUP you will not be able to change this
                            URL.</p>
                    </div> : 'Are you sure you want to update?'
                }

            </div>
        )

        return (
            <div id="content"
                 className="site-content-inner club-setup-page">
                <PageTitle value="Setup Package"></PageTitle>

                <Form loader
                      ref={ref => this.refForm = ref}>

                    <FormSection title="Club structure">
                        <Radio
                            label=""
                            name="type"
                            onChange={this.handleInputChange}
                            options={clubTypes}
                            styled
                            validation="required"
                            value={club.type}
                            wide
                        />

                        {academySelected &&
                        <TextInput
                            className="tooltips"
                            placeholder="Soccer School name"
                            name="ssCompany"
                            label="Soccer School name"
                            value={club.ss_company}
                            onChange={this.handleInputChange}
                            prepend={<i className="ion-social-buffer"/>}
                        />
                        }

                        {academySelected &&
                        <TextInput
                            className="tooltips"
                            placeholder="Company number if applicable"
                            name="companyNumber"
                            label="Company number if applicable"
                            value={club.company_number}
                            onChange={this.handleInputChange}
                            prepend={<i className="ion-social-buffer"/>}
                        />
                        }

                        {fcSelected &&
                        <TextInput
                            className="tooltips"
                            placeholder="Football Club name"
                            name="fcCompany"
                            label="Football Club name"
                            value={club.fc_company}
                            onChange={this.handleInputChange}
                            prepend={<i className="ion-social-buffer"/>}
                        />
                        }

                        {fcSelected &&
                        <TextInput
                            className="tooltips"
                            placeholder="FA Affiliation number"
                            name="faAffiliation"
                            label="FA Affiliation number"
                            value={club.fa_affiliation}
                            onChange={this.handleInputChange}
                            prepend={<i className="ion-social-buffer"/>}
                        />
                        }

                    </FormSection>

                    <FormSection title="Club Contact Details">
                        <TextInput
                            className="tooltips"
                            label="Address 1"
                            placeholder="Address 1"
                            name="address"
                            onChange={this.handleInputChange}
                            validation="required"
                            value={club.address}
                            prepend={<i className="ion-location"/>}
                        />
                        <TextInput
                            placeholder="Address 2"
                            className="tooltips"
                            label="Address 2"
                            name="address2"
                            onChange={this.handleInputChange}
                            value={club.address2}
                            prepend={<i className="ion-location"/>}
                        />

                        <TextInput
                            placeholder="City/town"
                            className="tooltips"
                            label="City/town"
                            name="town"
                            onChange={this.handleInputChange}
                            value={club.town}
                            prepend={<i className="ion-location"/>}
                        />
                        <TextInput
                            placeholder="Postcode"
                            className="tooltips"
                            label="Postcode"
                            name="postcode"
                            onChange={this.handleInputChange}
                            validation="required"
                            value={club.postcode}
                            prepend={<i className="ion-location"/>}
                        />
                        <TextInput
                            className="tooltips"
                            placeholder="Contact number"
                            name="telephone"
                            label="Contact number"
                            value={club.telephone}
                            validation="required"
                            onChange={this.handleInputChange}
                            prepend={<i className="ion-ios-telephone"/>}
                        />
                        <TextInput
                            className="tooltips"
                            name="email"
                            placeholder="Email"
                            label="Email"
                            value={club.email}
                            validation="required|email"
                            onChange={this.handleInputChange}
                            prepend={<i className="ion-at"/>}
                        />
                    </FormSection>

                    <FormSection title="Internet">
                        <TextInput
                            className="tooltips"
                            name="website"
                            placeholder="Website"
                            label="Website"
                            value={club.website}
                            onChange={this.handleInputChange}
                            prepend={<i className="ion-ios-world-outline"/>}
                        />
                        <FileUpload
                            className="tooltips"
                            placeholder="Upload club logo"
                            accept=".jpg,.jpeg,.png"
                            clearable
                            label="Club Badge / Logo"
                            name="pic"
                            onChange={this.handleInputChange}
                            prepend={<i className="ion-android-upload"/>}
                            validation="file|max:1000"
                        />
                        {clubId !== 0 ?
                            <FormSection title="">
                                <div className="club-url">
                                    <ul>
                                        {this.renderLinkInfo('Super Admin', '')}
                                        {this.renderLinkInfo('Club Admin', `${slug ? slug : club.slug}`)}
                                        {this.renderLinkInfo('New Parent', `${slug ? slug : club.slug}/${url.registerAccounts}`)}
                                        {this.renderLinkInfo('Parent Terminal', `${slug ? slug : club.slug}`)}
                                        {this.renderLinkInfo('Coach Terminal', `${slug ? slug : club.slug}`)}
                                    </ul>
                                </div>
                            </FormSection> :

                            <FormSection className="club-description">
                                <PageDescription>
                                    Please select your club name which will be used in the URL for your My Grassroots
                                    club software. We advise you use your club name. You will not be a able to change
                                    this URL.
                                </PageDescription>

                                <TextInput
                                    name="title"
                                    label="Club name"
                                    placeholder="Club name"
                                    value={club.slug}
                                    validation="required"
                                    onChange={this.handleInputChange}
                                    prepend={<i className="ion-ios-football-outline"/>}
                                />
                                <TextInput
                                    disabled
                                    className="club-setup-url"
                                    name="slug"
                                    label="Club URL"
                                    validation="required"
                                    value={club.slug}
                                    ref={ref => this.refSlug = ref}
                                    prepend="mygrassrootsclub.com/"
                                    onChange={this.handleInputChange}/>
                            </FormSection>
                        }
                    </FormSection>

                    <FormSection title="VAT">
                        <Radio
                            styled
                            name="isRegistered"
                            wide
                            label="VAT registered"
                            value={isRegistered}
                            options={[{id: 1, title: 'Yes'}, {id: 0, title: 'No'}]}
                            onChange={this.handleInputChange}
                        />
                        {this.state.isRegistered != 1 &&
                        <TextInput
                            className="tooltips"
                            placeholder="VAT Threshold"
                            name="threshold"
                            label="VAT Threshold"
                            prepend="£"
                            value={club.threshold}
                            onChange={this.handleInputChange}
                        />
                        }

                        {this.state.isRegistered == 1 &&
                        <TextInput
                            className="tooltips"
                            placeholder="VAT Number"
                            name="vatNumber"
                            label="VAT Number"
                            value={club.vat_number}
                            onChange={this.handleInputChange}
                        />
                        }

                        {this.state.isRegistered == 1 &&
                            <TextInput
                                className="tooltips"
                                placeholder="VAT Rate"
                                name="vatRate"
                                label="VAT Rate"
                                value={club.vat_rate}
                                append="%"
                                onChange={this.handleInputChange}
                            />
                        }

                        <FormSection title="Club admins">
                            <div>As the Super admin you have overall control above all other users (Club admins, Coaches
                                and Parents) also you are automatically added as a Club admin too. As the Super admin
                                you can add additional Club admins (and remove them) via the section below. Club admins
                                will have access to the main club system in order to run the club but the Super admin
                                will always have overall control.
                            </div>
                            {clubId === 0 ?
                                <Table
                                    headers={['Club Admin', 'Email Address', 'Telephone']}
                                    icon="ion-person"
                                    className={(clubAdmins.currentCollection.length === 1 ? 'shrink' : '')}
                                >
                                    <tr>
                                        <td>{me && me.display_name}</td>
                                        <td>{me && me.email}</td>
                                        <td>{me && me.telephone}</td>
                                    </tr>
                                </Table>

                                :

                                <Table
                                    headers={['Club Admin', 'Email Address', 'Telephone', 'Options']}
                                    icon="ion-person"
                                    className={(clubAdmins.currentCollection.length === 1 ? 'shrink' : '')}
                                >
                                    {_.map(clubAdmins.currentCollection, (id) => {
                                        const user = clubAdmins.collection[id];
                                        return (
                                            <tr key={`admin${user.user_id}`}>
                                                <td>{user.display_name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.telephone}</td>
                                                <td className="short table-options">
                                                    <Link
                                                        to={`${url.club}/${this.props.params.clubId}/admins/${user.user_id}/edit`}
                                                        className="button icon">
                                                        <i title="Edit" className="ion-edit"/>
                                                    </Link>

                                                    <span className="button icon"
                                                          onClick={() => this.deleteUser(user)}>
                                                        <i title="Delete" className="ion-trash-b"/>
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </Table>}

                            <Repeater
                                className="setup-user"
                                addButton={<span className="button">Add another admin</span>}
                                count={1}
                                name="users"
                                onChange={this.handleInputChange}
                                removeButton={<i className="button-icon ion-trash-b"/>}
                                title=""
                            >
                                <TextInput
                                    className="tooltips"
                                    placeholder="First name"
                                    name="first_name"
                                    label="First name"
                                    prepend={<i className="ion-person"/>}
                                />

                                <TextInput
                                    className="tooltips"
                                    placeholder="Last name"
                                    name="last_name"
                                    label="Last name"
                                    prepend={<i className="ion-person"/>}
                                />

                                <TextInput
                                    className="tooltips"
                                    placeholder="Telephone"
                                    name="telephone"
                                    label="Telephone"
                                    prepend={<i className="ion-ios-telephone"/>}
                                />

                                <TextInput
                                    className="tooltips"
                                    placeholder="Email"
                                    name="email"
                                    validation="email"
                                    label="Email"
                                    prepend={<i className="ion-at"/>}
                                />

                                <TextInput
                                    className="tooltips"
                                    placeholder="Password"
                                    name="password"
                                    validation="min:8"
                                    label="Password"
                                    type="password"
                                    prepend={<i className="ion-locked"/>}
                                />

                            </Repeater>
                        </FormSection>
                        <div className="form-actions">
                            <Link to={url.licence}
                                  className="button">Back
                            </Link>

                            <button className="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        this.refConfirmDialog.open()
                                    }}>Save
                            </button>

                            <Dialog
                                showCloseButton={false}
                                ref={ref => this.refConfirmDialog = ref}
                                title=""
                                buttons={[
                                    <div className="club-setup-button" key="somekey">
                                        <button
                                            className="button"
                                            onClick={this.handleCancelConfirmDialog}>Cancel
                                        </button>

                                        <button
                                            className="button hover-blue"
                                            onClick={this.handleConfirmSubmit}>Save
                                        </button>
                                    </div>
                                ]}
                                content={
                                    <div className="dialog-body-inner">
                                        <div className={"dialog-left-sidebar"}>
                                            <img src={'/images/ball-soccer.png'}/>
                                        </div>
                                        <div className={"dialog-right-side"}>
                                            <h3>{clubId === 0 ? 'Save Setup' : 'SATE SETUP CHANGES'}</h3>
                                            {dialogContent}
                                        </div>
                                    </div>
                                }
                                onClose={this.closeDialog}
                            >
                                <button className="button hidden">Save
                                </button>
                            </Dialog>

                            <Dialog
                                showCloseButton={false}
                                title=""
                                buttons={[
                                    <div key="buttons">
                                        <button className="button"
                                                onClick={this.closeDialog}
                                        >Go back
                                        </button>

                                        <button
                                            className={"button hover-blue" + (this.state.disableClass ? "disabled" : '')}
                                            onClick={() => this.confirmDeleteUser()}
                                        >Delete
                                        </button>
                                    </div>
                                ]}
                                ref={ref => this.refDialog = ref}

                                content={
                                    <div className="dialog-body-inner">
                                        <div className={"dialog-left-sidebar"}>
                                            <img src={'/images/ball-soccer.png'}/>
                                        </div>
                                        <div className={"dialog-right-side"}>
                                            <h3>Delete Club Admin</h3>
                                            <p>{`Are you sure you want to delete ${this.state.deleteUser.first_name} ${this.state.deleteUser.last_name}?`}</p>
                                        </div>
                                    </div>
                                }>
                                <span className="button hidden">Cancel Package</span>
                            </Dialog>
                        </div>
                    </FormSection>

                </Form>
            </div>
        );
    }
}