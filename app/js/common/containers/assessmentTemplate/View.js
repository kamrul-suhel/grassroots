import React from 'react';
import {connect} from 'react-redux';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {ContentLoader, Radio, TextInput} from '@xanda/react-components';
import {Article, FormButton, Meta, MetaSection, PageTitle,Back} from 'app/components';

@connect((store, ownProps) => {
    return {
        collection: store.assessmentTemplate,
        assessment: store.assessmentTemplate.collection[ownProps.params.assessmentId] || {},
    };
})
export default class View extends React.PureComponent {

    assessmentId = this.props.params.assessmentId;

    componentWillMount() {
        this.props.dispatch(fetchData({
            type: 'ASSESSMENT_TEMPLATE',
            url: `/assessments/${this.assessmentId}/questions`,
        }));
    }

    render() {
        const {
            collection,
            assessment,
        } = this.props;

        return (
            <div id="content" className="site-content-inner assessment">
                <PageTitle value={assessment.title || 'Assessment'}/>
                <ContentLoader
                    data={assessment.assessment_id}
                    forceRefresh
                    isLoading={collection.isLoading}
                    notFound="No Data"
                >
                    <Article>
                        <MetaSection title="Questions">
                            <form className="form form-section">
                                {assessment.questions && assessment.questions.map((question) => {
                                    const InputTag = question.is_multiple_answers === 0 ? TextInput : Radio;
                                    const type = question.is_multiple_answers === 0 ? 'textarea' : null;
                                    return (
                                        <InputTag
                                            disabled
                                            key={`question${question.question_id}`}
                                            label={question.title}
                                            name={question.question_id}
                                            options={question.options}
                                            textarea
                                            type={type}
                                            wide
                                        />
                                    );
                                })}

                                <div className="form-actions">
                                    <Back className="button">Go back</Back>
                                </div>
                            </form>

                        </MetaSection>
                    </Article>
                </ContentLoader>
            </div>
        );
    }

}
