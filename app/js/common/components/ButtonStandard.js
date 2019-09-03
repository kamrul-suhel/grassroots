import React from 'react';
import PropTypes from 'prop-types';
import { fn } from 'app/utils';
import { Link } from './';

export default class ButtonStandard extends React.PureComponent {

	static propTypes = {
		className: PropTypes.string,
		icon: PropTypes.element,
		to: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.string,
		]),
	}

	static defaultProps = {
		className: '',
		icon: null,
		to: '',
	}

	render() {
		const { className, icon, to } = this.props;
		const ButtonTag = to ? Link : 'div';

		return (
			<ButtonTag className={`button-standard-wrapper ${className}`} to={to}>
				<span className="button-standard">{this.props.children}</span>
				{icon}
			</ButtonTag>
		);
	}

}
