import React from "react"
import { connect } from "react-redux"
import { ContentLoader, Table } from "@xanda/react-components"
import { api, fn } from "app/utils"
import { url } from "app/constants"
import { fetchData } from "app/actions"
import {
  ButtonStandard,
  Link,
  PageDescription,
  PageTitle
} from "app/components"

@connect((store, ownProps) => {
  return {
    guardians: store.guardian
  }
})
export default class List extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      currentPage: 1,
      filters: ""
    }
  }

  componentWillMount() {
    this.fetchData()
  }

  fetchData = (currentPage = 1, newFilters) => {
    this.setState({
      currentPage,
      filters: newFilters || this.state.filters
    })
    const filters = newFilters === undefined ? this.state.filters : newFilters
    this.props.dispatch(
      fetchData({
        type: "GUARDIAN",
        url: `/users?role=3&page=${currentPage}${filters}`,
        page: currentPage
      })
    )
  }

  render() {
    const { guardians, params } = this.props
    const { currentPage } = this.state

    return (
      <div id="content" className="site-content-inner">
        <PageTitle
          value="Parents"
          faq={true}
          faqLink={fn.getFaqLink(`caParentsGuardians`, `/${params.clubSlug}/`)}
        />

        <PageDescription>
          View all parents in the system. Start typing in the Search field to
          find a specific Guardian by their name. Use the filters narrow your
          selection. View a Guardian for Guardian options.
        </PageDescription>

        <div className="page-actions">
          <ButtonStandard
            to={`${url.guardian}/add`}
            icon={<i className="ion-plus" />}
          >
            Add new guardian
          </ButtonStandard>
        </div>

        <ContentLoader
          filter={{
            filters: guardians.filters,
            onUpdate: this.fetchData
          }}
          pagination={{
            currentPage,
            onPageChange: this.fetchData,
            total: guardians.count
          }}
          data={guardians.currentCollection}
          forceRefresh
          isLoading={guardians.isLoading}
          notFound="No parents"
        >
          <Table
            className={"header-transparent"}
            total={guardians.count}
            headers={["Name", "Telephone", "Email", "Options"]}
            icon="ion-android-contact"
          >
            {_.map(guardians.currentCollection, id => {
              const guardian = guardians.collection[id]
              return (
                <tr key={`guardian${guardian.user_id}`}>
                  <td>
                    <Link to={`${url.guardian}/${guardian.user_id}`}>
                      {guardian.display_name}
                    </Link>
                  </td>

                  <td>
                    <a href={`tel:${guardian.telephone}`}>
                      {guardian.telephone}
                    </a>
                  </td>

                  <td>
                    <a href={`mailto:${guardian.email}`}>{guardian.email}</a>
                  </td>

                  {/*<td>*/}
                  {/*	{fn.formatPrice(guardian.paid - guardian.invoiced)}*/}
                  {/*</td>*/}

                  <td className="short table-options">
                    <Link
                      to={{
                        pathname: `${url.guardian}/${guardian.user_id}/${url.statement}/add`
                      }}
                      className="button icon"
                    >
                      <i title="Add Payment" className="ion-pricetag" />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </Table>
        </ContentLoader>
      </div>
    )
  }
}
