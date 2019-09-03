import React from 'react';
import PropTypes from 'prop-types';

export default class MetaSection extends React.PureComponent {

	static propTypes = {
		title: PropTypes.string,
	}

	render() {
		const { title } = this.props;

		return (
			<div className="meta-section">
				{title && <h2 className="meta-section-title">{title}</h2>}
				{this.props.children}
			</div>
		);
	}

}
