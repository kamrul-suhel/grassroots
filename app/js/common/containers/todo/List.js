import React from 'react'
import {connect} from 'react-redux'
import {
    ContentLoader,
    Table
} from '@xanda/react-components'
import {api, fn} from 'app/utils'
import {url} from 'app/constants'
import {fetchData} from 'app/actions'
import {
    ButtonStandard,
    ConfirmDialog,
    Link,
    PageDescription,
    PageTitle
} from 'app/components'

@connect((store) => {
    return {
        todos: store.todo,
    };
})
export default class List extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            filters: '',
        };
    }

    componentWillMount() {
        this.fetchData();
    }

    fetchData = (currentPage = 1, newFilters) => {

        this.setState({
            currentPage,
            filters: newFilters || this.state.filters,
        });
        const filters = newFilters === undefined ? this.state.filters : newFilters
        this.props.dispatch(fetchData({
            type: 'TODO',
            url: `/todos?page=${currentPage}${filters}`,
            page: currentPage
        }));
    }

    completeTodo = async (id) => {
        const response = await api.update(`/todos/${id}/complete`)

        if (!api.error(response)) {
            this.fetchData()
        }
    }

    deleteData = async (id) => {
        const response = await api.delete(`/todos/${id}`)

        if (!api.error(response)) {
            this.fetchData()
        }
    }

    renderBody = () => {
        const {
            todos,
            params
        } = this.props

        let content = []
        _.map(todos.currentCollection, (id) => {
            const todo = todos.collection[id]
            content.push(
                <tr key={`todo_${todo.todo_id}`}>
                    {fn.isAdmin() && <td>{todo.assigned_to}</td>}
                    <td><Link to={`${url.todo}/${todo.todo_id}`}>{todo.title}</Link></td>
                    <td>{fn.formatDate(todo.date)}</td>
                    {fn.isAdmin() &&
                    <td>{todo.completed_at !== '0000-00-00 00:00:00' && fn.formatDate(todo.completed_at)}</td>}

                    {fn.isCoach() && <td>{todo.status}</td>}

                    {fn.isAdmin() &&
                    <td className="short table-options">

                        <Link to={`${url.todo}/${todo.todo_id}/edit`}
                              className="button icon">
                            <i title="Edit" className="ion-edit"/>
                        </Link>

                        <ConfirmDialog
                            showCloseButton={false}
                            onConfirm={() => this.deleteData(todo.todo_id)}
                            title=""
                            body={
                                <React.Fragment>
                                    <h3>Confirm!</h3>
                                    <p>Are you sure you want to delete?</p>
                                </React.Fragment>
                            }

                        >
                            <span className="button icon"><i title="Delete" className="ion-trash-b"/></span>
                        </ConfirmDialog>
                    </td>
                    }

                    <td className="short textcenter">
                        {todo.status === 'completed' ?
                            <span className="icon">
                                <i title="Complete" className="ion-checkmark"/></span> :
                            <span className="button icon" onClick={() => this.completeTodo(todo.todo_id)}><i
                                title="Incomplete" className="ion-android-expand"/></span>
                        }
                    </td>
                </tr>
            )
        })
        return content
    }

    getHeader = () => {
        const userRule = fn.getUserRole();
        switch(userRule) {
            case "admin":
                return [
                    'Assignee',
                    'Task',
                    'Date',
                    'Date Completed',
                    'Options',
                    'Done'
                ]

            case "coach":
                return [
                    'Assignee',
                    'Task',
                    'Date',
                    'Date Completed',
                    'Options',
                    'Done'
                ]
             case "superadmin":
                return [
                    'Assignee',
                    'Task',
                    'Date',
                    'Date Completed',
                    'Options',
                    'Done'
                ]
            case "groupadmin":
                    return [
                        'Assignee',
                        'Task',
                        'Date',
                        'Date Completed',
                        'Options',
                        'Done'
                    ]
            case "guardian" : 
                return [
                    '',
                    'Date',
                    'Status'
                ]
            default:
                return [
                    'Assignee',
                    'Task',
                    'Date',
                    'Date Completed',
                    'Options',
                    'Done'
                ]
        }
    }

    render() {
        const {todos, params} = this.props
        const {currentPage} = this.state

        const type = fn.getFaqType('TodoList')

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="To-do list"
                           faq={true}
                           faqLink={fn.getFaqLink(type, `/${params.clubSlug}/`)}/>

                <PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem
                    nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit
                    non mi porta gravida at eget metus.</PageDescription>

                {fn.isAdmin() &&
                <div className="page-actions">
                    <ButtonStandard to={`${url.todo}/add`}
                                    icon={<i className='ion-plus'/>}>Create new task
                    </ButtonStandard>
                </div>
                }

                <ContentLoader
                    filter={{
                        filters: todos.filters,
                        onUpdate: this.fetchData,
                    }}
                    pagination={{
                        currentPage,
                        onPageChange: this.fetchData,
                        total: todos.count,
                    }}
                    data={todos.currentCollection}
                    forceRefresh
                    isLoading={todos.isLoading}
                    notFound="No todo"
                >
                    <Table headers={this.getHeader()}
                           className={"header-transparent"}
                           icon="ion-android-list">
                        {this.renderBody()}
                    </Table>
                </ContentLoader>
            </div>
        )
    }
}
