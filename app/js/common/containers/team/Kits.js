import React from 'react';
import {connect} from 'react-redux';
import {Form, MultiSelect, Dialog, TextInput} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import {FormButton, PageDescription, PageTitle, Back, ButtonStandard} from 'app/components';

@connect((store, ownProps) => {
    return {
        team: store.team.collection[ownProps.params.teamId] || {},
    };
})
export default class Kits extends React.PureComponent {

    constructor(props) {
        super(props);

        this.teamId = this.props.params.teamId;

        this.state = {
            error: false,
            errorMessage: '',
            kitList: [],
        };
    }

    componentWillMount = async () => {
        this.props.dispatch(fetchData({
            type: 'TEAM',
            url: `/teams/${this.teamId}`,
        }));

        const kitList = await api.get('/dropdown/kit-items');

        this.setState({
            kitList: kitList.data,
        });
    }

    closeBox = () => {
        this.setState({
            error: false,
            errorMessage: ''
        })
        this.refDialog.close()
    }

    handleInputChange = (name, value) => {
        this.setState({[name]: value});
    }

    handleSubmit = async () => {
        const {params, location} = this.props
        const kits = [];
        // loop through kits and push to new kits array
        this.state.kits.map((kit) => {
            kits.push(kit.id);
        });

        const formData = {
            kits
        };

        const response = await api.post(`/teams/${this.teamId}/assign-kit`, formData);
        if (!api.error(response, false)) {
            let redirectUrl = `${url.team}/${params.teamId}`
            if(location.query.redirect){
                redirectUrl = location.query.redirect
            }

            fn.navigate(redirectUrl)
        } else {
            const errorHtml = api.getErrorsHtml(response.data)
            this.setState({
                errorMessage: errorHtml,
                error: true
            });
            this.refForm && this.refForm.hideLoader()
            this.refDialog.open()
        }

        this.refForm && this.refForm.hideLoader()
    }

    render() {
        const {team, me} = this.props
        const {kitList} = this.state
        const assignKitUrl = `clubs/${me.data && me.data.club_id}/kits`
        let selectedKit = [];
        _.map(team.kits, (kit, index) => {
            let kitItem = {id: kit.value, title: kit.label};
            selectedKit.push(kitItem);
        })

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value={`${team.title} kit items` || 'Team kit items'}/>
                <PageDescription>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem
                    nec elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec id elit
                    non mi porta gravida at eget metus.</PageDescription>

                <ButtonStandard to={assignKitUrl}
                                className={"mb-20"}
                                icon={<i className='ion-plus'/>}>Manage assigned kit
                </ButtonStandard>

                <Form loader
                      wide
                      onSubmit={this.handleSubmit}
                      className="form-section"
                      ref={ref => this.refForm = ref}>
                    <MultiSelect
                        label={['Select kit items you wish to assign', 'Assigned kit items']}
                        name="kits"
                        onChange={this.handleInputChange}
                        options={kitList}
                        value={selectedKit}
                        wide
                    />

                    <div className="form-actions">
                        <Back className="button">Go Back</Back>
                        <button className="button">Save</button>
                    </div>
                </Form>

                <Dialog
                    ref={ref => this.refDialog = ref}
                    title=""
                    close={false}
                    showCloseButton={false}
                    content={
                        <div className="dialog-body-inner">
                            <div className={"dialog-left-sidebar"}>
                                <img src={'/images/ball-soccer.png'}/>
                            </div>
                            <div className={"dialog-right-side"}>
                                <h3>Error!</h3>
                                {this.state.errorMessage}
                            </div>
                        </div>
                    }
                    onConfirm={() => this.handleSubmit()}
                    buttons={[
                        <button className="button" onClick={() => this.closeBox()}>Go Back</button>,
                    ]}
                >
                    <div className="form-actions">
                        <button className="button hidden">Save</button>
                    </div>
                </Dialog>
            </div>
        );
    }
}
