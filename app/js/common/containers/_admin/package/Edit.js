import React from 'react';
import { Form, TextInput, Dialog } from '@xanda/react-components';
import { connect } from 'react-redux';
import { api, fn } from 'app/utils';
import { url } from 'app/constants';
import { fetchData } from 'app/actions';
import { Back, FormButton, PageTitle } from 'app/components';

@connect((store, ownProps) => {
	return {
		pckg: store.pckg.collection[ownProps.params.packageId] || {},
	};
})
export default class Edit extends React.PureComponent {

	state = {
		isError: false,
		errorMessage: '',
	}

	componentWillMount = async () => {
		this.props.dispatch(fetchData({
			type: 'PACKAGE',
			url: `/packages/${this.props.params.packageId}`,
		}));
	}

	handleInputChange = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = async () => {
		const { description, maxSlot, price, title} = this.state
		const formData = new FormData();
		description && formData.append('description', description);
		maxSlot && formData.append('max_slot', maxSlot);
		price && formData.append('price', price);
		title && formData.append('title', title);
		const response = await api.update(`/packages/${this.props.params.packageId}`, formData);

		if (!api.error(response, false)) {
            // this.refForm && this.refForm.hideLoader();
			fn.navigate(url.package);
			this.setState({
				isError: false
			})
		} else {
			this.refDialog.open();
			const errorHtml = api.getErrorsHtml(response.data);
            this.setState({
                errorMessage : errorHtml,
				isError: true
            });

			this.refForm && this.refForm.hideLoader();
		}
	}

	render() {
		const { pckg } = this.props;

		return (
			<div id="content" className="site-content-inner">
				<PageTitle value="Edit package" />
				<Form loader onSubmit={this.handleSubmit} className="form-section" ref={ref => this.refForm = ref}>
					<TextInput
						className="tooltips"
						label="Package title"
						placeholder="Package title"
						name="title"
						onChange={this.handleInputChange}
						prepend={<i className="ion-pricetag" />}
						validation="required"
						value={pckg.title}
					/>
					<TextInput
						className="tooltips"
						label="Max number of players"
						placeholder="Max number of players"
						name="maxSlot"
						onChange={this.handleInputChange}
						prepend={<i className="ion-person-stalker" />}
						validation="required"
						value={pckg.max_slot}
					/>
					<TextInput
						className="tooltips"
						label="Price per month"
						placeholder="Price per month"
						name="price"
						onChange={this.handleInputChange}
						prepend="£"
						validation="required"
						value={pckg.price}
					/>
					<TextInput
						className="tooltips"
						label="Edit description"
						placeholder="Edit description"
						name="description"
						onChange={this.handleInputChange}
						textarea
						value={pckg.description}
						wide
					/>

					<div className="form-actions">
						<Back className="button">Back</Back>


						<button className='button hover-blue' onClick={this.handleSubmit}>Save</button>
					</div>
				</Form>
				<Dialog
					showCloseButton={false}
					ref={ref => this.refDialog = ref}
					className='text-danger'
					title=''
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
					buttons={[<button key="cancel" className="button">Go Back</button>]}
				>
					<button className="hidden" >Save</button>
				</Dialog>
			</div>
		);
	}

}
