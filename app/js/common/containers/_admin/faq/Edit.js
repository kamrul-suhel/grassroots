import React from 'react';
import {connect} from 'react-redux';
import {Checkbox, FileUpload, Form, TextInput, Radio, Select} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {EditorState, convertFromRaw, convertToRaw, ContentState} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import htmlToDraft from 'html-to-draftjs'
import {Editor} from 'react-draft-wysiwyg';
import {Back, FormButton, PageTitle, FormSection} from 'app/components';
import draftToHtml from "draftjs-to-html";

@connect((store, ownProps) => {
    return {
        faq: store.faq.collection[ownProps.params.faqId] || {},
    };
})
export default class Edit extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            optionClubAdmin: [],
            editorState: {},
            faq: {},
            uploadedImages: []
        }
    }

    componentWillMount = async () => {
        const url = `/faq/${this.props.params.faqId}`
        const response = await api.get(url)

        let jsonObj = htmlToDraft(response.data.answer)
        if (jsonObj) {
            const contentState = ContentState.createFromBlockArray(jsonObj.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.setState({
                faq: {...response.data},
                editorState: editorState
            })
        }

    }

    handleInputChange = (name, value) => {
        const {optionClubAdmin} = this.state

        const oClubadmin = _.includes(name, 'oClubAdmin');
        if (oClubadmin) {
            let oClubAdmin = optionClubAdmin;
            oClubAdmin[name] = [...value]
            this.setState({optionClubAdmin: oClubAdmin})
        } else {
            this.setState({[name]: value});
        }
    }

    handleSubmit = async () => {
        const {
            question,
            answer,
            file,
            type,
            superAdmin,
            optionClubAdmin,
            coachOptions,
            parents,
            status
        } = this.state


        const formData = new FormData()
        formData.append('question', question)

        file && formData.append('file', file)
        formData.append('type', type)

        const htmlObj = convertToRaw(this.state.editorState.getCurrentContent())
        const html = draftToHtml(htmlObj);
        formData.append('answer', html)

        switch (type) {
            case 'superadmin':
                formData.append('faq_section', _.join(superAdmin, ','))
                break

            case 'clubadmin':
                let clubAdmin = []
                _.forOwn(optionClubAdmin, (value, key) => {
                    clubAdmin = _.concat(clubAdmin, value)
                })
                clubAdmin = _.join(clubAdmin, ',')
                formData.append('faq_section', clubAdmin)
                break

            case 'coach':
                formData.append('faq_section', _.join(coachOptions, ','))
                break

            case 'parents':
                formData.append('faq_section', _.join(parents, ','))
                break
        }

        const response = await api.post(`/faq/${this.props.params.faqId}`, formData)

        if (!api.error(response)) {
            fn.navigate(url.manageFaq)
            fn.showAlert('FAQ has been updated!', 'success');
        } else {
            this.refForm && this.refForm.hideLoader();
        }
    }

    uploadCallback = async (file) => {
        // Make sure you have a uploadImages: [] as your default state
        let uploadedImages = this.state.uploadedImages;

        let formData = new FormData();
        formData.append('file', file);

        const response = await api.post('faq/fileupload', formData)

        if (!api.error(response)) {
            const imageObject = {
                file: file,
                localSrc: URL.createObjectURL(file),
            }

            uploadedImages.push(imageObject);
            this.setState({uploadedImages: uploadedImages})
            return new Promise(
                (resolve, reject) => {
                    resolve({data: {link: response.data.file_path}});
                }
            );
        }
    }

    getSelectedOption(section = null) {
        const {faq} = this.props
        const value = faq.faq_section && faq.faq_section.split(',')

        if (section === null) {
            return value
        } else {
            let selectedValue = []
            switch (section) {
                case 'terminal':
                    _.map(value, value => {
                        if (
                            value === 'caDashboard' ||
                            value === 'caCalendar' ||
                            value === 'caTodoList' ||
                            value === 'caSetupWizard'
                        ) {
                            selectedValue.push(value)
                        }
                    })
                    break;

                case 'communication':
                    _.map(value, value => {
                        if (
                            value === 'caContact' ||
                            value === 'caEmail' ||
                            value === 'caMessageBoard'
                        ) {
                            selectedValue.push(value)
                        }
                    })
                    break;

                case 'coaches':
                    _.map(value, value => {
                        if (
                            value === 'caCoaches' ||
                            value === 'caAvailability' ||
                            value === 'caSchedules' ||
                            value === 'caCoachAssessments'
                        ) {
                            selectedValue.push(value)
                        }
                    })
                    break;

                case 'documents':
                    _.map(value, value => {
                        if (
                            value === 'caConsent' ||
                            value === 'caDownloads' ||
                            value === 'caExports' ||
                            value === 'caFeedback'
                        ) {
                            selectedValue.push(value)
                        }
                    })
                    break;

                case 'finance':
                    _.map(value, value => {
                        if (value === 'caAccount') {
                            selectedValue.push(value)
                        }
                    })
                    break;

                case 'parentGuardians':
                    _.map(value, value => {
                        if (value === 'caParentsGuardians') {
                            selectedValue.push(value)
                        }
                    })
                    break;

                case 'players':
                    _.map(value, value => {
                        if (value === 'caPlayers') {
                            selectedValue.push(value)
                        }
                    })
                    break;

                case 'termsGroups':
                    _.map(value, value => {
                        if (
                            value === 'caAssignKit' ||
                            value === 'caRegisters' ||
                            value === 'caReEnrollment' ||
                            value === 'caEvents' ||
                            value === 'caFixtures' ||
                            value === 'caFootballTeams' ||
                            value === 'caProgrammes'
                        ) {
                            selectedValue.push(value)
                        }
                    })
                    break;

                case 'settings':
                    _.map(value, value => {
                        if (
                            value === 'caPackage' ||
                            value === 'caDetails' ||
                            value === 'caChangePassword'
                        ) {
                            selectedValue.push(value)
                        }
                    })
                    break;

                case 'superAdmin':
                    _.map(value, value => {
                        if (
                            value === 'saPurchasedPackage' ||
                            value === 'saNewPackage' ||
                            value === 'saDetails'
                        ) {
                            selectedValue.push(value)
                        }
                    })
                    break;

                case 'parents':
                    _.map(value, value => {
                        if (
                            value === 'gDashboard' ||
                            value === 'gCalendar' ||
                            value === 'gContacts' ||
                            value === 'gAttendance' ||
                            value === 'gStatements' ||
                            value === 'gChildren' ||
                            value === 'gTimetable' ||
                            value === 'gDropOff' ||
                            value === 'gSchedule' ||
                            value === 'gDownload' ||
                            value === 'gAssessments' ||
                            value === 'gTodoList' ||
                            value === 'gProgrammes' ||
                            value === 'gFeedback' ||
                            value === 'gMessage' ||
                            value === 'gHomework' ||
                            value === 'gAvailability' ||
                            value === 'gCoachingKit' ||
                            value === 'gPlayers' ||
                            value === 'gHelpDesk' ||
                            value === 'gHive'
                        ) {
                            selectedValue.push(value)
                        }
                    })
                    break;

                case 'coach':
                    _.map(value, value => {
                        if (
                            value === 'cDashboard' ||
                            value === 'cCalendar' ||
                            value === 'cContacts' ||
                            value === 'cAttendance' ||
                            value === 'cStatements' ||
                            value === 'cSchedule' ||
                            value === 'cAssessments' ||
                            value === 'cToDoList' ||
                            value === 'cProgrammes' ||
                            value === 'cFeedback' ||
                            value === 'cMessageBoard' ||
                            value === 'cHomework' ||
                            value === 'cAvailability' ||
                            value === 'cCoachingKit' ||
                            value === 'cPlayers' ||
                            value === 'cHelpDesk' ||
                            value === 'cHive'
                        ) {
                            selectedValue.push(value)
                        }
                    })
                    break;
            }
            return selectedValue;
        }
    }

    renderCoach() {
        return (
            <div className="faq-item">
                <h2>Coaches</h2>
                <div className="faq-item-body">
                    <Checkbox
                        value={this.getSelectedOption('coach')}
                        name="coachOptions"
                        options={[
                            {
                                id: 'cDashboard',
                                title: 'Dashboard'
                            },
                            {
                                id: 'cCalendar',
                                title: 'Calendar'
                            },
                            {
                                id: 'cContacts',
                                title: 'Contacts'
                            },
                            {
                                id: 'cAttendance',
                                title: 'Attendance'
                            },
                            {
                                id: 'cStatements',
                                title: 'Statements'
                            },
                            {
                                id: 'cSchedule',
                                title: 'My Schedule'
                            },
                            {
                                id: 'cAssessments',
                                title: 'Skills Assessments'
                            },
                            {
                                id: 'cToDoList',
                                title: 'To-do List'
                            },
                            {
                                id: 'cProgrammes',
                                title: 'Programmes'
                            },
                            {
                                id: 'cFeedback',
                                title: 'Feedback'
                            },
                            {
                                id: 'cMessageBoard',
                                title: 'Message Board'
                            },
                            {
                                id: 'cHomework',
                                title: 'Homework'
                            },
                            {
                                id: 'cAvailability',
                                title: 'Availability'
                            },
                            {
                                id: 'cCoachingKit',
                                title: 'Coaching Kit'
                            },
                            {
                                id: 'cPlayers',
                                title: 'Players'
                            },
                            {
                                id: 'cHelpDesk',
                                title: 'Info & Support'
                            },
                            {
                                id: 'cHive',
                                title: 'HIVE'
                            }
                        ]}
                        onChange={this.handleInputChange}
                    />
                </div>
            </div>
        )
    }

    renderGuardian() {
        return (
            <div className="faq-item">
                <h2>Parents</h2>
                <div className="faq-item-body">
                    <Checkbox
                        value={this.getSelectedOption('parents')}
                        name="parents"
                        options={[
                            {
                                id: 'gDashboard',
                                title: 'Dashboard'
                            },
                            {
                                id: 'gCalendar',
                                title: 'Calendar'
                            },
                            {
                                id: 'gContacts',
                                title: 'Contacts'
                            },
                            {
                                id: 'gAttendance',
                                title: 'Attendance'
                            },
                            {
                                id: 'gChildren',
                                title: 'My Children'
                            },
                            {
                                id: 'gTimetable',
                                title: 'Timetable'
                            },
                            {
                                id: 'gDropOff',
                                title: 'Timetable'
                            },
                            {
                                id: 'gDownload',
                                title: 'Download'
                            },
                            {
                                id: 'gStatements',
                                title: 'Statements'
                            },
                            {
                                id: 'gSchedule',
                                title: 'My Schedule'
                            },
                            {
                                id: 'gAssessments',
                                title: 'Skill Assessments'
                            },
                            {
                                id: 'gTodoList',
                                title: 'To-do List'
                            },
                            {
                                id: 'gProgrammes',
                                title: 'Programmes'
                            },
                            {
                                id: 'gFeedback',
                                title: 'Feedback'
                            },
                            {
                                id: 'gMessage',
                                title: 'Message Board'
                            },
                            {
                                id: 'gHomework',
                                title: 'Homework'
                            },
                            {
                                id: 'gAvailability',
                                title: 'Availability'
                            },
                            {
                                id: 'gCoachingKit',
                                title: 'Coaching Kit'
                            },
                            {
                                id: 'gPlayers',
                                title: 'Players'
                            },
                            {
                                id: 'gHelpDesk',
                                title: 'Info & Support'
                            },
                            {
                                id: 'gHive',
                                title: 'HIVE'
                            },
                        ]}
                        onChange={this.handleInputChange}
                    />
                </div>
            </div>
        )
    }

    renderSuperAdmin() {
        return (
            <div className="faq-item">
                <h2>Super Admin</h2>
                <div className="faq-item-body">
                    <Checkbox
                        value={this.getSelectedOption('superAdmin')}
                        name="superAdmin"
                        options={[
                            {
                                id: 'saPurchasedPackage',
                                title: 'Purchased Packages'
                            },
                            {
                                id: 'saNewPackage',
                                title: 'Buy New Package'
                            },
                            {
                                id: 'saDetails',
                                title: 'Account Details'
                            }
                        ]}
                        onChange={this.handleInputChange}
                    />
                </div>
            </div>
        )
    }

    renderClubAdmin() {
        return (
            <div className="faq-item">
                <h2>Club Admin</h2>
                <div className="faq-item-body">
                    <Checkbox
                        name="oClubAdmin-terminal"
                        label={"CLub Admin Terminal"}
                        value={this.getSelectedOption('terminal')}
                        options={[
                            {
                                id: 'caSetupWizard',
                                title: 'Setup Wizard'
                            },
                            {
                                id: 'caDashboard',
                                title: 'Dashboard'
                            },
                            {
                                id: 'caCalendar',
                                title: 'Calendar'
                            },
                            {
                                id: 'caTodoList',
                                title: 'To-do list'
                            }
                        ]}
                        onChange={this.handleInputChange}
                    />

                    <Checkbox
                        name="oClubAdmin-communication"
                        label="Communication"
                        value={this.getSelectedOption('communication')}
                        options={[
                            {
                                id: 'caContact',
                                title: 'Contact'
                            },
                            {
                                id: 'caEmail',
                                title: 'Email'
                            },
                            {
                                id: 'caMessageBoard',
                                title: 'Message board'
                            },
                        ]}
                        onChange={this.handleInputChange}/>

                    <Checkbox
                        name="oClubAdmin-coaches"
                        label="Coaches"
                        value={this.getSelectedOption('coaches')}
                        options={[
                            {
                                id: 'caCoaches',
                                title: 'Coaches'
                            },
                            {
                                id: 'caAvailability',
                                title: 'Availability'
                            },
                            {
                                id: 'caSchedules',
                                title: 'Schedules'
                            },
                            {
                                id: 'caCoachAssessments',
                                title: 'Coach Assessments'
                            }
                        ]}
                        onChange={this.handleInputChange}/>

                    <Checkbox
                        name="oClubAdmin-finance"
                        label="Finance"
                        className="option-account"
                        value={this.getSelectedOption('finance')}
                        options={[
                            {
                                id: 'caAccount',
                                title: 'Account'
                            },
                            {
                                id: 'caAccount-hidden',
                                title: 'account hidden'
                            }
                        ]}
                        onChange={this.handleInputChange}/>

                    <Checkbox
                        name="oClubAdmin-parentGuardians"
                        label="Parents"
                        className="option-parents"
                        value={this.getSelectedOption('parentGuardians')}
                        options={[
                            {
                                id: 'caParentsGuardians',
                                title: 'Parents'
                            },
                            {
                                id: 'caParentsGuardiansHidden',
                                title: 'Parents Hidden'
                            }
                        ]}
                        onChange={this.handleInputChange}/>

                    <Checkbox
                        name="oClubAdmin-player"
                        label="Players"
                        className="option-parents"
                        value={this.getSelectedOption('players')}
                        options={[
                            {
                                id: 'caPlayers',
                                title: 'Players'
                            },
                            {
                                id: 'caParentsGuardiansHidden',
                                title: 'Parent Hidden'
                            }
                        ]}
                        onChange={this.handleInputChange}/>

                    <Checkbox
                        name="oClubAdmin-documents"
                        label="Documents"
                        value={this.getSelectedOption('documents')}
                        options={[
                            {
                                id: 'caConsent',
                                title: 'Consent'
                            },
                            {
                                id: 'caDownloads',
                                title: 'Downloads'
                            },
                            {
                                id: 'caExports',
                                title: 'Exports'
                            }
                        ]}
                        onChange={this.handleInputChange}/>

                    <Checkbox
                        name="oClubAdmin-termsGroups"
                        label="Terms & Groups"
                        value={this.getSelectedOption('termsGroups')}
                        options={[
                            {
                                id: 'caAssignKit',
                                title: 'Assign Kits'
                            },
                            {
                                id: 'caRegisters',
                                title: 'Registers'
                            },
                            {
                                id: 'caReEnrollment',
                                title: 'Re-Enrollment'
                            },
                            {
                                id: 'caEvents',
                                title: 'Events'
                            },
                            {
                                id: 'caFixtures',
                                title: 'Fixtures'
                            },
                            {
                                id: 'caFootballTeams',
                                title: 'Football Teams'
                            },
                            {
                                id: 'caProgrammes',
                                title: 'Programmes'
                            }
                        ]}
                        onChange={this.handleInputChange}/>

                    <Checkbox
                        name="oClubAdmin-settings"
                        label="Settings & Set-up"
                        value={this.getSelectedOption('settings')}
                        options={[
                            {
                                id: 'caPackage',
                                title: 'Package'
                            },
                            {
                                id: 'caDetails',
                                title: 'Details'
                            },
                            {
                                id: 'caChangePassword',
                                title: 'Change Password'
                            }
                        ]}
                        onChange={this.handleInputChange}/>
                </div>
            </div>
        )
    }

    onContentStateChange = (editorState) => {
        this.setState({
            editorState
        })
    };

    render() {
        const {faq, type, editorState} = this.state

        const typeOptions = [
            {id: 'superadmin', title: 'Super Admin'},
            {id: 'clubadmin', title: 'Club Admin'},
            {id: 'coach', title: 'Coaches'},
            {id: 'parents', title: 'Parents'},
        ];

        return (
            <div id="content" className="site-content-inner faq">
                <PageTitle value="Edit Info & Support"/>
                <Form loader onSubmit={this.handleSubmit} className="form-section" ref={ref => this.refForm = ref}>
                    <TextInput
                        className="tooltips"
                        label="Question"
                        placeholder="Question"
                        name="question"
                        onChange={this.handleInputChange}
                        validation="required"
                        value={faq.question}
                        wide
                    />

                    {faq.answer && <Editor
                        editorState={editorState}
                        onEditorStateChange={this.onContentStateChange}
                        toolbar={{image: {uploadCallback: this.uploadCallback}}}
                        wrapperClassName="editor-wrapper-class"
                        editorClassName="editor-class"
                        toolbarClassName="editor-toolbar-class"
                    />}

                    <div className="faq-checkbox mt-12">
                        <Radio
                            label="Display for"
                            name="type"
                            onChange={this.handleInputChange}
                            options={typeOptions}
                            styled
                            validation="required"
                            value={faq.type}
                        />
                    </div>

                    <FormSection className="faq-section">
                        <div className="faq-assign">
                            {type === 'superadmin' ? this.renderSuperAdmin() : null}

                            {type === 'clubadmin' ? this.renderClubAdmin() : null}

                            {type === 'coach' ? this.renderCoach() : null}

                            {type === 'parents' ? this.renderGuardian() : null}
                        </div>
                    </FormSection>

                    <div className="form-actions">
                        <Back className="button">Back</Back>
                        <FormButton label="Save"/>
                    </div>
                </Form>
            </div>
        );
    }

}
