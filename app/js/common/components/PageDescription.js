import React from 'react';

export default class PageTitle extends React.PureComponent {
	render() {
		const formElement = this.props.short ? ' short' : ''
		return (
			<div className={`page-description${formElement}`}>
				<p>{this.props.children}</p>
			</div>
		);
	}
}
