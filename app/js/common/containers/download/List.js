import React from 'react';
import {connect} from 'react-redux';
import {ContentLoader, Table} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {ButtonStandard, ConfirmDialog, ItemLandscape, Link, PageDescription, PageTitle} from 'app/components';

@connect((store) => {
    return {
        downloads: store.download,
    };
})
export default class List extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
        };
    }

    componentWillMount() {
        this.fetchData();
    }

    fetchData = (currentPage) => {

        this.setState({currentPage});
        this.props.dispatch(fetchData({
            type: 'DOWNLOAD',
            url: `/downloads/?page=${currentPage}&status=1`,
            page: currentPage,
        }));
    }

    deleteData = async (id) => {
        event.preventDefault();
        const response = await api.delete(`/downloads/${id}`);

        if (!api.error(response)) {
            fn.showAlert('File has been deleted!', 'success');
            this.fetchData();
        }
    }

    donwloadFile = (path) => {
        // const oReq = new XMLHttpRequest();
        // oReq.open("GET", url);
        // oReq.send();
        window.open(path);
    }

    renderTable = () => {
        const {downloads} = this.props;
        const {currentPage} = this.state;

        switch (fn.getUserRole()) {
            default:
                return (
                    <Table headers={['', 'Category', 'Actions']}
                           className={"header-transparent"}
                           icon="ion-android-download">
                        {_.map(downloads.currentCollection, (id) => {
                            const file = downloads.collection[id];

                            return (
                                <tr key={`file_${file.download_id}`}>
                                    <td>{file.title}<br/>
                                        <small>{file.content}</small>
                                    </td>
                                    <td>{file.category ? file.category : 'Unassigned'}</td>
                                    <td className="short">
                                        <span key="download" className="button icon" onClick={() => {
                                            this.donwloadFile(file.file_url);
                                        }}><i title="Download" className="ion-android-download"/></span>
                                        {fn.isAdmin() && <Link key="edit" className="button icon"
                                                               to={`${url.download}/${file.download_id}/edit`}><i
                                            title="Edit" className="ion-edit"/></Link>}
                                        {fn.isAdmin() && <ConfirmDialog
                                            key="delete"
                                            showCloseButton={false}
                                            onConfirm={() => this.deleteData(file.download_id)}
                                            title="Are you sure you want to delete?"
                                        >
                                            <span className="button icon"><i title="Delete"
                                                                             className="ion-trash-b"/></span>
                                        </ConfirmDialog>}
                                    </td>
                                </tr>
                            );
                        })}
                    </Table>
                );
        }
    }

    render() {
        const {downloads, params} = this.props;
        const {currentPage} = this.state;
        const type = fn.getFaqType('Download')

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Downloads"
                           faq={true}
                           faqLink={fn.getFaqLink(type, `/${params.clubSlug}/`)}/>

                <PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem
                    nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit
                    non mi porta gravida at eget metus.</PageDescription>

                {fn.isAdmin() &&
                <div className="page-actions">
                    <ButtonStandard to={`${url.download}/add`} icon={<i className="ion-plus"/>}>Upload
                        file</ButtonStandard>
                </div>
                }

                <ContentLoader
                    pagination={{
                        currentPage,
                        onPageChange: this.fetchData,
                        total: downloads.count,
                    }}
                    data={downloads.currentCollection}
                    forceRefresh
                    isLoading={downloads.isLoading}
                    notFound="No downloads"
                >
                    {this.renderTable()}
                </ContentLoader>
            </div>
        );
    }

}
