import React from 'react';
import {connect} from 'react-redux';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {ContentLoader, Dialog, Table, TextInput, Tooltip} from '@xanda/react-components';
import {ButtonStandard, ConfirmDialog, Item, Link, Meta, PageDescription, PageTitle} from 'app/components';

@connect((store, ownProps) => {
    return {
        packages: store.pckg,
    };
})
export default class List extends React.PureComponent {

    state = {
        deleteErrorMsg: '',
        errorConfirm: false,
        deletePackageId: null,
        confirmDelete: ''
    }

    componentWillMount() {
        this.fetchData();
    }

    fetchData = () => {
        this.props.dispatch(fetchData({
            type: 'PACKAGE',
            url: '/packages',
        }));
    }

    openDeleteDialog = (pckgId) => {
        this.setState({
            deletePackageId: pckgId
        });
        this.refDialog.open();
    }

    onChangeDeleteHandler = (key, value) => {
        this.setState({
            confirmDelete: value
        })
    }

    deletePackage = () => {
        const deleteString = this.state.confirmDelete.toLowerCase();

        if (deleteString === 'delete') {
            this.setState({
                confirmDelete: true
            });
        }
    }

    deleteData = async () => {
        const deleteString = this.state.confirmDelete.toLowerCase();

        if (deleteString === 'delete') {
            const response = await api.delete(`/packages/${this.state.deletePackageId}`);

            if (!api.error(response, false)) {
                this.props.dispatch({
                    type: 'OPEN_SNACKBAR_MESSAGE',
                    option: {
                        message: 'Package has been deleted!',
                        color: 'white'
                    }
                })
                this.fetchData();
                this.refDialog.close();

            } else {
                const errorHtml = api.getErrorsHtml(response.data);
                this.setState({
                    deleteErrorMsg: errorHtml,
                    errorConfirm: true
                })
            }
        }
    }


    closeDialog = () => {
        this.setState({
            deleteErrorMsg: '',
            errorConfirm: false,
        })
    }

    render() {
        const {packages} = this.props;

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Packages"/>

                {fn.isSuperAdmin() &&
                <div className="page-actions">
                    <ButtonStandard to={`${url.package}/add`}
                                    icon={<i className="ion-edit"/>}>Create
                        package</ButtonStandard>
                </div>
                }

                <ContentLoader
                    data={packages.currentCollection}
                    isLoading={packages.isLoading}
                    notFound="No packages"
                >
                    <div className="grid">
                        {_.map(packages.currentCollection, (pckgId) => {
                            const pckg = packages.collection[pckgId];
                            const content = (
                                <div>
                                    <div className="player-wrapper">
                                        <span className="upto">up to</span>
                                        <span className="max_no">{pckg.max_slot}</span>
                                        <span className="players">players</span>
                                    </div>
                                    <div>
                                        <p className="package-description">{pckg.description}</p>
                                    </div>
                                    <div className="price">{fn.formatPrice(pckg.price)} per month</div>
                                    <span className="includes-vat">(price includes VAT)</span>
                                    <div className="form-actions ion-button">
                                        <Link to={`${url.package}/${pckg.id}/edit`}>
                                            <Tooltip icon={<span className="ion-ios-cog"/>} message='Edit Package'/>
                                        </Link>

                                        <Tooltip icon={<span className="ion-android-cancel text-danger"
                                                             onClick={() => this.openDeleteDialog(pckg.id)}/>}
                                                 message='Delete Package'/>
                                    </div>
                                </div>
                            );

                            return (
                                <Item
                                    background={pckg.pic}
                                    backgroundOverlay
                                    content={content}
                                    icon={<i className="ion-pricetag"/>}
                                    itemClass="item-licence"
                                    key={`package${pckg.id}`}
                                    title={pckg.title}
                                    wrapperClass="grid-4 grid-m-6 grid-s-6 grid-xs-12"
                                    itemWrapperClass={`bg-color`}
                                />
                            );
                        })}
                    </div>
                </ContentLoader>

                <Dialog
                    showCloseButton={false}
                    buttons={[
                        <button key="cancel"
                                className="button">Cancel
                        </button>,

                        <button key="submit"
                                className={
                                    `${this.state.errorConfirm ? "button hidden" : "button"} hover-blue`
                                }
                                onClick={() => this.state.confirmDelete ? this.deleteData() : this.deletePackage()}>Delete
                        </button>
                    ]}
                    ref={ref => this.refDialog = ref}
                    onClose={this.closeDialog}
                    content={
                        <div className="dialog-body-inner">
                            <div className={"dialog-left-sidebar"}>
                                <img src={'/images/ball-soccer.png'}/>
                            </div>
                            <div className={"dialog-right-side"}>
                                <h3>Delete this package?</h3>
                                <TextInput
                                    className="input-small"
                                    label="Type “DELETE” to confirm you are happy to cancel this package."
                                    onChange={this.onChangeDeleteHandler}/>
                                {this.state.errorConfirm ?
                                    <span className="text-danger">
									<p className='text-danger'>{this.state.deleteErrorMsg}</p>
								</span> : <p>Are you sure you want to delete this package?</p>}
                            </div>
                        </div>
                    }
                >
                    <span className="button hidden">Cancel</span>
                </Dialog>

            </div>
        );
    }

}
