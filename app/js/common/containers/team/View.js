import React from "react";
import { connect } from "react-redux";
import { ContentLoader, Table, Tooltip } from "@xanda/react-components";
import { api, fn } from "app/utils";
import { url } from "app/constants";
import { fetchData } from "app/actions";
import {
  Block,
  ButtonStandard,
  Link,
  Meta,
  MetaSection,
  PageTitle
} from "app/components";
import { Edit } from "./index";

@connect((store, ownProps) => {
  return {
    collection: store.team,
    team: store.team.collection[ownProps.params.teamId] || {}
  };
})
export default class View extends React.PureComponent {
  componentWillMount() {
    this.props.dispatch(
      fetchData({
        type: "TEAM",
        url: `/teams/${this.props.params.teamId}`
      })
    );
  }

  renderKitItem = kit => {
    return (
      <tr key={`${kit.value}`}>
        <td>{kit.label && kit.label}</td>
        <td>{kit.kit_type_title && kit.kit_type_title}</td>
      </tr>
    );
  };

  render() {
    const { collection, team } = this.props;
    const gender =
      team.gender === "girl"
        ? "Girls"
        : team.gender === "boy"
        ? "Boys"
        : "Mixed";
    const teamType =
      team.type && team.type === "skill-group" ? " soccer school" : " team";

    return (
      <div id="content" className="site-content-inner">
        <PageTitle value={`${team.title} ${teamType}`} />

        <ContentLoader
          data={team.team_id}
          forceRefresh
          isLoading={collection.isLoading}
          notFound="No Data"
        >
          <Block title="Edit Team" img={team.logo_url}>
            <Edit {...this.props} subComponent={true} />
          </Block>

          <Block title="Current players">
            <ButtonStandard
              to={`${url.team}/${team.team_id}/players`}
              className="mb-30"
              icon={<i className="ion-plus" />}
            >
              Players
            </ButtonStandard>

            <Table
              className="header-transparent"
              headers={[
                "",
                "Age",
                "Match kit - TBC",
                "Training kit - TBC",
                "Option"
              ]}
              icon="ion-ios-person"
            >
              {team.players &&
                team.players.map(player => (
                  <tr key={`teamPlayer${player.player_id}`}>
                    <td>
                      <Link to={`${url.player}/${player.player_id}`}>
                        {player.display_name}
                      </Link>{" "}
                      {player.medical_conditions && (
                        <Tooltip
                          icon={<i className="ion-medkit" />}
                          message={player.medical_conditions}
                        />
                      )}
                    </td>
                    <td>{fn.diffDate(player.birthday)} years</td>
                    <td />
                    <td />
                    <td>
                      <Link
                        to={`${url.player}/${player.player_id}`}
                        className="button"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
            </Table>
          </Block>

          <Block title="Current Assigned Kit items">
            <ButtonStandard
              to={`${url.team}/${team.team_id}/kits`}
              className="mb-30"
              icon={<i className="ion-plus" />}
            >
              Assign kit items
            </ButtonStandard>

            <Table
              className="header-transparent"
              headers={["Name", "Type"]}
              icon="ion-ios-body"
            >
              {_.map(team.kits, kit => this.renderKitItem(kit))}
            </Table>
          </Block>

          <Block title="Programmes">
            <ButtonStandard
              to={`${url.programme}`}
              className="mb-30"
              icon={<i className="ion-plus" />}
            >
              Programmes
            </ButtonStandard>

            <Table
              className="header-transparent"
              headers={["", "Date", "Option"]}
              icon="ion-android-calendar"
            >
              {team.programmes &&
                team.programmes.map(programme => (
                  <tr key={`programme_${programme.programme_id}`}>
                    <td>
                      <Link to={`${url.programme}/${programme.programme_id}`}>
                        {programme.title}
                      </Link>
                    </td>
                    <td>
                      {programme.start_date}-{programme.end_date}
                    </td>
                    <td>
                      <Link
                        to={`${url.programme}/${programme.programme_id}`}
                        className="button"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
            </Table>
          </Block>
        </ContentLoader>
      </div>
    );
  }
}
