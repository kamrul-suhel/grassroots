import React from 'react';
import {Form, Repeater, Select, TextInput, Dialog} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {
    Back,
    FormButton,
    PageTitle,
    FormSection,
    ConfirmDialog
} from 'app/components';
import {connect} from "react-redux";

@connect((store) => {
    return {
        clubAdmins: store.clubAdmin,
    };
})

export default class Add extends React.PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            formError: false,
            errorMessage: '',
            confirmDialog: false
        }
    }


    handleInputChange = (name, value) => {
        this.setState({[name]: value});
    }

    closeBox = () => {
        this.setState({
            formError: false,
            errorMessage: ''
        })
        this.refDialog.close()
    }

    handleSubmit = async (confirm = false) => {
        // On submit add confirm dialog
        if (!confirm) {
            this.setState({
                confirmDialog: true
            })
            return
        }

        const {title, questions} = this.state;
        const formData = new FormData();
        formData.append('title', title);
        _.map(questions, (question, index) => {
            formData.append(`questions[${index}][title]`, question.title)
            formData.append(`questions[${index}][is_multiple_answers]`, question.is_multiple_answers)

            if (question.is_multiple_answers === "1") {
                _.map(question.options, (option, optionIndex) => {
                    formData.append(`questions[${index}][options][${optionIndex}][answer]`, option.answer);
                })
            }
        });

        const response = await api.post('/assessments/templates', formData);

        if (!api.error(response, false)) {
            fn.navigate(url.assessmentTemplate);
        } else {
            const errorHtml = api.getErrorsHtml(response.data);
            this.setState({
                errorMessage: errorHtml,
                formError: true
            });
            this.refForm && this.refForm.hideLoader();
        }
    }

    closeDialog = () => {
        this.setState({
            confirmDialog: false
        })
        this.refForm && this.refForm.hideLoader();
    }

    renderRowAppend = (option) => {
        if (option.is_multiple_answers == 1) {
            return (
                <Repeater
                    count={2}
                    name="options"
                    className="answer-repeater"
                    removeButton={<i className="ion-close"/>}
                    addButton={<span className="button add-question">Add Answer</span>}
                >
                    <TextInput
                        label="Answer"
                        name="answer"
                        validation="required"
                    />
                </Repeater>
            );
        }

        return null;
    }

    render() {
        const type = [
            {title: 'Free Text', id: '0'},
            {title: 'Multiple choice', id: '1'},
        ];
        const {confirmDialog} = this.state

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Create new assessment form"/>

                <FormSection>
                    <Form loader
                          wide
                          onSubmit={this.handleSubmit}
                          className="form-section"
                          ref={ref => this.refForm = ref}>
                        <TextInput
                            className="tooltips"
                            placeholder="Title"
                            label="Title"
                            name="title"
                            onChange={this.handleInputChange}
                            validation="required"
                            prepend={<i className="ion-clipboard"/>}
                            wide
                        />

                        <Repeater
                            onChange={this.handleInputChange}
                            name="questions"
                            onRowAppend={this.renderRowAppend}
                            className="answer-repeater-wrap"
                            removeButton={<i className="ion-close"/>}
                            addButton={<span className="button">Add new question</span>}
                        >
                            <TextInput
                                className="tooltips"
                                placeholder="Question"
                                label="Question"
                                name="title"
                                validation="required"
                                prepend={<i className="ion-help"/>}
                            />
                            <Select
                                className="tooltips"
                                placeholder="Answer Type"
                                label="Answer Type"
                                name="is_multiple_answers"
                                validation="required"
                                options={type}
                                prepend={<i className="ion-ios-book-outline"/>}
                            />
                        </Repeater>

                        {this.state.formError ? <p>{this.state.errorMessage}</p> : ''}

                        <div className="form-actions">
                            <Back className="button"
                                  showCloseButton={false}
                                  confirm>Cancel</Back>
                            <FormButton label="Save"/>

                            {confirmDialog && <ConfirmDialog
                                title={"Are you sure you wish to save this Assessment Form?"}
                                body={<p>You will not be able to edit it once created.</p>}
                                onlyContent
                                onClose={this.closeDialog}
                                onConfirm={() => this.handleSubmit(true)}>
                            </ConfirmDialog>
                            }
                        </div>
                    </Form>
                </FormSection>
            </div>
        );
    }

}
