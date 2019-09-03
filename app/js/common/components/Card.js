import React from 'react';
import PropTypes from 'prop-types';

export default class Card extends React.PureComponent {

	static propTypes = {
		title: PropTypes.string,
	}

	render() {
		const { title } = this.props;

		return (
			<div className="form-card">
				{title && <h3 className="form-card-title">{title}</h3>}
				{this.props.children}
			</div>
		);
	}

}
