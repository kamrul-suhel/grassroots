import React from "react"
import { connect } from "react-redux"
import { ContentLoader, Table } from "@xanda/react-components"
import { api, fn } from "app/utils"
import { url } from "app/constants"
import { fetchData } from "app/actions"
import {
  ButtonStandard,
  ConfirmDialog,
  Link,
  PageDescription,
  PageTitle
} from "app/components"

@connect((store, ownProps) => {
  return {
    addresses: store.address
  }
})
export default class List extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      contactError: false,
      contactErrorMessage: "",
      currentPage: 1,
      filters: "",
      selectedAddressId: null
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
        type: "ADDRESS",
        collection: "addresses",
        url: `/addresses?page=${currentPage}${filters}`,
        page: currentPage
      })
    )
    console.log("inside Filter")
  }

  openDeleteDialog = addressId => {
    this.setState({
      selectedAddressId: addressId
    })
    this.refDialog.refDialog.open()
  }

  deleteData = async () => {
    const { selectedAddressId } = this.state
    const response = await api.delete(`/addresses/${selectedAddressId}`)

    if (!api.error(response, false)) {
      this.fetchData()
      this.refDialog.refDialog.close()
    } else {
      const errorHtml = api.getErrorsHtml(response.data)
      this.setState({
        contactError: true,
        contactErrorMessage: errorHtml
      })
    }
  }

  closeBox = () => {
    this.setState({
      contactError: false,
      contactErrorMessage: ""
    })
  }

  render() {
    const { addresses, params } = this.props
    const { currentPage } = this.state
    const type = fn.getFaqType("Contact")
    return (
      <div id="content" className="site-content-inner">
        <PageTitle
          value="Contacts"
          faq={true}
          faqLink={fn.getFaqLink(type, `/${params.clubSlug}/`)}
        />

        <PageDescription>
          View all Contacts in the system. Start typing in the Search field to
          find a specific contact or use the filters to narrow your search. If
          you would like to Add a Coach, please click{" "}
          <Link to={`${url.coach}/add`}>here</Link>.
        </PageDescription>

        <div className="page-actions">
          <ButtonStandard
            to={`${url.contact}/add`}
            icon={<i className="ion-plus" />}
          >
            Add new contact
          </ButtonStandard>
        </div>

        <ContentLoader
          filter={{
            filters: addresses.filters,
            onUpdate: this.fetchData
          }}
          pagination={{
            currentPage,
            onPageChange: this.fetchData,
            total: addresses.count
          }}
          data={addresses.currentCollection}
          forceRefresh
          isLoading={addresses.isLoading}
          notFound="No addresses"
        >
          <Table
            className={"header-transparent"}
            total={addresses.count}
            headers={[
              "Name",
              "Telephone",
              "Email",
              "Address",
              "Role",
              "Status",
              "Options"
            ]}
            icon="ion-person-stalker"
          >
            {_.map(addresses.currentCollection, id => {
              const address = addresses.collection[id]
              return (
                <tr key={`address_${address.address_id}`}>
                  <td>
                    {fn.isAdmin() ? (
                      <Link to={`${url.contact}/${address.address_id}`}>
                        {address.first_name} {address.last_name}
                      </Link>
                    ) : (
                      `${address.first_name ? address.first_name : "Unknown"} ${
                        address.last_name ? address.last_name : ""
                      }`
                    )}
                  </td>

                  <td>
                    <a href={`tel:${address.telephone}`}>{address.telephone}</a>
                  </td>

                  <td>
                    <a href={`mailto:${address.email}`}>{address.email}</a>
                  </td>

                  <td>{address.address && address.address}</td>

                  <td>{address.address_type}</td>

                  <td>{address.status ? "Active" : "Inactive"}</td>

                  <td className="short table-options">
                    <span
                      className="button icon"
                      onClick={() => this.openDeleteDialog(address.address_id)}
                    >
                      <i title="Delete" className="ion-trash-b" />
                    </span>
                  </td>
                </tr>
              )
            })}
          </Table>
        </ContentLoader>

        <ConfirmDialog
          close={false}
          onClose={this.closeBox}
          showCloseButton={false}
          ref={ref => (this.refDialog = ref)}
          onConfirm={() => this.deleteData()}
          title=""
          body={
            <React.Fragment>
              <h3>Confirm Delete</h3>
              {this.state.contactError ? (
                this.state.contactErrorMessage
              ) : (
                <p>Are you sure you want to delete?</p>
              )}
            </React.Fragment>
          }
        >
          <i title="Delete" className="ion-trash-b hidden" />
        </ConfirmDialog>
      </div>
    )
  }
}
