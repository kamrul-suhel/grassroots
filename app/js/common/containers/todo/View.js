import React from 'react'
import {connect} from 'react-redux'
import {ContentLoader} from '@xanda/react-components'
import {
    fn,
    api
} from 'app/utils'
import {url} from 'app/constants'
import {fetchData} from 'app/actions'
import {
    Article,
    ButtonStandard,
    Meta,
    PageTitle
} from 'app/components'

@connect((store, ownProps) => {
    return {
        collection: store.todo,
        todo: store.todo.collection[ownProps.params.todoId] || {},
    };
})
export default class View extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            assigneeList: [],
        }
    }

    async componentWillMount() {
        this.props.dispatch(fetchData({
            type: 'TODO',
            url: `/todos/${this.props.params.todoId}`,
        }));

        const assigneeList = await api.get('/dropdown/users?roles=admin,coach');
        this.setState({assigneeList: assigneeList.data});
    }

    render() {
        const {
            collection,
            todo,
        } = this.props

        const assignee = _.find(this.state.assigneeList, assignee => assignee.id === todo.assignee) || {}

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value={todo.title || 'Todo'}/>

                {fn.isAdmin() &&
                <div className="page-actions">
                    <ButtonStandard to={`${url.todo}/${todo.todo_id}/edit`} icon={<i className="ion-edit"/>}>Edit
                        task</ButtonStandard>
                </div>
                }

                <ContentLoader
                    data={todo.todo_id}
                    forceRefresh
                    isLoading={collection.isLoading}
                    notFound="No Data"
                >
                    <Article>
                        <Meta label="Title" value={todo.title}/>
                        <Meta label="Assignee" value={assignee.title || ' '}/>
                        <Meta label="Venue" value={todo.address_title || ' '}/>
                        <Meta label="Notes" value={todo.content}/>
                        <Meta label="Date" value={fn.formatDate(todo.date)}/>
                        <Meta label="Start Time" value={fn.formatDate(todo.start_time, 'LT')}/>
                        <Meta label="End Time" value={fn.formatDate(todo.end_time, 'LT')}/>
                        {fn.isAdmin() && <Meta label="Is public" value={todo.is_public ? 'Yes' : 'No'}/>}
                        {fn.isAdmin() && <Meta label="Send email" value={todo.send_email ? 'Yes' : 'No'}/>}
                    </Article>
                </ContentLoader>
            </div>
        )
    }

}
