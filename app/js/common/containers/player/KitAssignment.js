import React from 'react';
import {connect} from 'react-redux';
import {Form, MultiSelect, Select} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {fetchData} from 'app/actions';
import { ConfirmDialog, FormButton, FormSection, Meta, PageDescription, PageTitle, ButtonStandard } from 'app/components';
import Back from "../../components/Back";

@connect((store, ownProps) => {
    return {
        player: store.player.collection[ownProps.params.playerId] || {},
        me: store.me
    };
})
export default class KitAssignment extends React.PureComponent {

    constructor(props) {
        super(props);

        this.playerId = this.props.params.playerId;

        this.state = {
            kitItems: [],
        };
    }

    componentWillMount = async () => {
        this.props.dispatch(fetchData({
            type: 'PLAYER',
            url: `/players/${this.playerId}`,
        }));

        const kitItems = await api.get(`/dropdown/kit-items?player_id=${this.playerId}`);
        this.setState({
            kitItems: [...kitItems.data],
        });
    }

    handleInputChange = (name, value) => {
        this.setState({[name]: value})
    }

    handleSubmit = async () => {
        const kits = []

        this.state.kits.map((kit) => {
            if (!kit.id || !kit.new) {
                return false;
            }

            kits.push({
                kit_id: kit.id,
                size: kit.size || null,
            });
        });
        this.refForm && this.refForm.hideLoader()

        // If kit item is empty then go back to edit player
        if(_.isEmpty(kits)){
            fn.navigate(`${url.player}/${this.playerId}/edit`)
            return
        }
        const formData = {
            user_id: this.playerId,
            user_role: 'player',
            kits
        };

        const response = await api.post('/kits/assign', formData)

        if (!api.error(response)) {
            fn.navigate(`${url.player}/${this.playerId}/edit`)
            fn.showAlert('Kit items have been assigned to player!', 'success')
        } else {
            this.refForm && this.refForm.hideLoader()
        }
    }

    // creates a dialog onAdd hook
    onAdd = async (option) => {
        this.setState({selectedKitSize: ''});

        return new Promise((resolve, reject) => {
            const confirm = () => {
                const {selectedKitSize} = this.state;

                // return if kit size is not selected
                if (!selectedKitSize.id) {
                    return false;
                }

                this.setState({kitSizeConfirmation: null});

                // get the first option of array
                const firstOption = _.head(option);
                const title = selectedKitSize.title !== 'Not sure' ? selectedKitSize.title : 'Not set';

                // merge the title and the date as a new title
                const optionValue = {
                    title: <span>{`${firstOption.title} (${title})`}</span>,
                    size: selectedKitSize.id,
                };
                const newOption = _.merge({}, firstOption, optionValue);

                // resolve promise and return the updated option
                return resolve(newOption);
            };

            const cancel = () => {
                this.setState({kitSizeConfirmation: null});
                return reject('cancel');
            };

            const firstOption = _.head(option);
            const sizes = [{id: 'notsure', title: 'Not sure'}].concat(firstOption.sizes);

            const dialog = (
                <ConfirmDialog
                    showCloseButton={false}
                    className="kit-assign-dialog"
                    body={
                        <Select wide
                                name="selectedKitSize"
                                options={sizes}
                                returnFields="all"
                                onChange={this.handleInputChange}/>
                    }
                    customImage={firstOption.image_url}
                    onClose={cancel}
                    onConfirm={confirm}
                    title="Choose a size"
                />
            );

            this.setState({kitSizeConfirmation: dialog});
        });
    }

    getSelectedKitItem = (player) => {
        let selectedKitItem = []

        _.map(player.kits, (kit) => {
            // if team_id exists then return
            if (kit.team_id) {
                return
            }
            const id = kit.kit.kit_id && kit.kit.kit_id
            const imageUrl = kit.kit.image_url && kit.kit.image_url
            const sizes = kit.kit.avaliable_sizes && kit.kit.avaliable_sizes
            const type_id = kit.kit.type_id && kit.kit.type_id
            const type = kit.kit.type && kit.kit.type.title

            const title = kit.kit.title && `${kit.kit.title} ${kit.size === null ? '' : `(${kit.size})`} - ${type}`
            const kitItem = {
                id: id,
                image_url: imageUrl,
                sizes: sizes,
                type_id: type_id,
                title: title
            }

            selectedKitItem.push(kitItem)
        })

        return selectedKitItem
    }

    render() {
        const {player, me} = this.props;
        const {kitItems} = this.state;
        const selectedKitItem = this.getSelectedKitItem(player)
        const clubId = me.data && me.data.club_id

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Kit assignment"/>
                <PageDescription short={true}>Assign additional kit items to {player.display_name && fn.ucFirst(player.display_name)}. Please click to select which kit items on the left table you would like to assign to {player.display_name && fn.ucFirst(player.display_name)}. Assigned kit items will appear in the table on the right.</PageDescription>

                <div className="page-actions">
                    <ButtonStandard to={`${url.club}/${clubId}/${url.skill}`}
                                    icon={<i className="ion-edit" />}>Manage Assigned Kit
                    </ButtonStandard>
                </div>

                {this.state.kitSizeConfirmation}

                <Form loader wide onSubmit={this.handleSubmit} ref={ref => this.refForm = ref}>
                    <FormSection title="">
                        <MultiSelect
                            className={"arrow-right"}
                            clearable={false}
                            label={['Available kit items', 'Assigned kit items']}
                            name="kits"
                            onAdd={this.onAdd}
                            onChange={this.handleInputChange}
                            options={kitItems}
                            value={selectedKitItem}
                            wide
                        />
                        <div className="form-actions">
                            <Back className="button">Back</Back>
                            <FormButton label="Save"/>
                        </div>
                    </FormSection>
                </Form>
            </div>
        );
    }

}
