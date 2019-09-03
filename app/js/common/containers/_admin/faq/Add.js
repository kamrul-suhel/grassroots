import React from 'react';
import { connect } from 'react-redux'
import {Checkbox, FileUpload, Form, TextInput, Radio} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import {Back, FormButton, PageTitle, FormSection} from 'app/components';

@connect((store) => {
    return {
        store
    }
})

export default class Add extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            optionClubAdmin: [],
            uploadedImages:[],
            editorState: EditorState.createEmpty(),
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

        console.log("State is : ", this.state);
        const {
            question,
            answer,
            file,
            type,
            superAdmin,
            optionClubAdmin,
            coachOptions,
            parents
        } = this.state

        const htmlObj = convertToRaw(this.state.editorState.getCurrentContent())
        const html = draftToHtml(htmlObj);

        const formData = new FormData()
        formData.append('question', question)
        formData.append('answer', html)
        formData.append('file', file)

        formData.append('type', type)

        switch(type){
            case 'superadmin':
                formData.append('faq_section', _.join(superAdmin,','))
                break

            case 'clubadmin':
                let clubAdmin = [];
                _.forOwn(optionClubAdmin, (value, key)=>{
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
        const response = await api.post('/faq', formData);
        if (!api.error(response)) {
            fn.navigate(url.manageFaq);
            this.props.dispatch({
                type: 'OPEN_SNACKBAR_MESSAGE',
                option: {
                    message: 'FAQ has been successfully created',
                    color: 'white'
                }
            })
        } else {
            this.refForm && this.refForm.hideLoader();
        }
    }

    renderCoach() {
        return (
            <div className="faq-item">
                <h2>Coaches</h2>
                <div className="faq-item-body">
                    <Checkbox
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
                        options={[
                            {
                                id: 'caPlayers',
                                title: 'Players'
                            },
                            {
                                id: 'caParentsGuardiansHidden',
                                title: 'Players Hidden'
                            }
                        ]}
                        onChange={this.handleInputChange}/>

                    <Checkbox
                        name="oClubAdmin-documents"
                        label="Documents"
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

    uploadCallback = async (file) => {
        console.log("state is : ", this.state)
        console.log("File is : ", file)
        // long story short, every time we upload an image, we
        // need to save it to the state so we can get it's data
        // later when we decide what to do with it.

        // Make sure you have a uploadImages: [] as your default state
        let uploadedImages = this.state.uploadedImages;

        let formData = new FormData();
        formData.append('file', file);

        const response = await api.post('faq/fileupload', formData)

         if(!api.error(response)){
             const imageObject = {
                 file: file,
                 localSrc: URL.createObjectURL(file),
             }

             uploadedImages.push(imageObject);
             this.setState({uploadedImages: uploadedImages})

             // We need to return a promise with the image src
             // the img src we will use here will be what's needed
             // to preview it in the browser. This will be different than what
             // we will see in the index.md file we generate.
             return new Promise(
                 (resolve, reject) => {
                     resolve({ data: { link: response.data.file_path } });
                 }
             );
         }
    }

    onContentStateChange = (editorState) => {
        this.setState({
            editorState
        });
    };

    render() {
        const { type, editorState } = this.state;

        const typeOptions = [
            {id: 'superadmin', title: 'Super Admin'},
            {id: 'clubadmin', title: 'Club Admin'},
            {id: 'coach', title: 'Coaches'},
            {id: 'parents', title: 'Parents'},
        ];

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Update Info & Support"/>

                <Form loader onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
                    <div className="grid faq-page-form">

                        <div className="grid-xs-8">
                            <TextInput
                                className="tooltips"
                                label="Question"
                                placeholder="Question"
                                name="question"
                                onChange={this.handleInputChange}
                                validation="required"
                                wide
                            />

                            <Editor
                                editorState={editorState}
                                onEditorStateChange={this.onContentStateChange}
                                toolbar={{ image: { uploadCallback: this.uploadCallback }}}
                                wrapperClassName="editor-wrapper-class"
                                editorClassName="editor-class"
                                toolbarClassName="editor-toolbar-class"
                            />

                            <div className="faq-checkbox mt-12">
                                <Radio
                                    label="Display for"
                                    name="type"
                                    onChange={this.handleInputChange}
                                    options={typeOptions}
                                    styled
                                    validation="required"
                                />
                            </div>

                            <FormSection className="faq-section">
                                <div className="faq-assign">
                                    { type === 'superadmin' ? this.renderSuperAdmin() : null }

                                    { type === 'clubadmin' ? this.renderClubAdmin() : null }

                                    { type === 'coach' ? this.renderCoach() : null }

                                    { type === 'parents' ? this.renderGuardian() : null }
                                </div>
                            </FormSection>

                            <div className="form-actions">
                                <Back className="button">Back</Back>
                                <FormButton label="Save"/>
                            </div>
                        </div>

                    </div>

                </Form>
            </div>
        );
    }

}
