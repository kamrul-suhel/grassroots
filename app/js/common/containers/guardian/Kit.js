import React, {PureComponent} from 'react'
import {ContentLoader, Table} from "@xanda/react-components"
import {Article, PageTitle, Meta} from "app/components"
import {fn} from 'app/utils'
import {connect} from 'react-redux'

@connect((store) => {
    return {
        kit: store.kit
    }
})

export default class Kit extends PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        const {kit} = this.props

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value={kit.title || 'Kit item'}/>

                <Block title="Kit items">
                    {
                        fn.isAdmin() &&
                        <ButtonStandard to={`${url.player}/${this.playerId}/kit-assignment`}
                                        className="mb-25"
                                        icon={<i className="ion-tshirt"/>}>Assign kit
                        </ButtonStandard>
                    }

                    {
                        club.kits && club.kits.length > 0 ? (
                            <Table headers={['Name', 'Team', 'Type', 'Size', 'Given']}
                                   className="header-transparent table-kit-item"
                                   icon="ion-tshirt">
                                {club.kits.map((kit, index) => {
                                        return <tr key={`kit_${index}`}>
                                            <td className="td-large">
                                                <Link to={`${url.kit}/${kit.kit_id}`}>{kit.title && kit.title}</Link>
                                            </td>

                                            <td>
                                                {
                                                    kit.team && kit.team.title
                                                }
                                            </td>

                                            <td>{kit.kit && kit.kit.type && kit.kit.type.title}</td>
                                            {this.renderKitSize(kit)}
                                            <td className={"td-small"}>
                                                {kit.status && kit.status === 1 ?
                                                    <button className={"button no-padding"} disabled>
                                                        <i className="icon ion-checkmark-round"></i>
                                                    </button>
                                                    :
                                                    <button className={"button no-padding"}
                                                            onClick={() => this.saveStatus(kit)}>
                                                        <i title="Not Assign" className="ion-android-expand"/>
                                                    </button>
                                                }

                                                {!kit.size && <ConfirmDialog
                                                    onlyContent={true}
                                                    body={<div>You want to delete this kit item.</div>}
                                                    onConfirm={() => this.handleDeleteKitItem(kit)}>
                                                    <button className="button">
                                                        <i className="ion ion-android-delete"></i>
                                                    </button>
                                                </ConfirmDialog>
                                                }

                                            </td>
                                        </tr>
                                    }
                                )
                                }
                            </Table>
                        ) : (
                            <p>You do not have any kit item.</p>
                        )}
                </Block>
            </div>
        )
    }
}