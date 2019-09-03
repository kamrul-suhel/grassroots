import React from "react";
import { connect } from "react-redux";
import { ContentLoader, Form, TextInput } from "@xanda/react-components";
import { api, fn, io } from "app/utils";
import { url } from "app/constants";
import { fetchData } from "app/actions";
import { FormButton, Link, PageTitle, ConfirmDialog } from "app/components";
import moment from "moment";
import { EditMessage } from "./index";

@connect((store, ownProps) => {
  return {
    topics: store.topic,
    topic: store.topic.collection[ownProps.params.topicId] || {}
  };
})
export default class List extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showAddTopic: false,
      editMessageDialog: false
    };

    this.socket = io;
    this.socket.on("send:message", this.onReceivedMessage);
  }

  componentWillMount = async () => {
    const { topic } = this.props;

    await this.fetchTopics(this.state.currentPage);
    if (topic.topic_id) {
      this.fetchMessages(topic.topic_id);
    }
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.topic.topic_id != nextProps.topic.topic_id) {
      this.fetchMessages(nextProps.topic.topic_id);
    }
  }

  /**
   * Get All topic
   * @param currentPage
   * @returns {Promise<void>}
   */
  fetchTopics = async currentPage => {
    this.props.dispatch({
      type: "RESET_TOPIC"
    });
    await this.props.dispatch(
      fetchData({
        type: "TOPIC",
        url: `/topics?page=${currentPage}`,
        page: currentPage,
        replace: true
      })
    );
  };

  /**
   * Get all message by topic_id
   * @param topicId
   */
  fetchMessages = topicId => {
    if (topicId) {
      this.props.dispatch(
        fetchData({
          type: "TOPIC",
          url: `/topics/${topicId}/messages`
        })
      );
    }
  };

  /**
   * Delete Message
   * @param message
   * @returns {Promise<void>}
   */
  handleDeleteMessage = async message => {
    const topicId = message.topic_id;
    const deleteUrl = `${url.message}/${message.message_id}`;
    const response = await api.delete(deleteUrl);

    if (!api.error(response)) {
      this.fetchMessages(topicId);
    }
  };

  handleDeleteTopic = async topic => {
    const { currentPage } = this.state;
    const page = currentPage || 1;
    const topicId = topic.topic_id;
    const deleteUrl = `${url.topic}/${topicId}`;

    const response = await api.delete(deleteUrl);
    if (!api.error(response)) {
      this.fetchTopics(page);
    }
  };

  handleEditMessage = message => {
    this.setState({
      editMessageDialog: true,
      selectedMessage: { ...message }
    });
  };

  closeMessageDialog = status => {
    // If update then fetch message
    if (status === "update") {
      const { selectedMessage } = this.state;
      this.fetchMessages(selectedMessage.topic_id);
    }

    this.setState({
      editMessageDialog: false,
      selectedMessage: {}
    });
  };

  onReceivedMessage = data => {
    this.props.dispatch({ type: "TOPIC_MESSAGE_RECEIVE", payload: data });
  };

  handleInputChange = (name, value) => {
    this.setState({ [name]: value });
  };

  handleTopicScroll = event => {
    const { topics } = this.props;
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;

    // return if fetched all the items
    if (topics.count === topics.pagination.length) {
      return false;
    }

    // return if the current scroll position is not within the buffer
    if (clientHeight + scrollTop < scrollHeight - 60) {
      return false;
    }

    this.setState(
      () => {
        return {
          currentPage: this.state.currentPage + 1
        };
      },
      () => {
        this.fetchTopics(this.state.currentPage);
      }
    );
  };

  renderTopics = () => {
    const { topics, me } = this.props;
    const userRole = me.data.user_role || null;

    return (
      <ContentLoader
        data={topics.currentCollection}
        isLoading={topics.isLoading}
      >
        <div className="side-navigation scroll-wrapper">
          <ul className="scroll-list" onScroll={this.handleTopicScroll}>
            {topics.currentCollection.map(id => {
              const topic = topics.collection[id];
              const activeClass =
                this.props.topic.topic_id == topic.topic_id ? "is-active" : "";
              return (
                <li key={`topic_${topic.topic_id}`} className={activeClass}>
                  <Link to={`${url.messageBoard}/topics/${topic.topic_id}`}>
                    {topic.title}
                  </Link>

                  {userRole === "admin" ? (
                    <ConfirmDialog
                      onlyContent={true}
                      body={<p>You want to delete this topic.</p>}
                      onConfirm={() => this.handleDeleteTopic(topic)}
                    >
                      <span className="button no-border text-primary">
                        <i className="icon ion-trash-a" />
                      </span>
                    </ConfirmDialog>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </ContentLoader>
    );
  };

  renderMessages = () => {
    const { me, topic, topics } = this.props;
    const userRole = me.data.user_role || null;

    return (
      <div className="scroll-wrapper">
        <ContentLoader
          data={topic.topic_id}
          isLoading={topics.isLoading}
          notFound="No Data"
          forceRefresh
        >
          <ul className="scroll-list message-list">
            {topic.topic_id && (
              <li className="item-message intro">
                <div className="item-header">
                  {topic.author_name && (
                    <span className="item-meta">
                      <i className="ion-person" /> {topic.author_name}
                    </span>
                  )}
                  {topic.created_at && (
                    <span className="item-meta">
                      <i className="ion-android-time" />{" "}
                      {moment(topic.created_at).fromNow()}
                    </span>
                  )}

                  <span className="item-title">{topic.title}</span>
                </div>
                <span className="item-content">{topic.content}</span>
              </li>
            )}

            {topic.messages &&
              topic.messages.map(message => {
                const meClass =
                  message.author_id == me.data.user_id ? "me" : "";
                return (
                  <li
                    key={`message_${message.message_id}`}
                    className={`item-message ${meClass}`}
                  >
                    <div className="item-header message-header">
                      <div className="header-title">
                        {message.author_name && (
                          <span className="item-meta">
                            <i className="ion-person" /> {message.author_name}
                          </span>
                        )}

                        {message.created_at && (
                          <span className="item-meta">
                            <i className="ion-android-time" />{" "}
                            {moment(message.created_at).fromNow()}
                          </span>
                        )}
                      </div>

                      {userRole === "admin" ? (
                        <div className="header-option">
                          <span
                            className="item-meta button no-border text-primary"
                            onClick={() => this.handleDeleteMessage(message)}
                          >
                            <i className="icon ion-trash-a" />
                          </span>
                          <span
                            className="item-meta button no-border"
                            onClick={() => this.handleEditMessage(message)}
                          >
                            <i className="icon ion-edit" />
                          </span>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <span className="item-content">{message.content}</span>
                  </li>
                );
              })}
          </ul>
        </ContentLoader>
      </div>
    );
  };

  addTopic = async () => {
    const formData = new FormData();
    formData.append("title", this.state.topic_title);
    formData.append("content", this.state.topic_content);

    this.setState({ showAddTopic: false });
    this.refTopicTitle.clear();
    this.refTopicContent.clear();

    const response = await api.post("/topics", formData);

    if (!api.error(response)) {
      this.fetchTopics();
      fn.navigate(`${url.messageBoard}/topics/${response.data.topic_id}`);
    }
  };

  addMessage = async () => {
    const { me, topic } = this.props;

    if (!this.state.message) {
      return false;
    }

    const formData = new FormData();
    formData.append("topic_id", topic.topic_id);
    formData.append("content", this.state.message);

    this.refMessage.clear();

    const response = await api.post("/messages", formData);

    if (!api.error(response)) {
      const payload = {
        author_id: response.data.created_by,
        author_name: this.props.me.data.display_name,
        content: response.data.content,
        created_at: response.data.created_at,
        created_by: response.data.created_by,
        message_id: response.data.message_id,
        reply_to: response.data.reply_to,
        topic_id: response.data.topic_id
      };

      this.socket.emit("send:message", payload);
      this.props.dispatch({ type: "TOPIC_MESSAGE_RECEIVE", payload });
      this.fetchMessages(response.data.topic_id);
    }
  };

  render() {
    const { topic, params, me } = this.props;
    const { editMessageDialog, selectedMessage } = this.state;
    const userRole = me.user_role || null;

    const addTopicClass = this.state.showAddTopic ? "is-active" : "";
    const type = fn.getFaqType("MessageBoard");

    return (
      <div id="content" className="site-content-inner one-page">
        <PageTitle
          value="Message board"
          faq={true}
          faqLink={fn.getFaqLink(type, `/${params.clubSlug}/`)}
        />
        <div className="message-board">
          <div className="message-board-column topic-wrapper">
            <h2 className="header">Topic</h2>

            {this.renderTopics()}

            <div className={`add-topic-wrapper ${addTopicClass}`}>
              <span
                className="add-topic"
                onClick={() =>
                  this.setState({ showAddTopic: !this.state.showAddTopic })
                }
              >
                Add topic
              </span>

              <Form className="no-wrapper" onSubmit={this.addTopic}>
                <TextInput
                  label="Title"
                  name="topic_title"
                  onChange={this.handleInputChange}
                  ref={ref => (this.refTopicTitle = ref)}
                  validation="required"
                  value={this.state.topic_title}
                  wide
                />
                <TextInput
                  label="Description"
                  name="topic_content"
                  onChange={this.handleInputChange}
                  ref={ref => (this.refTopicContent = ref)}
                  textarea
                  validation="required"
                  value={this.state.topic_content}
                  wide
                />
                <FormButton label="Add topic" />
              </Form>
            </div>
          </div>
          <div className="message-board-column message-wrapper">
            <h2 className="header">Message</h2>

            {this.renderMessages()}

            {topic.topic_id && (
              <Form
                key={`message${topic.topic_id}`}
                className="no-wrapper form-message"
                onSubmit={this.addMessage}
              >
                <TextInput
                  autoComplete="off"
                  autoFocus
                  name="message"
                  onChange={this.handleInputChange}
                  placeholder="Type your message here..."
                  ref={ref => (this.refMessage = ref)}
                  textarea
                  wide
                />
                <FormButton label="Send" />
              </Form>
            )}
          </div>
        </div>

        {/** Edit message section **/}
        {editMessageDialog && (
          <EditMessage
            message={selectedMessage}
            closeMessageDialog={status => this.closeMessageDialog(status)}
          />
        )}
      </div>
    );
  }
}
