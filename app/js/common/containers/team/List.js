import React from "react";
import { connect } from "react-redux";
import { ContentLoader, Table } from "@xanda/react-components";
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
    teams: store.team
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
        type: "TEAM",
        url: `/teams?page=${currentPage}${filters}`,
        page: currentPage
      })
    );
  };

    render() {
        const {
            teams,
            params,
            myClub
        } = this.props

        const {
            currentPage
        } = this.state

        const club = myClub.data

        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Teams & Skill groups"
                           faq={true}
                           faqLink={fn.getFaqLink(`caFootballTeams`, `/${params.clubSlug}/`)}/>

        <PageDescription>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget
          lacinia odio sem nec elit. Sed posuere consectetur est at lobortis.
          Curabitur blandit tempus porttitor. Donec id elit non mi porta gravida
          at eget metus.
        </PageDescription>

        {fn.isAdmin() ? (
          <div className="page-actions">
            {club.type === "both" ? (
              <React.Fragment>
                {fn.isClubSs() && (
                  <ButtonStandard
                    to={`${url.club}/${club.club_id}/academy-setup`}
                    className="medium"
                    icon={<i className="ion-plus" />}
                  >
                    Create New School Group
                  </ButtonStandard>
                )}
                {fn.isClubFc() && (
                  <ButtonStandard
                    to={`${url.club}/${club.club_id}/fc-setup`}
                    icon={<i className="ion-plus" />}
                  >
                    Create New Football Team
                  </ButtonStandard>
                )}
              </React.Fragment>
            ) : (
              ""
            )}

            {club.type === "fc" ? (
              <React.Fragment>
                {fn.isClubFc() && (
                  <ButtonStandard
                    to={`${url.club}/${club.club_id}/fc-setup`}
                    icon={<i className="ion-plus" />}
                  >
                    Create New Football Team
                  </ButtonStandard>
                )}
              </React.Fragment>
            ) : (
              ""
            )}

            {club.type === "academy" ? (
              <React.Fragment>
                {fn.isClubSs() && (
                  <ButtonStandard
                    to={`${url.club}/${club.club_id}/academy-setup`}
                    className="medium"
                    icon={<i className="ion-plus" />}
                  >
                    Create New School Group
                  </ButtonStandard>
                )}
              </React.Fragment>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}

        <ContentLoader
          filter={{
            filters: teams.filters,
            onUpdate: this.fetchData
          }}
          pagination={{
            currentPage,
            perPage: teams.misc.per_page,
            onPageChange: this.fetchData,
            total: teams.count
          }}
          data={teams.currentCollection}
          forceRefresh
          isLoading={teams.isLoading}
          notFound="No teams"
        >
          <Table
            className={"header-transparent"}
            total={teams.count}
            headers={["", "Player", "Type", "Age group", "Options"]}
            icon="ion-ios-people"
          >
            {_.map(teams.currentCollection, id => {
              const team = teams.collection[id];
              const type = team.type === "team" ? "FC" : "Academy";
              return (
                <tr key={`team_${team.team_id}`}>
                  <td>
                    <Link to={`${url.team}/${team.team_id}`}>{team.title}</Link>
                  </td>
                  <td>
                    {team.player_count}/{team.max_size}
                  </td>
                  <td>{type}</td>
                  <td>{team.agegroup}</td>
                  <td className="short">
                    <Link
                      to={`${url.team}/${team.team_id}/kits`}
                      className="button icon"
                    >
                      <i title="Assign Kit" className="ion-ios-body" />
                    </Link>

                    <Link
                      to={`${url.team}/${team.team_id}/edit`}
                      className="button icon"
                    >
                      <i title="Assign Kit" className="ion-edit" />
                    </Link>
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
