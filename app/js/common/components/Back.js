import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { ConfirmDialog } from 'app/components';

export default class Back extends React.PureComponent {

	static propTypes = {
		className: PropTypes.string,
		confirm: PropTypes.bool,
		showCloseButton: PropTypes.bool
	}

	static defaultProps = {
		confirm: false,
		showCloseButton: true
	}

	handleClick = (event) => {
		event.preventDefault();
		browserHistory.goBack();
	}

	render() {
		const { children, className, confirm, title, showCloseButton } = this.props;

		const closeButton = showCloseButton && showCloseButton === false ? true : false;

		return (
			<React.Fragment>
				{confirm ? (
					<ConfirmDialog
						showCloseButton={closeButton}
						onConfirm={browserHistory.goBack}
						title=""
						body={
							<React.Fragment>
								<h3>{title || `Go Back`}</h3>
								<p>Are you sure you want to leave this page?</p>
							</React.Fragment>
						}
					>
						<span className={className}>{children}</span>
					</ConfirmDialog>
				) : (
					<span className={className} onClick={this.handleClick}>{children}</span>
				)}
			</React.Fragment>
			);
	}

}
