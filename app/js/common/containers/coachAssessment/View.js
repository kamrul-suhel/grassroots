import React from 'react';
import { connect } from 'react-redux';
import { ContentLoader } from '@xanda/react-components';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import {
	Article,
	FormButton,
	Meta,
	MetaSection,
	PageTitle,
	Back
} from 'app/components';

@connect((store, ownProps) => {
	return {
		collection: store.coachAssessment,
		assessment: store.coachAssessment.collection[ownProps.params.assessmentId] || {},
	};
})
export default class View extends React.PureComponent {

	constructor(props) {
		super(props);

		this.assessmentId = this.props.params.assessmentId;

		this.state = {
			answers: {},
		};
	}

	componentWillMount() {
		this.props.dispatch(fetchData({
			type: 'COACH_ASSESSMENT',
			url: `/assessments/${this.assessmentId}`,
		}));
	}

	handleInputChange = (name, value) => {
		this.setState((prevState) => {
			return {
				answers: {
					...prevState.answers,
					[name]: value,
				},
			};
		});
	}

	handleSubmit = async (event) => {
		event.preventDefault();
		const answers = [];

		// loop through answers and create a preferred structure for API
		_.map(this.state.answers, (value, key) => {
			answers.push({ question_id: key, answer: value });
		});

		const formData = {
			answers,
		};

		const response = await api.post(`/assessments/${this.assessmentId}/answer`, formData);

		if (!api.error(response)) {
			fn.navigate(url.coachAssessment);
		}
	}

	render() {
		const {
			assessment,
			collection,
		} = this.props;

		return (
			<div id="content" className="site-content-inner coach-assessment">
				<PageTitle value={assessment.title || 'Assessment'} />

				<ContentLoader
					data={assessment.id}
					forceRefresh
					isLoading={collection.isLoading}
					notFound="No Data"
				>
					<Article>
						<p><strong>Coach: </strong>{assessment.coach_name}</p>
						<p><strong>Date: </strong>{fn.formatDate(assessment.created_at)}</p>

						<MetaSection>
							{assessment.answers && assessment.answers.map(answer =>
								<Meta newLine
									  key={`answer_${answer.answer_id}`}
									  label={answer.question}
									  separator=""
									  value={answer.answer} />)}

							<div className="form-actions">
								<Back className="button">Go Back</Back>
							</div>
						</MetaSection>
					</Article>
				</ContentLoader>
			</div>
		);
	}

}
