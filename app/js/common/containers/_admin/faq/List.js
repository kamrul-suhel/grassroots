import React from 'react';
import { connect } from 'react-redux';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import {ContentLoader, Dialog, Table, TextInput} from '@xanda/react-components';
import { ButtonStandard, Link, Meta, PageDescription, PageTitle, ConfirmDialog } from 'app/components';

@connect((store, ownProps) => {
	return {
		faqs: store.faq,
	};
})
export default class List extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			currentPage: 1,
			filters: '',
			deleteFAQ:{}
		};
	}

	componentWillMount() {
		this.fetchData();
	}

	fetchData = (currentPage = 1, newFilters) => {
		const { filters } = this.state

		this.setState({
			currentPage,
			filters: newFilters || filters,
		});
		const curFilters = newFilters === undefined ? filters : newFilters;
		this.props.dispatch(fetchData({
			type: 'FAQ',
			url: `/faq?page=${currentPage}${curFilters}`,
			page: currentPage,
		}));
	}

	getFaqType = (type) => {
		type = type.replace('superadmin', 'Super admin');
		type = type.replace('clubadmin', 'Club admin');
		type = type.replace('guardian', 'Parents');
		return type;
	}

	downloadFaqFile= async (faq) => {
		const link = document.createElement('a');
		link.href = faq.file_path;
		link.setAttribute('download', `image-${Date.now()}.${faq.file_type}`);
		link.setAttribute('target', `_blank`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	hendleStatementDialogOpen = (e, faq) => {
		e.preventDefault();
		this.setState({
			deleteFAQ: {...faq}
		});

		this.refDeleteDialog.open();
	}

	confirmDeleteFAQ = async () => {
		const {deleteFAQ} = this.state;
		let url = `faq/${deleteFAQ.id}`
		const response = await api.delete(url);

		if (!api.error(response)) {
			this.fetchData();
			this.refDeleteDialog.close();
		}
	}

	render() {
		const { faqs } = this.props;
		const { currentPage } = this.state;

		return (
			<div id="content" className="site-content-inner faq-component">
				<PageTitle value="Info & Support" />
				<div className="">
					<ButtonStandard to={`${url.manageFaq}/add`}
									icon={<i className="ion-plus" />}>
						Update Info & Support
					</ButtonStandard>
				</div>

				<ContentLoader
					filter={{
						filters: faqs.filters,
						onUpdate: this.fetchData,
					}}
					pagination={{
						currentPage,
						onPageChange: this.fetchData,
						total: faqs.count,
					}}
					data={faqs.currentCollection}
					forceRefresh
					isLoading={faqs.isLoading}
					notFound="No faqs"
				>
					<Table
						headers={['Question', 'Display For', 'Edit']}
						icon="ion-help"
					>
						{_.map(faqs.currentCollection, (id) => {
							const faq = faqs.collection[id];
							return (
								<tr key={`faq${faq.id}`}>
									<td>
										<Link to={`${url.manageFaq}/${faq.id}`}>
											{faq.question}
										</Link>
									</td>

									<td className="capitalize">{this.getFaqType(faq.type)}</td>

									<td className="short table-options">
										<Link to={`${url.manageFaq}/${faq.id}/edit`}
											  className="icon">
											<i title="Edit" className="ion-edit" />
										</Link>

										<a href=""
										   onClick={(e) => this.hendleStatementDialogOpen(e, faq)}>
                                            <span className="icon">
                                                <i title="" className="ion-android-delete"></i>
                                            </span>
										</a>
									</td>
								</tr>
							);
						})}
					</Table>
				</ContentLoader>


				<Dialog
					ref={ref => this.refDeleteDialog = ref}
					showCloseButton={false}
					title=""
					content={
						<div className="dialog-body-inner">
							<div className={"dialog-left-sidebar"}>
								<img src={'/images/ball-soccer.png'}/>
							</div>
							<div className={"dialog-right-side"}>
								<h3>Delete FAQ</h3>
								<p>Are you sure you want to delete</p>
							</div>
						</div>
					}
					buttons={[
						<button key={'cancel'}
								className={'button'}>Cancel
						</button>,

						<button key={'confirm'}
								onClick={this.confirmDeleteFAQ}
								className={'button hover-blue'}>Delete
						</button>
					]}
				>
					<button className={'hidden'}>
						Click to open
					</button>
				</Dialog>
			</div>
		);
	}

}
