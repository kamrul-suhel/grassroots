import React from "react";
import { connect } from "react-redux";
import { ContentLoader, Table, Tooltip } from "@xanda/react-components";
import { api, fn } from "app/utils";
import { url } from "app/constants";
import { fetchData } from "app/actions";
import {
  ButtonStandard,
  Link,
  PageDescription,
  PageTitle
} from "app/components";

@connect(store => {
  return {
    players: store.player
  };
})
export default class List extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 1,
      filters: ""
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData = (currentPage = 1, newFilters) => {
    this.setState({
      currentPage,
      filters: newFilters || this.state.filters
    });

    const filters = newFilters === undefined ? this.state.filters : newFilters;
    this.props.dispatch(
      fetchData({
        type: "PLAYER",
        url: `/players?page=${currentPage}${filters}`,
        page: currentPage
      })
    );
  };

  renderTeams = player => {
    if (player.teams && player.teams.length > 0) {
      return player.teams.map((o, i) => [
        i > 0 && ", ",
        <Link key={`team${o.team_id}`} to={`${url.team}/${o.team_id}`}>
          {o.title}
        </Link>
      ]);
    }

    return (
      <Link
        to={`${url.player}/${player.player_id}/skill-group`}
        className="button"
      >
        Assign
      </Link>
    );
  };

  render() {
    const { players, params } = this.props;
    const { currentPage } = this.state;
    const type = fn.getFaqType("Players");

    return (
      <div id="content" className="site-content-inner player">
        <PageTitle
          value="Players"
          faq={true}
          faqLink={fn.getFaqLink(type, `/${params.clubSlug}/`)}
        />
        <PageDescription>
          View all players in the system. Start typing in the Search field to
          find a specific player by their name. Use the filters narrow your
          selection. View a player for Player options and Assignments.
        </PageDescription>

        {fn.isAdmin() && (
          <div className="page-actions">
            <ButtonStandard
              to={`${url.player}/add`}
              icon={<i className="ion-plus" />}
            >
              Add new player
            </ButtonStandard>

            <ButtonStandard
              to={`${url.email}`}
              icon={<i className="ion-android-mail" />}
            >
              Send message
            </ButtonStandard>
          </div>
        )}

        <ContentLoader
          filter={{
            filters: players.filters,
            onUpdate: this.fetchData
          }}
          pagination={{
            currentPage,
            onPageChange: this.fetchData,
            total: players.count
          }}
          data={players.currentCollection}
          forceRefresh
          isLoading={players.isLoading}
          notFound="No players"
        >
          <Table
            total={players.count}
            className={"player-table header-transparent"}
            headers={[
              "Name",
              "",
              "Attendance",
              "Guardian",
              "Telephone",
              "Email",
              "Team / Skill group"
            ]}
            icon="ion-ios-people centered-table-icon"
          >
            {_.map(players.currentCollection, id => {
              const player = players.collection[id];
              const livingGuardian = _.find(
                player.guardians,
                o => o.user_id === player.living_guardian
              );
              const genderIcon =
                player.gender === "male" ? "ion-male" : "ion-female";
              const siblingIcon = player.siblings ? (
                <Tooltip
                  icon={<i className="ion-person-add" />}
                  message="Player has siblings"
                />
              ) : null;
              const medicalIcon = player.medical_conditions ? (
                <Tooltip
                  icon={<i className="ion-medkit" />}
                  message={player.medical_conditions}
                />
              ) : null;
              return (
                <tr key={`player_${player.player_id}`}>
                  <td className="td-limit-width">
                    <div className="space-between">
                      <Link
                        to={`${url.player}/${player.player_id}/edit`}
                        className={"d-inline-block"}
                      >
                        {player.display_name}
                      </Link>
                    </div>
                  </td>

                  <td className="short">
                    <div className="space-between">
                      <div className="td-icons td-icons-margin">
                        <i className={genderIcon} />
                        {siblingIcon}
                        {medicalIcon}
                      </div>
                    </div>
                  </td>

                  <td className="align-left td-small">
                    {`${player.attended_sessions}/${player.total_sessions}`}
                  </td>

                  <td className="td-small">
                    <div className="multiline-field">
                      <Link
                        to={`${url.guardian}/${livingGuardian.user_id}/edit`}
                      >
                        <span>
                          {livingGuardian && livingGuardian.display_name}{" "}
                        </span>
                        <span>
                          {livingGuardian &&
                          livingGuardian.partner_name !== "null"
                            ? livingGuardian.partner_name
                            : ""}
                        </span>
                      </Link>
                    </div>
                  </td>

                  <td className="td-small">
                    <div className="multiline-field">
                      {livingGuardian && (
                        <a href={`tel:${livingGuardian.telephone}`}>
                          {livingGuardian.telephone}
                        </a>
                      )}
                      {livingGuardian && (
                        <a href={`tel:${livingGuardian.partner_tel}`}>
                          {livingGuardian.partner_tel !== "null"
                            ? livingGuardian.partner_tel
                            : ""}
                        </a>
                      )}
                    </div>
                  </td>

                  <td className="td-small">
                    <div className="multiline-field">
                      <span>
                        <a href={`mailto:${livingGuardian.email}`}>
                          {livingGuardian.email}
                        </a>
                      </span>
                    </div>
                  </td>

                  <td className="td-limit-width td-small">
                    {this.renderTeams(player)}
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
