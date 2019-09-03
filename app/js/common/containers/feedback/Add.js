import React from "react";
import {
  Checkbox,
  Form,
  Repeater,
  Select,
  TextInput
} from "@xanda/react-components";
import { api, fn } from "app/utils";
import { url } from "app/constants";
import { Back, FormButton, PageTitle } from "app/components";
import { connect } from "react-redux";

@connect((store, ownProps) => {
  return {};
})
export default class Add extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      roleList: [
        { id: "coach", title: "All Coaches" },
        { id: "guardian", title: "All Parents" }
      ],
      formError: false,
      errorMessage: ""
    };
  }

  handleInputChange = (name, value) => {
    this.setState({ [name]: value });
  };

  handleSubmit = async () => {
    const formData = new FormData();

    this.state.title && formData.append("title", this.state.title);
    formData.append("type", "feedback");
    this.refForm && this.refForm.hideLoader();
    _.map(this.state.questions, (question, index) => {
      formData.append(`questions[${index}][title]`, question.title);
      formData.append(
        `questions[${index}][is_multiple_answers]`,
        question.is_multiple_answers
      );

      if (question.is_multiple_answers === "1") {
        _.map(question.options, (option, optionIndex) => {
          formData.append(
            `questions[${index}][options][${optionIndex}][title]`,
            option.answer
          );
        });
      }
    });
    _.map(this.state.sendTo, (value, index) => {
      formData.append(`user_roles[${index}]`, value);
    });

    const response = await api.post("/feedbacks", formData);
    if (!api.error(response, false)) {
      fn.navigate(url.feedback);
    } else {
      const errorHtml = api.getErrorsHtml(response.data);
      this.setState({
        errorMessage: errorHtml,
        formError: true
      });
      this.refForm && this.refForm.hideLoader();
      this.refDialog.open();
    }
  };

  renderRowAppend = option => {
    if (option.is_multiple_answers == 1) {
      return (
        <Repeater
          count={2}
          name="options"
          className="answer-repeater"
          removeButton={<i className="ion-close" />}
          addButton={<span className="button add-question">Add Answer</span>}
        >
          <TextInput label="Answer" name="answer" />
        </Repeater>
      );
    }

    return null;
  };

  render() {
    const { roleList } = this.state;
    const type = [
      { title: "Free Text", id: "0" },
      { title: "Multiple choice", id: "1" }
    ];

    return (
      <div id="content" className="site-content-inner">
        <PageTitle value="Create feedback form" />
        <Form
          onValidationError={fn.scrollToTop}
          loader
          wide
          onSubmit={this.handleSubmit}
          className="form-section"
          ref={ref => (this.refForm = ref)}
        >
          <TextInput
            className="tooltips"
            placeholder="Title"
            label="Title"
            name="title"
            onChange={this.handleInputChange}
            validation="required"
            prepend={<i className="ion-ios-book-outline" />}
          />

          <Repeater
            onChange={this.handleInputChange}
            name="questions"
            onRowAppend={this.renderRowAppend}
            className="answer-repeater-wrap"
            removeButton={<i className="ion-close" />}
            addButton={<span className="button">Add Question</span>}
          >
            <TextInput
              className="tooltips"
              placeholder="Question"
              label="Question"
              name="title"
              validation="required"
              prepend={<i className="ion-help" />}
            />
            <Select
              className="tooltips"
              placeholder="Answer type"
              label="Answer Type"
              name="is_multiple_answers"
              validation="required"
              options={type}
              prepend={<i className="ion-ios-book-outline" />}
            />
          </Repeater>
          {this.state.formError ? <p>{this.state.errorMessage}</p> : ""}
          <Checkbox
            label="Send to"
            multiple
            name="sendTo"
            onChange={this.handleInputChange}
            options={roleList}
            styled
            validation="required"
          />

          <div className="form-actions">
            <Back className="button" confirm>
              Cancel
            </Back>
            <FormButton label="Save" />
          </div>
        </Form>
      </div>
    );
  }
}
