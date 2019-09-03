import React from 'react';
import PropTypes from 'prop-types';
import {Dialog, TextInput} from '@xanda/react-components';

export default class ConfirmDialog extends React.PureComponent {

	static propTypes = {
		actions: PropTypes.array,
		body: PropTypes.element,
		children: PropTypes.element,
		onClose: PropTypes.func,
		onConfirm: PropTypes.func.isRequired,
		title: PropTypes.string,
		className: PropTypes.string,
		showCloseButton: PropTypes.bool,
	}

	static defaultProps = {
		actions: [],
		className: '',
		onConfirm: () => {},
		title: 'Are you sure?',
		close: true,
		showCloseButton: true,
	}

	confirm = (close = true) => {
		this.props.onConfirm && this.props.onConfirm();
		if(close){
			this.close();
		}
	}

	close = () => {
		this.refDialog && this.refDialog.close();
	}

	render() {
		const { body, onlyContent, confirmClose, close, customImage } = this.props;
		const closeDialog = close === false ? this.props.close : true;
		confirmClose && confirmClose ? this.refDialog.close() : null
		const customImageSize = _.isEmpty(customImage) ? '' : 'custom-img'

		const defaultButtons = [
			<button
				key="cancel"
				className="button">Cancel
			</button>,
			<button
				key="confirm"
				className="button hover-blue"
				onClick={() => this.confirm(closeDialog)}>Confirm
			</button>,
		];

		const showLeftSidebar = !onlyContent;

		const buttons = this.props.actions.length > 0 ? this.props.actions : defaultButtons;

		return (
			<Dialog
				{...this.props}
				content={
					<div className="dialog-body-inner">
						{showLeftSidebar ?
							<div className={`dialog-left-sidebar ${customImageSize}`}>
								{customImage ? <img src={customImage}/> : <img src={'/images/ball-soccer.png'}/> }
							</div>
							: null}

						<div className={"dialog-right-side"}>
							{body}
						</div>
					</div>
				}
				buttons={buttons}
				ref={ref => this.refDialog = ref}
				showCloseButton={false}
			>
				{this.props.children}
			</Dialog>
		);
	}

}
