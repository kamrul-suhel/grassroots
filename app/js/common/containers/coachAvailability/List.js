import React from 'react';
import {connect} from 'react-redux';
import {ContentLoader, Table, Select} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {ButtonStandard, ConfirmDialog, Link, PageDescription, PageTitle} from 'app/components';

@connect((store) => {
    return {
        coaches: store.coach.collection || {},
        availabilities: store.availability,
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

    componentDidMount() {
        this.fetchCoachData();
        this.fetchData()
    }

    getFirstCoach = () => Object.values(this.props.coaches)[0] && Object.values(this.props.coaches)[0].user_id;

    fetchCoachData = () => (
        this.props.dispatch(fetchData({
            type: 'COACH',
            url: '/coaches',
        }))
    );

    handleInputChange = (name, value) => this.setState({[name]: value}, this.fetchData);

    fetchData = (currentPage = 1, newFilters) => {
        this.setState({
            currentPage,
            filters: newFilters || this.state.filters,
        });

        const filters = newFilters === undefined ? this.state.filters : newFilters;

        this.props.dispatch(fetchData({
            type: 'AVAILABILITY',
            url: `/availabilities?page=${currentPage}${filters}`,
            page: currentPage,
        }));
    }

    deleteData = async (id) => {
        const response = await api.delete(`/availabilities/${id}`);

        if (!api.error(response)) {
            this.fetchData();
        }
    }

    render() {
        const {availabilities, coaches, params} = this.props;
        const {currentPage} = this.state;

        const coachesOptions = Object.values(coaches) || [];

        const coachFilter = {
            default: null,
            key: 'coach_id',
            label: 'Coach',
            options: coachesOptions.map((coach) => {
                return {id: coach.user_id, title: coach.display_name};
            }),
        };

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Coach Availability"
                           faq={true}
                           faqLink={fn.getFaqLink(`caAvailability`, `/${params.clubSlug}/`)}/>

                <PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem
                    nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit
                    non mi porta gravida at eget metus.</PageDescription>

                <ContentLoader
                    filter={{
                        filters: [...availabilities.filters, coachFilter],
                        onUpdate: this.fetchData,
                    }}
                    pagination={{
                        currentPage,
                        onPageChange: this.fetchData,
                        total: availabilities.count,
                    }}
                    data={availabilities.currentCollection}
                    forceRefresh
                    isLoading={availabilities.isLoading}
                    notFound="No skill availabilities"
                >
                    <Table headers={['Coach', 'Reason', 'Duration of Absence', 'Option']}
                           icon="ion-android-calendar"
                           className="center-last header-transparent">
                        {_.map(availabilities.currentCollection, (id) => {
                            const availability = availabilities.collection[id];
                            return (
                                <tr key={`availability_${availability.availability_id}`}>
                                    <td>{availability.availability_id}</td>
                                    <td>{availability.type}</td>
                                    <td>{`${fn.formatDate(availability.start_date)} - ${fn.formatDate(availability.end_date)}`}</td>
                                    <td className="table-options">
                                        <Link to={`${url.coachAvailability}/${availability.availability_id}/edit`}
                                              className="button icon"><i title="Edit" className="ion-edit"/></Link>
                                        <ConfirmDialog
                                            showCloseButton={false}
                                            onConfirm={() => this.deleteData(availability.availability_id)}
                                            title="Are you sure you want to delete?"
                                        >
                                            <span className="button icon"><i title="Delete"
                                                                             className="ion-trash-b"/></span>
                                        </ConfirmDialog>
                                    </td>
                                </tr>
                            );
                        })}
                    </Table>
                </ContentLoader>
            </div>
        );
    }

}
