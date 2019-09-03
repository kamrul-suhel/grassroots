import React from 'react';
import {connect} from 'react-redux';
import {
    FileUpload,
    Form,
    Repeater,
    TextInput,
    Button,
    Checkbox,
    Dialog,
    Table,
    ContentLoader, Select
} from '@xanda/react-components';
import {
    Tab,
    Tabs,
    TabList,
    TabPanel
} from 'react-tabs';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {
    ConfirmDialog,
    FormButton,
    FormSection,
    Link,
    PageTitle,
    ButtonStandard,
    Block
} from 'app/components';

@connect((store, ownProps) => {
    return {
        kits: store.kit,
        me: store.me.data,
    };
})
export default class Kit extends React.PureComponent {

    constructor(props) {
        super(props);

        this.clubId = this.props.params.clubId || this.props.me.club_id;
        this.refDialog = {};

        this.state = {
            kitTypes: [],
            tabIndex: 0,
            kitError: false,
            errorMessage: ''
        };
    }

    componentWillMount = async () => {
        this.fetchData();

        const kitTypes = await api.get('/dropdown/kit-types');
        this.setState({
            kitTypes: kitTypes.data,
        });
    }

    onTabSelect = index => this.setState({tabIndex: index});

    fetchData = () => {

        if (fn.isGuardian()) {
            this.props.dispatch(fetchData({
                type: 'KIT',
                url: `/kits?parent=true`,
            }));
        }

        if (fn.isAdmin()) {
            this.props.dispatch(fetchData({
                type: 'KIT',
                url: `/clubs/${this.clubId}/kits`,
            }));
        }
    }

    handleInputChange = (name, value) => {
        this.setState({[name]: value});
    }

    handleSubmit = async (typeId, kitId = '') => {
        const formData = new FormData();
        formData.append('club_id', this.clubId);
        formData.append('type_id', typeId);
        this.state.title && formData.append('title', this.state.title);
        this.state.sku && formData.append('product_sku', this.state.sku);
        this.state.pic && formData.append('image_url', this.state.pic);
        this.state.sizes && this.state.sizes.map(size => size && formData.append('sizes[]', size));
        const response = await api.post(`/kits/${kitId}`, formData);

        if (!api.error(response, false)) {
            this.fetchData();
            const refKitId = kitId || 'add';
            this.refDialog[refKitId] && this.refDialog[refKitId].close();
        } else {
            const errorData = api.getErrorsHtml(response.data);
            this.setState({
                kitError: true,
                errorMessage: errorData
            });
        }
    }

    addItem = () => {
        this.refForm && this.refForm.submit();
    }

    deleteData = async (id) => {
        const response = await api.delete(`/kits/${id}`);

        if (!api.error(response)) {
            this.props.dispatch({type: 'KIT_CLEAR'});
            this.fetchData();
        }
    }

    downloadSizeChart = () => {
        return <a href={this.props.club.size_chart} target="_balnk">Size chart</a>;

        // / DEBUG: I Don't know if any of this is needed later
        const element = document.createElement('a');
        element.setAttribute('href', this.props.club.size_chart);
        element.setAttribute('download', 'size_chart.jpg');
        element.setAttribute('target', '_blank');

        element.style.display = 'none';
        // document.body.appendChild(element);

        element.click();
        // document.body.removeChild(element);
    }

    handleSave = async () => {
        const formData = new FormData();
        formData.append('image', this.state.size_chart);
        await api.post(`/clubs/add-size-chart`, formData);
        this.props.dispatch(fetchData({
            type: 'CLUB',
            url: `/clubs/${this.props.params.clubId}`,
        }));
    }

    getTabs = () => {
        const {kits} = this.props;
        const {kitTypes} = this.state;
        const header = [];
        const content = [];

        _.map(kitTypes, (kitType) => {
            const kitsByCategory = _.filter(kits.collection, {type_id: kitType.id});
            const addItemDialogBody = this.renderDialogContent(kitType);

            header.push(<Tab key={`tabHeader${kitType.id}`}>{kitType.title}<span
                className="count">{kitsByCategory.length}</span></Tab>);
            content.push(
                <TabPanel key={`tabContent${kitType.id}`}>
                    <p className="tab-title">{kitType.title}<span className="count">{kitsByCategory.length}</span></p>
                    <ul className="list">
                        {kitsByCategory.length > 0 && kitsByCategory.map((kit) => {
                            const editItemDialogBody = this.renderDialogContent(kitType, kit);

                            return (
                                <li key={`kit${kitType.id}${kit.id}`}>
                                    <span className="title">{kit.title}</span>
                                    <ConfirmDialog
                                        onlyContent
                                        showCloseButton={false}
                                        ref={ref => this.refDialog[kit.id] = ref}
                                        title=""
                                        body={
                                            <React.Fragment>
                                                <h3>Edit kit item</h3>
                                                {editItemDialogBody}
                                            </React.Fragment>
                                        }
                                        actions={[
                                            <button key="cancel"
                                                    className="button">Cancel
                                            </button>,

                                            <button key="confirm"
                                                    className="button hover-blue"
                                                    onClick={this.addItem}>Confirm
                                            </button>
                                        ]}
                                    >
                                        <i className="button-icon ion-edit"
                                           style={{marginRight: 10, fontSize: 20}}/>
                                    </ConfirmDialog>

                                    <ConfirmDialog
                                        showCloseButton={false}
                                        onConfirm={() => this.deleteData(kit.id)}
                                        title=""
                                        body={
                                            <h3>Are you sure you want to delete?</h3>
                                        }
                                    >
                                        <i className="button-icon ion-android-close"/>
                                    </ConfirmDialog>
                                </li>
                            );
                        })}

                        <li className="add-item">
                            <ConfirmDialog
                                onlyContent
                                showCloseButton={false}
                                ref={ref => this.refDialog.add = ref}
                                title=""
                                body={
                                    <React.Fragment>
                                        <h3>Add kit item</h3>
                                        {addItemDialogBody}
                                    </React.Fragment>
                                }
                                actions={[
                                    <button key="cancel"
                                            className="button">Go Back
                                    </button>,

                                    <button key="confirm"
                                            className="button hover-blue"
                                            onClick={this.addItem}>Confirm
                                    </button>
                                ]}
                            >
                                <span>Add kit item</span>
                            </ConfirmDialog>
                        </li>
                    </ul>
                </TabPanel>
            );
        });

        return {
            header,
            content,
        };
    }

    renderDialogContent = (kitType = {}, kit = {}) => (
        <Form ref={ref => this.refForm = ref} className="kit-form"
              onSubmit={() => this.handleSubmit(kitType.id, kit.id)}>
            <TextInput
                className="tooltips"
                label="Title"
                name="title"
                onChange={this.handleInputChange}
                placeholder="Title"
                validation="required"
                value={kit.title}
                prepend={<i className="ion-ios-book"/>}
                wide
            />
            <TextInput
                className="tooltips"
                label="Product code"
                name="sku"
                onChange={this.handleInputChange}
                placeholder="Product Code"
                value={kit.product_sku}
                prepend={<i className="ion-ios-barcode-outline"/>}
            />
            <FileUpload
                accept=".jpg,.jpeg,.png"
                clearable
                name="pic"
                onChange={this.handleInputChange}
                placeholder="Upload Product Image"
                prepend={<i className="ion-android-upload"/>}
                validation="file|max:1000"
            />

            <Checkbox
                label="Sizes"
                name="sizes"
                onChange={this.handleInputChange}
                wide
                styled
                value={kit.available_sizes && kit.available_sizes.map(size => size.value)}
                options={[
                    {id: 'fitsall', title: 'Fits All'},
                    {id: 'xxs', title: 'XXS'},
                    {id: 'xs', title: 'XS'},
                    {id: 's', title: 'S'},
                    {id: 'm', title: 'M'},
                    {id: 'l', title: 'L'},
                    {id: 'xl', title: 'XL'},
                    {id: 'xxl', title: 'XXL'},
                    {id: 'size1', title: '1'},
                    {id: 'size2', title: '2'},
                    {id: 'size3', title: '3'},
                    {id: 'size4', title: '4'},
                    {id: 'size5', title: '5'},
                    {id: 'size6', title: '6'},
                    {id: 'size7', title: '7'},
                    {id: 'size8', title: '8'},
                    {id: 'size9', title: '9'},
                    {id: 'size10', title: '10'},
                    {id: 'size11', title: '11'},
                    {id: 'size12', title: '12'},
                    {id: 'size13', title: '13'},
                    {id: 'size14', title: '14'},
                    {id: 'size15', title: '15'},
                    {id: 'size16', title: '16'},
                    {id: 'size17', title: '17'},
                    {id: 'size18', title: '18'},
                ]}
            />
            <div>{this.state.kitError ? this.state.errorMessage : ''}</div>
        </Form>
    )

    renderClubContent = () => {
        const {
            fetchData,
            club,
            params
        } = this.props
        const {
            size_chart
        } = club
        const type = fn.getFaqType('CoachingKit')
        const tab = this.getTabs()
        const clubUrl = `${url.club}/${this.clubId}`
        const sizeChartJSX = size_chart && (
            <React.Fragment>
                {size_chart &&
                <div className="size-chart">
                    <a href={size_chart}
                       target="_blank"
                       className="size_chart"
                       onClick={() => true}><i className="icon ion-document"></i> View your size chart</a>
                </div>
                }
            </React.Fragment>)

        return (
            <div className="form-wrapper">
                <div className="form-outer">
                    <Tabs selectedIndex={this.state.tabIndex} onSelect={this.onTabSelect}>
                        <TabList>
                            {tab.header}
                        </TabList>
                        {tab.content}
                    </Tabs>

                    <div className="upload-wrapper">
                        <div className="upload-header">
                            <h4 className="upload-header-title">Size Chart</h4>
                        </div>
                        <div className="download-file-name">
                            {sizeChartJSX}
                        </div>
                        <div className="upload-buttons-wrapper">
                            <div className="upload-file-wrapper">
                                <FileUpload
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    clearable
                                    name="size_chart"
                                    onChange={this.handleInputChange}
                                    placeholder={`${size_chart ? 'Update ' : ''}Upload Size Chart`}
                                    prepend={<i className="ion-android-upload"/>}
                                    validation="file|max:1000"
                                />
                            </div>
                            {this.state.size_chart &&
                            <span className="button-standard"
                                  onClick={this.handleSave}>Save
                                </span>
                            }
                        </div>
                    </div>

                    <div className="form-actions">
                        <div className="age-group-buttons">
                            {params.clubId &&
                            <Link to={`${clubUrl}`} className="button" onClick={fetchData}>Back</Link>
                            }
                            <Link to={params.clubId ? `${clubUrl}` : `${url.dashboard}`} className="button hover-blue"
                                  onClick={fetchData}>Done</Link>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    renderParentContent = () => {
        const {kits} = this.props
        return (
            <Block>
                {
                    kits.currentCollection && kits.currentCollection.length > 0 ? (
                        <Table headers={['Kit', 'Name', 'Team', 'Type', 'Size']}
                               className="header-transparent table-kit-item"
                               icon="ion-tshirt">
                            {_.map(kits.currentCollection, (id) => {
                                    const kit = kits.collection[id];

                                    return <tr key={`kit_${kit.id}`}>
                                        <td className="td-large">
                                            <Link to={`${url.kit}/${kit.kit_id}`}>
                                                {
                                                    kit.kit && kit.kit.title
                                                }
                                            </Link>
                                        </td>

                                        <td>
                                            {
                                                kit.player && kit.player.display_name
                                            }
                                        </td>

                                        <td>
                                            {
                                                kit.team && kit.team.title
                                            }
                                        </td>

                                        <td>
                                            {
                                                kit.kit && kit.kit.type && kit.kit.type.title
                                            }
                                        </td>
                                        {this.renderKitSize(kit)}
                                    </tr>
                                }
                            )
                            }
                        </Table>
                    ) : (
                        <p>Not assigned any kit items</p>
                    )}
            </Block>
        )
    }

    renderKitSize = (kit) => {
        let size = kit.size

        if (!kit.size) {
            let saveButton = null

            // check if size is set for that id
            if (this.state[`size${kit.id}`]) {
                saveButton = <span key="saveSize"
                                   className="button"
                                   onClick={() => this.saveSize(kit)}>
                                <img className="icon-save" src={"/images/icon/save.png"}/>
                            </span>
            }

            size = (
                <div className="flex">
                    <Select name={`size${kit.id}`}
                            valueKey="value"
                            options={kit.kit && kit.kit.available_sizes}
                            onChange={this.handleInputChange}/>{saveButton}
                </div>
            );
        }

        return <td className="kit-size-select">{size}</td>
    }

    saveSize = async (kit) => {
        const size = this.state[`size${kit.id}`];

        if (!size) {
            return false;
        }

        const formData = {
            size
        };

        const response = await api.post(`/kits/${kit.id}/select-size`, formData);

        if (!api.error(response)) {
            fn.showAlert('Size has been selected!', 'success');
            this.fetchData();
        }
    }

    render() {
        const {
            fetchData,
            club,
            params
        } = this.props
        const {
            size_chart
        } = club
        const type = fn.getFaqType('CoachingKit')
        const tab = this.getTabs()
        const clubUrl = `${url.club}/${this.clubId}`
        const sizeChartJSX = size_chart && (
            <React.Fragment>
                {size_chart &&
                <div className="size-chart">
                    <a href={size_chart}
                       target="_blank"
                       className="size_chart"
                       onClick={() => true}><i className="icon ion-document"></i> View your size chart
                    </a>
                </div>
                }
            </React.Fragment>)

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Kit items"
                           faq={true}
                           faqLink={fn.getFaqLink(type, `/${params.clubSlug}/`)}/>

                {
                    fn.isGuardian() ? this.renderParentContent() : this.renderClubContent()
                }
            </div>
        );
    }

}
