import React from 'react';
import { connect } from 'react-redux';
import {Form, MultiSelect, Select, TextInput} from '@xanda/react-components';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { api, fn } from 'app/utils';
import Store from 'app/store';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Back, ConfirmDialog, FormButton, Link, PageTitle, FormSection, PageDescription } from 'app/components';

@connect((store) => {
	return {
		skills: store.skill,
	};
})
export default class SocialLink extends React.PureComponent {

	constructor(props) {
		super(props);

		this.clubId = this.props.params.clubId;
		this.state = {
		};
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
		console.log(name, value);
	}

	handleSubmit = async () => {
		const formData = new FormData();
		formData.append('twitter', this.state.twitter);
		formData.append('facebook', this.state.facebook);
		formData.append('instagram', this.state.instagram);
		formData.append('youtube', this.state.youtube);

		const response = await api.update(`/clubs/${this.props.club.club_id}`, formData);

        if (!api.error(response)) {
			this.props.dispatch({
				type:'OPEN_SNACKBAR_MESSAGE',
				option: {
					message:'Social media page has been saved successfully',
					color:'dark'
				}
			})
            this.props.fetchData();
            fn.navigate(`${url.club}/${this.props.club.club_id}`);
        } else {
            this.refForm && this.refForm.hideLoader();
        }
        this.refForm && this.refForm.hideLoader();
	}

	render() {
		const facebookURL = this.props.club.facebook_url;
		const twitterURL = this.props.club.twitter_url;
		const instagramURL = this.props.club.instagram_url;
		const youtubeURL = this.props.club.youtube_url;

		return (
			<div id="content" className="site-content-inner club-social-page">
				<PageTitle value="Social media" />
				<PageDescription>Please paste the URLs to your social media pages here. These links will be shown to your parents.</PageDescription>

				<div className="form-wrapper">
					<div className="form-outer">
                        <Form loader wide onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
                            <FormSection className="single-column">
                                <TextInput
                                    prepend={<i className="ion-social-facebook"/>}
									className="tooltips"
									placeholder="Facbook URL"
                                    name="facebook"
                                    label="Facebook URL"
									value={facebookURL}
                                    onChange={this.handleInputChange}
                                     />

								<TextInput
									prepend={<i className="ion-social-instagram"/>}
									className="tooltips"
									placeholder="Instagram URL"
									name="instagram"
									label="Instagram URL"
									value={instagramURL}
									onChange={this.handleInputChange}
								/>

								<TextInput
									prepend={<i className="ion-social-twitter-outline"/>}
									className="tooltips"
									placeholder="Twitter URL"
									name="twitter"
									label="Twitter URL"
									value={twitterURL}
									onChange={this.handleInputChange}
								/>

								<TextInput
									prepend={<i className="ion-social-youtube-outline"/>}
									className="tooltips"
									placeholder="Youtube URL"
									name="youtube"
									label="Youtube URL"
									value={youtubeURL}
									onChange={this.handleInputChange}
								/>
							</FormSection>

                            <div className="form-actions age-group-buttons">
                                <Link to={`${url.club}/${this.clubId}`} className="button" onClick={fetchData}>Back</Link>
                                <FormButton label="Save"/>
                            </div>
                        </Form>
					</div>
				</div>

			</div>
		);
	}
}
