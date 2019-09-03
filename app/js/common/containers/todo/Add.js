import React from "react";
import {
  Checkbox,
  Form,
  DatePicker,
  Radio,
  Select,
  TextInput,
  Dialog,
  TimePicker
} from "@xanda/react-components";
import { api, fn } from "app/utils";
import { url } from "app/constants";
import {
  Back,
  ConfirmDialog,
  FormButton,
  FormInputRecurring,
  PageTitle
} from "app/components";
import moment from "moment";
import { connect } from "react-redux";
import { Add as Contact } from "app/containers/contact";

@connect(state => {
  return {};
})
export default class Add extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      todoError: false,
      errorMessage: "",
      assigneeList: [],

      roleList: [
        { id: "admin", title: "All Admins" },
        { id: "coach", title: "All Coaches" },
        { id: "guardian", title: "All Parents" }
      ],

      sendEmailOptions: [{ id: 1, title: "Yes" }, { id: 0, title: "No" }],

      options: [
        { id: "allDay", title: "All day" },
        { id: "once", title: "Once" },
        { id: "day", title: "Daily" },
        { id: "week", title: "Weekly" },
        { id: "biweek", title: "Bi weekly" },
        { id: "month", title: "Monthly" },
        { id: "year", title: "Yearly" }
      ],

      showDialog: false,
      addVenueDialog: false,
      venueList: []
    };
  }

  componentWillMount = async () => {
    const assigneeList = await api.get("/dropdown/users?roles=admin,coach");
    this.setState({ assigneeList: assigneeList.data });
    this.fetchVenue();
  };

  closeBox = () => {
    this.setState({
      dateError: false,
      dateErrorMessage: "",
      showDialog: false,
      todoError: false
    });
    this.refForm && this.refForm.hideLoader();
  };

  handleEmailChange = (name, value) => {
    this.handleInputChange(name, value);
  };

  handleInputChange = (name, value) => {
    this.setState({ [name]: value });
  };

  handleSubmit = async submit => {
    const { date, startTime, endTime } = this.state;

    // First validate form then send request into server
    this.refForm.validate();
    if (!this.refForm.validate()) {
      return;
    }

    // Check confirm submit
    if (!submit) {
      this.setState({ showDialog: true });
      return;
    }

    const todos = [];
    const recurring = this.state.recurring || {};
    let nextDate = moment(date).format("YYYY-MM-DD HH:mm:SS");

    for (let i = 0; i < recurring.length; i++) {
      const todoGroup = this.generateTodo(nextDate);
      todos.push(...todoGroup);
      nextDate = moment(nextDate)
        .add(recurring.offset, recurring.occurrence)
        .format("YYYY-MM-DD HH:mm:SS");
    }

    let formData = new FormData();
    _.map(todos, (value, index) => {
      if (_.isObject(value)) {
        _.map(value, (k, j) => {
          formData.append(`todos[${index}][${j}]`, k);

          // Add start & end time
          if (j === "date") {
            const clearTime = moment(`${k}`).format("YYYY-MM-DD");
            const formatStartDate = moment(
              `${clearTime} ${startTime}`,
              "YYYY-MM-DD HH:mm:SS"
            ).format("YYYY-MM-DD HH:mm:SS");
            const formatEndDate = moment(
              `${clearTime} ${endTime}`,
              "YYYY-MM-DD HH:mm:SS"
            ).format("YYYY-MM-DD HH:mm:SS");

            startTime &&
              formData.append(`todos[${index}][start_time]`, formatStartDate);
            endTime &&
              formData.append(`todos[${index}][end_time]`, formatEndDate);
          }
        });
      }
    });
    const response = await api.post("/todos", formData);

    if (!api.error(response, false)) {
      this.refDialog.close();
      fn.navigate(url.todo);
    } else {
      const errorHtml = api.getErrorsHtml(response.data);
      this.setState({
        todoError: true,
        errorMessage: errorHtml
      });
      return;
    }

    this.refDialog.close();
    this.refForm && this.refForm.hideLoader();
  };

  generateTodo = date =>
    this.state.assignees.map(assignee => {
      const { venue, notes, sendEmail, subject, showTo } = this.state;

      // TODO: Look into, seemed to allocate okay but shows duplicate for each person as if all were assigned
      let todo = {
        date,
        assignee,
        content: notes,
        send_email: sendEmail,
        title: subject,
        user_roles: showTo.join()
      };

      // Check venue is set
      if (venue) {
        todo = {
          ...todo,
          venue_id: venue
        };
      }
      return todo;
    });

  renderDialogContent = () => {
    const error = this.state.todoError ? this.state.errorMessage : "";
    return <div>{error}</div>;
  };

  fetchVenue = async () => {
    const venueList = await api.get("/dropdown/venues");
    this.setState({
      venueList: venueList.data
    });
  };

  renderAddVenue = () => {
    return (
      <div>
        <Contact
          subComponent={true}
          cancelVenue={this.handleCloseVenueDialog}
          onAddVenue={venue => this.handleAddNewVenue(venue)}
        />
      </div>
    );
  };

  handleCloseVenueDialog = () => {
    this.setState({
      addVenueDialog: false
    });
  };

  handleAddNewVenue = newVenue => {
    this.fetchVenue();

    this.setState({
      addVenueDialog: false
    });
  };

  handleValidationError = () => {
    const element = document.getElementById("site-content");
    element.scrollTop = 0;
    // const fields = this.refForm.fields;
    // _.forEach(fields, (field, index) => {
    //   const validate = field.validate();
    //   if (!validate.valid) {
    //     const element = document.getElementsByName(field.props.id);
    //     element[0].focus();
    //     return false;
    //   }
    // });
  };

  render() {
    const {
      assigneeList,
      roleList,
      sendEmail,
      options,
      addVenueDialog,
      venueList
    } = this.state;

    const emailConfirm = ~~sendEmail
      ? "This to-do will send E-mails, save anyway?"
      : "This to-do will NOT send E-mails, save anyway?";
    return (
      <div id="content" className="site-content-inner">
        <PageTitle value="Create a task" />
        <Form
          loader
          onValidationError={fn.scrollToTop}
          className="form-section"
          onSubmit={() => this.handleSubmit(false)}
          ref={ref => (this.refForm = ref)}
        >
          <TextInput
            className="tooltips"
            placeholder="Subject"
            label="Subject"
            name="subject"
            onChange={this.handleInputChange}
            validation="required"
            prepend={<i className="ion-ios-book-outline" />}
          />

          <Select
            className="tooltips transparent"
            placeholder="Venue"
            label="Venue"
            name="venue"
            onChange={this.handleInputChange}
            options={venueList}
            prepend={<i className="ion-location" />}
            append={
              <span
                className="button"
                onClick={() => this.setState({ addVenueDialog: true })}
              >
                Add venue
              </span>
            }
          />

          <Select
            className="tooltips"
            placeholder="Assignees"
            label="Assignees"
            name="assignees"
            multiple
            onChange={this.handleInputChange}
            options={assigneeList}
            validation="required"
            prepend={<i className="ion-person-add" />}
          />

          <DatePicker
            className="tooltips"
            placeholder="Date"
            futureOnly
            label="Date"
            name="date"
            onChange={this.handleInputChange}
            validation="required"
            prepend={<i className="ion-calendar" />}
          />

          <FormInputRecurring
            addClass="tooltips"
            placeholder="Recurring"
            label="Recurring"
            name="recurring"
            options={options}
            validation="required"
            onChange={this.handleInputChange}
          />

          <TimePicker
            className="tooltips task-time"
            placeholder="Start time"
            label="Start time"
            name="startTime"
            onChange={this.handleInputChange}
            validation="required"
            prepend={<i className="ion-clock" />}
          />

          <TimePicker
            className="tooltips task-time"
            placeholder="End time"
            label="End time"
            name="endTime"
            onChange={this.handleInputChange}
            validation="required"
            prepend={<i className="ion-clock" />}
          />

          <TextInput
            className="w-100"
            placeholder="e.g. meet caretaker in school office"
            label="Notes"
            name="notes"
            onChange={this.handleInputChange}
            textarea
          />

          <Radio
            className="w-100"
            label="Send email notification"
            name="sendEmail"
            onChange={this.handleInputChange}
            options={this.state.sendEmailOptions}
            styled
            value="0"
            wide
          />

          <Checkbox
            className="w-100-i"
            label="Show this task to"
            name="showTo"
            onChange={this.handleInputChange}
            options={roleList}
            styled
            validation="required"
            wide
          />

          <div className="form-actions">
            <Back showCloseButton={false} className="button" confirm>
              Cancel
            </Back>

            <button className="button">Save</button>

            {this.state.showDialog ? (
              <ConfirmDialog
                ref={ref => (this.refDialog = ref)}
                close={false}
                onClose={this.closeBox}
                showCloseButton={false}
                onConfirm={() => this.handleSubmit(true)}
                title=""
                body={
                  <div>
                    <h3>Confirm</h3>
                    <div>{emailConfirm}</div>
                    <div>{this.renderDialogContent()}</div>
                  </div>
                }
              />
            ) : (
              ""
            )}
          </div>
        </Form>

        {addVenueDialog && (
          <Dialog
            className="add-venue-dialog"
            showCloseButton={false}
            content={this.renderAddVenue()}
          />
        )}
      </div>
    );
  }
}
