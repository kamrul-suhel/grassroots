import React from 'react';
import {connect} from 'react-redux';
import {fn} from 'app/utils';
import {Checkbox, RichText, Select, Form} from '@xanda/react-components';
import {PageTitle, PageDescription} from 'app/components';

@connect((store) => {
    return {
        accounts: store.account,
        guardians: store.guardian.collection,
        coaches: store.coach.collection,
        teams: store.team.collection,
    };
})
export default class Compose extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            content: '',
            recipients: {},
            allGuardians: false,
            allCoaches: false,
            selectedTeam: null,
        };
    }

    componentDidMount() {
        fn.dispatchMany(
            {type: 'GUARDIAN', url: '/users?role=3'},
            {type: 'COACH', url: '/coaches'},
            {type: 'TEAM', url: '/teams'}
        );
    }

    handleInputChange = (name, value, b) => {
        switch (name) {
            case 'content':
                this.handleContentChange(value);
                break;
            case 'recipients':
                this.handleRecipientChange(value, b);
                break;
            case 'allGuardians':
                this.toggleGuardians(value);
                break;
            case 'allCoaches':
                this.toggleCoaches(value);
                break;
            case 'team':
                this.handleTeamChange(value);
                break;
            default:
                console.warn('Missed Input Change', name);
        }
    }

    handleRecipientChange = (arr) => {
        let {allCoaches, allGuardians, recipients} = this.state;
        let missingCoach = !arr.length;
        Object.keys(this.props.coaches).forEach((key) => {
            if (!arr.find(v => v === key)) missingCoach = true;
        });
        let missingGuardian = !arr.length;
        Object.keys(this.props.guardians).forEach((key) => {
            if (!arr.find(v => v === key)) missingGuardian = true;
        });
        recipients = arr.reduce((obj, id) => {
            return {...obj, [id]: true};
        }, {});
        allCoaches = !missingCoach;
        allGuardians = !missingGuardian;
        if (arr.length) this.setState({selectedTeam: null});
        this.setState({allCoaches, allGuardians, recipients});
    }

    handleTeamChange = (value) => {
        this.setState(() => {
            return {selectedTeam: value, allGuardians: false, allCoaches: false, recipients: {}};
        });
    }

    handleSubmit = () => {
        this.props.dispatch({
            type: 'OPEN_SNACKBAR_MESSAGE',
            option: {
                message: 'Email sent',
                color: 'dark'
            }
        });
        console.log('Email Submitted');
    }


    toggleCoaches = (value) => {
        let {allCoaches, recipients} = this.state;
        if (value) {
            // set True
            allCoaches = true;
            Object.keys(this.props.coaches).forEach((id) => {
                recipients[id] = true;
            });
            this.setState({selectedTeam: null});
        } else {
            // set False
            allCoaches = false;
            Object.keys(this.props.coaches).forEach(id => delete recipients[id]);
        }
        this.setState({allCoaches, recipients});
    }

    toggleGuardians = (value) => {
        let {allGuardians, recipients} = this.state;
        if (value) {
            // set True
            allGuardians = true;
            Object.keys(this.props.guardians).forEach((id) => {
                recipients[id] = true;
            });
            this.setState({selectedTeam: null});
        } else {
            // set False
            allGuardians = false;
            Object.keys(this.props.guardians).forEach(id => delete recipients[id]);
        }
        this.setState({allGuardians, recipients});
    }

    emails = () => {
        let {guardians, coaches} = this.props;
        guardians = Object.values(guardians).map((dude) => ({title: dude.display_name, id: dude.user_id}));
        coaches = Object.values(coaches).map((dude) => ({title: dude.display_name, id: dude.user_id}));
        const response = [...guardians, ...coaches];
        return response;
    }

    render() {
        const {content, recipients, allGuardians, allCoaches, selectedTeam} = this.state;
        const {teams, params} = this.props;

        return (
            <div id="content" className="site-content-inner email-content email-page">
                <PageTitle value="Compose Email"
                           faq={true}
                           faqLink={fn.getFaqLink(`caEmail`, `/${params.clubSlug}/`)}/>

                <PageDescription>Send emails to recepient groups</PageDescription>
                <span className="email-top">
					<span className="email-checkbox-wrapper">
						<Checkbox
                            name="allGuardians"
                            styled
                            value={allGuardians ? 1 : null}
                            options={[{id: 1, title: 'All Parents'}]}
                            onChange={this.handleInputChange}
                        />
						<Checkbox
                            name="allCoaches"
                            styled
                            value={allCoaches ? 1 : null}
                            options={[{id: 1, title: 'All Coaches'}]}
                            onChange={this.handleInputChange}
                        />
					</span>
					<span className="email-text-wrapper">Or</span>
					<Select
                        className="tooltips"
                        label="Select Team"
                        name="team"
                        placeholder="Select Team..."
                        value={selectedTeam}
                        clearable
                        multiple
                        onChange={this.handleInputChange}
                        // style={{ minWidth: '200px' }}
                        options={Object.values(teams).map((team) => ({id: team.team_id, title: team.title}))}
                    />
				</span>
                <Form onSubmit={this.handleSubmit} className="form-section">
                    <Select
                        multiple
                        name="recipients"
                        label="To"
                        value={Object.keys(recipients)}
                        options={this.emails()}
                        onChange={this.handleInputChange}
                        disabled={selectedTeam && selectedTeam.length}
                        placeholder={selectedTeam && selectedTeam.length ? 'Team Selected' : 'Select...'}
                    />
                    <div className="email-bottom">
                        <RichText wide label="Message" name="content" value={content} onChange={this.onContentChange}/>
                        <button type="submit" className="button form-submit hover-blue">Send</button>
                    </div>
                </Form>
            </div>);
    }
}