import React from 'react';
import {connect} from 'react-redux';
import moment, {months} from 'moment';
import _ from 'lodash';
import {
    DatePicker,
    FileUpload,
    Form,
    Radio,
    Select,
    TextInput,
    MultiSelect,
    Dialog
} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {
    Back,
    FormButton,
    FormSection,
    PageTitle
} from 'app/components';

@connect((store) => {
    return {}
})

export default class Add extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            genderList: [
                {id: 'male', title: 'Male'},
                {id: 'female', title: 'Female'},
            ],
            guardianList: [],
            statusList: [],
            sibling: false,
            guardianFormError: false,
            guardianFormErrorMessage: '',
            addPlayerError: false,
            errorMessage: ''
        };
    }

    getSortedGroups = async (ageToSend = null) => {
        if (ageToSend !== undefined && ageToSend !== null) {
            const filteredAgeList = await api.get('/dropdown/teams/skill-group?age_group='+ageToSend.toString());
            if (!api.error(filteredAgeList)) {
                return filteredAgeList.data;
            }
        }
    }

    componentWillMount = async () => {
        const statusList = await api.get('/dropdown/player-statuses');
        let guardianList = await api.get('/dropdown/guardians');
        const agegroupList = await api.get('/age-groups');
        const skillGroupList = await api.get('/dropdown/teams/skill-group');
        const teams = await api.get('/dropdown/teams/team');
        let filterSkillGroupList = []
        this.getSortedGroups()

        // Filter skill group item for list
        _.map(skillGroupList.data, (skillGroup) => {
            let newGroup = {
                ...skillGroup,
                title: `${skillGroup.title} - ${skillGroup.agegroup_title} - ${skillGroup.gender} - size (${skillGroup.total}/${skillGroup.max_size})`
            }
            filterSkillGroupList.push(newGroup)
        })

        // Add guardian option to select bar.
        const guardian = {id: 100000, title: 'Add new guardian'};
        guardianList = _.concat(guardian, guardianList.data);

        this.setState({
            guardianList: guardianList,
            statusList: statusList.data,
            agegroupList: agegroupList.data.entities,
            skillGroupList: filterSkillGroupList,
            allTeams: [...teams.data],
        });
    }

    handleInputChange = async (name, value) => {
        if (name === 'guardianId' && value === 100000) {
            this.refDialog.open();
            return;
        }

        if (name === "birthday") {
            moment.updateLocale('en', {
                relativeTime: {
                    past: '%s'
                }
            });

            let playerAgegroup;
            let ageToSend = null;
            _.forEachRight(this.state.agegroupList, (agegroup) => {
                if (agegroup.max_age > fn.diffDate(value)) {
                    playerAgegroup = {...agegroup}
                    ageToSend = fn.diffDate(value);
                }
            })
            
            //Api request which returns sorted groups
            const res = await this.getSortedGroups(ageToSend)
            this.setState({skillGroupList: res})

            if (playerAgegroup) {
                this.setState({potentialAgeGroup: playerAgegroup.title})
            } else {
                this.setState({potentialAgeGroup: ''})
            }
        }

        this.setState({[name]: value});
    }

    closeDialogBox = () => {
        this.refDialog.close();
    }

    closeErrorDialogBox = () => {
        this.refDialogError.close();
    }

    addNewGuardian = () => {
        this.refGuardianForm.submit();
    }

    fetchGuardianDropdown = async () => {
        let guardianList = await api.get('/dropdown/guardians');
        const guardian = {id: 100000, title: 'Add new guardian'};
        guardianList = _.concat(guardian, guardianList.data);
        this.setState({
            guardianList: guardianList
        })
    }

    handleSubmitNewGuardian = async () => {
        const formData = new FormData();
        formData.append('address', this.state.gaddress);
        formData.append('email', this.state.email);
        formData.append('emergency_number', this.state.gemergency_number);
        formData.append('first_name', this.state.gfirst_name);
        formData.append('last_name', this.state.glast_name);
        formData.append('mobile', this.state.gmobile);
        formData.append('password_confirmation', this.state.gpassword);
        formData.append('password', this.state.gpassword);
        formData.append('postcode', this.state.gpostcode);
        formData.append('role', 3); // guardian
        formData.append('telephone', this.state.gtelephone);
        formData.append('town', this.state.gtown);
        formData.append('partner_name', this.state.gpartner_name);
        formData.append('partner_tel', this.state.gpartner_tel);

        const response = await api.post('/users', formData);

        if (!api.error(response, false)) {
            this.refGurdianForm && this.refGurdianForm.hideLoader();
            this.refDialog.close()
            this.fetchGuardianDropdown()

            this.setState({
                guardianFormError: false,
                guardianFormErrorMessage: ''
            });

        } else {
            const errorData = api.getErrorsHtml(response.data);
            this.setState({
                guardianFormError: true,
                guardianFormErrorMessage: errorData
            });
            this.refGuardianForm && this.refGuardianForm.hideLoader();
        }
    }

    onAddSibling = () => {
        this.setState({sibling: true})
    }

    clearForm = () => {
        this.refFirstName && this.refFirstName.clear();
        this.refLastName && this.refLastName.clear();
        this.refDob && this.refDob.clear();
        this.refSchool && this.refSchool.clear();
        this.refProfile && this.refProfile.clear();
        this.refNotes && this.refNotes.clear();
        this.refStatus && this.refStatus.clear();
        this.refGender && this.refGender.clear();
        this.refSkillGroup && this.refSkillGroup.clear();
        this.refTeams && this.refTeams.clear();
    }



    handleSubmit = async () => {
        const {
            teamGroups,
            skillGroups,
            firstName,
            lastName,
            middleName,
            fanNo,
            birthday,
            gender,
            school,
            sibling,
            guardianId,
            billingGuardian,
            medicalConditions,
            status,
            pic
        } = this.state

        const {
            params
        } = this.props

        const formData = new FormData();
        firstName && formData.append('first_name', firstName);
        lastName && formData.append('last_name', lastName);
        middleName && formData.append('middle_name', middleName);
        fanNo && formData.append('fan_no', fanNo);
        birthday && formData.append('birthday', birthday);
        gender && formData.append('gender', gender);
        school && formData.append('school', school);
        guardianId && formData.append('guardian_id', guardianId);
        billingGuardian && formData.append('billing_guardian_id', billingGuardian);
        medicalConditions && formData.append('medical_conditions', medicalConditions);
        status && formData.append('status', status);
        pic && formData.append('pic', pic);

        // Add skill group
        skillGroups.map((team, index) => {
            if (!team.new) {
                return false;
            }

            formData.append(`skill_groups[${index}][team_id]`, team.id)
            formData.append(`skill_groups[${index}][reason]`, '')
            formData.append(`skill_groups[${index}][status]`, 'trial')
        });

        // Add teams if selected
        _.map(teamGroups, (team, index) => {
            formData.append(`teams[${index}][team_id]`, team.id)
            formData.append(`teams[${index}][reason]`, '')
            formData.append(`teams[${index}][status]`, 'trial')
        })

        const response = await api.post('/players', formData)

        if (!api.error(response, false) && !sibling) {
            this.clearForm()
            this.refForm && this.refForm.hideLoader()
            !this.props.params.userId ? fn.navigate(url.player) : fn.navigate(`${url.guardian}/${this.props.params.userId}`)
        } else {
            const errorData = api.getErrorsHtml(response.data);
            this.setState({
                addPlayerError: true,
                errorMessage: errorData
            });
            this.refForm && this.refForm.hideLoader();
            this.refDialogError.open()
        }
    }

    handleValidationError = () => {
        const fields = this.refForm.fields;
        _.forEach(fields, (field, index) => {
          const validate = field.validate();
          if (!validate.valid) {
            const element = document.getElementsByName(field.props.name);
            element[0].focus();
            return false;
          }
        });
      };

    render() {
        const {
            genderList,
            guardianList,
            statusList,
            skillGroupList,
            allTeams
        } = this.state

        return (
            <div id="content" className="site-content-inner player-page">
                <PageTitle value="Add player"/>

                <Form ref={ref => this.refForm = ref}
                      className="form-section"
                      onSubmit={this.handleSubmit}
                      onValidationError={this.handleValidationError}
                      loader
                      wide
                      >

                    <FormSection title="Personal details">
                        <TextInput
                            ref={ref => this.refFirstName = ref}
                            className="tooltips"
                            placeholder="First name"
                            label="First name"
                            name="firstName"
                            onChange={this.handleInputChange}
                            prepend={<i className="ion-person"/>}
                            validation="required"
                        />

                        <TextInput
                            ref={ref => this.refMiddleName = ref}
                            className="tooltips"
                            placeholder="Middle name"
                            label="Middle name"
                            name="middleName"
                            onChange={this.handleInputChange}
                            prepend={<i className="ion-person"/>}
                        />

                        <TextInput
                            ref={ref => this.refLastName = ref}
                            className="tooltips"
                            placeholder="Last name"
                            label="Last name"
                            name="lastName"
                            onChange={this.handleInputChange}
                            prepend={<i className="ion-person"/>}
                            validation="required"
                        />

                        <TextInput
                            type="number"
                            ref={ref => this.refFanNumber = ref}
                            className="tooltips text-gray"
                            placeholder="FAN number"
                            label="FAN number"
                            name="fanNo"
                            onChange={this.handleInputChange}
                            prepend={<i className="ion-person"/>}
                        />

                        <DatePicker
                            ref={ref => this.refDob = ref}
                            className="tooltips"
                            placeholder="Date of birth"
                            label="Date of birth"
                            name="birthday"
                            onChange={this.handleInputChange}
                            pastOnly
                            showYearSelect
                            validation="required"
                            prepend={<i className="ion-android-calendar"/>}
                        />
                        <TextInput
                            className="tooltips"
                            placeholder="Suggested age group"
                            label="Suggested Age Group"
                            name="potential_age_group"
                            value={this.state.potentialAgeGroup}
                            prepend={<i className="ion-ios-people-outline"/>}
                            disabled
                        />

                        <Select
                            className="tooltips"
                            placeholder="Guardian"
                            label="Guardian"
                            name="guardianId"
                            onChange={this.handleInputChange}
                            options={guardianList}
                            disabled={!!this.props.params.userId}
                            validation="required"
                            value={this.props.params.userId}
                            prepend={<i className="ion-person-stalker"/>}
                        />

                        <Select
                            className="tooltips"
                            placeholder="Billing contact"
                            label="Billing contact"
                            name="billingGuardian"
                            validation="required"
                            onChange={this.handleInputChange}
                            options={guardianList}
                            prepend={<i className="ion-person-add"/>}
                        />

                        <TextInput
                            ref={ref => this.refSchool = ref}
                            className="tooltips"
                            placeholder="School"
                            label="School"
                            name="school"
                            onChange={this.handleInputChange}
                            validation="required"
                            prepend={<i className="ion-university"/>}
                        />

                        <Radio
                            ref={ref => this.refGender = ref}
                            name="gender"
                            onChange={this.handleInputChange}
                            options={genderList}
                            styled
                            validation="required"
                        />

                        <FileUpload
                            ref={ref => this.refProfile = ref}
                            className="tooltips"
                            placeholder="Upload photo"
                            accept=".jpg,.jpeg,.png"
                            clearable
                            label="Upload photo"
                            name="pic"
                            onChange={this.handleInputChange}
                            prepend={<i className="ion-android-upload"/>}
                            validation="file|max:1000"
                        />

                        <TextInput
                            ref={ref => this.refNotes = ref}
                            label="Medical notes"
                            name="medicalConditions"
                            onChange={this.handleInputChange}
                            textarea
                            wide
                        />

                        <Select
                            ref={ref => this.refStatus = ref}
                            className="tooltips"
                            placeholder="Player status"
                            label="Player status"
                            name="status"
                            onChange={this.handleInputChange}
                            options={statusList}
                        />

                        <MultiSelect
                            ref={ref => this.refSkillGroup = ref}
                            label={['Please select a soccer school group (s)', '']}
                            name="skillGroups"
                            onChange={this.handleInputChange}
                            options={skillGroupList}
                            wide
                        />

                        <MultiSelect
                            ref={ref => this.refTeams = ref}
                            label={['Please select a teams', '']}
                            name="teamGroups"
                            onChange={this.handleInputChange}
                            options={allTeams}
                            wide
                        />
                    </FormSection>

                    <div className="form-actions">
                        <Back className="button" confirm>Cancel</Back>
                        <button type="submit"
                                className="button form-submit"
                                onClick={this.onAddSibling}>Save & Add Sibling
                        </button>

                        <FormButton label="Save & Finish"/>
                    </div>
                </Form>

                <Dialog
                    ref={ref => this.refDialogError = ref}
                    close={false}
                    showCloseButton={false}
                    title="Error"
                    content={this.state.errorMessage}
                    buttons={[
                        <button className="button"
                                onClick={() => this.closeErrorDialogBox()}>Go Back
                        </button>
                    ]}
                >
                    <button className="button hidden"></button>
                </Dialog>

                <Dialog
                    className="add-new-guardian"
                    showCloseButton={false}
                    title="Add new guardian"
                    buttons={[
                        <div key="buttons">
                            <button className="button"
                                    onClick={this.closeDialogBox}
                            >Cancel
                            </button>

                            <button className={"button"}
                                    onClick={() => this.addNewGuardian()}
                            >Add guardian
                            </button>
                        </div>
                    ]}
                    ref={ref => this.refDialog = ref}

                    content={

                        <Form loader wide onSubmit={this.handleSubmitNewGuardian} className="form-section"
                              ref={ref => this.refGuardianForm = ref}>
                            <FormSection title="Account">
                                <TextInput
                                    className="tooltips"
                                    placeholder="Email"
                                    label="Email"
                                    name="email"
                                    onChange={this.handleInputChange}
                                    prepend={<i className="ion-android-mail"/>}
                                    validation="required"
                                />
                                <TextInput
                                    className="tooltips"
                                    placeholder="Password"
                                    label="Password"
                                    name="gpassword"
                                    onChange={this.handleInputChange}
                                    prepend={<i className="ion-locked"/>}
                                    type="password"
                                    validation="required"
                                />
                            </FormSection>

                            <FormSection title="Personal Details">
                                <TextInput
                                    className="tooltips"
                                    placeholder="First Name"
                                    label="First name"
                                    name="gfirst_name"
                                    onChange={this.handleInputChange}
                                    prepend={<i className="ion-person"/>}
                                    validation="required"
                                />
                                <TextInput
                                    className="tooltips"
                                    placeholder="Last Name"
                                    label="Last name"
                                    name="glast_name"
                                    onChange={this.handleInputChange}
                                    prepend={<i className="ion-person"/>}
                                    validation="required"
                                />
                                <TextInput
                                    className="tooltips"
                                    placeholder="Mobile"
                                    label="Mobile"
                                    name="gmobile"
                                    onChange={this.handleInputChange}
                                    prepend={<i className="ion-ios-telephone"/>}
                                />
                                <TextInput
                                    className="tooltips"
                                    placeholder="Telephone"
                                    prepend={<i className="ion-ios-telephone"/>}
                                    name="gtelephone"
                                    label="Telephone"
                                    onChange={this.handleInputChange}
                                />
                                <TextInput
                                    className="tooltips"
                                    placeholder="Emergency Contact Number"
                                    label="Emergency Contact Number"
                                    name="gemergency_number"
                                    onChange={this.handleInputChange}
                                    prepend={<i className="ion-ios-telephone"/>}
                                />
                                <TextInput
                                    className="tooltips"
                                    placeholder="Address"
                                    label="Address"
                                    name="gaddress"
                                    onChange={this.handleInputChange}
                                    prepend={<i className="ion-location"/>}
                                />
                                <TextInput
                                    className="tooltips"
                                    placeholder="Town"
                                    label="Town"
                                    name="gtown"
                                    onChange={this.handleInputChange}
                                    prepend={<i className="ion-location"/>}
                                />
                                <TextInput
                                    className="tooltips"
                                    placeholder="Postcode"
                                    label="Postcode"
                                    name="gpostcode"
                                    onChange={this.handleInputChange}
                                    prepend={<i className="ion-location"/>}
                                />
                                <TextInput
                                    className="tooltips"
                                    placeholder="Add Partner"
                                    label="Add Partner"
                                    name="gpartner_name"
                                    onChange={this.handleInputChange}
                                    prepend={<i className="ion-person"/>}
                                />
                                <TextInput
                                    className="tooltips"
                                    placeholder="Partner's Telephone"
                                    label="Partner's Telephone"
                                    name="gpartner_tel"
                                    onChange={this.handleInputChange}
                                    prepend={<i className="ion-ios-telephone"/>}
                                />
                            </FormSection>
                            {this.state.guardianFormError ? this.state.guardianFormErrorMessage : ''}
                        </Form>
                    }
                >
                    <span className="button hidden">Cancel Package</span>
                </Dialog>

            </div>
        );
    }

}
