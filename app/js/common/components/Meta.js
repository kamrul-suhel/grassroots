import React from 'react';
import PropTypes from 'prop-types';

export default class Meta extends React.PureComponent {

	static propTypes = {
		aligned: PropTypes.bool,
		className: PropTypes.string,
		label: PropTypes.string,
		newLine: PropTypes.bool,
		separator: PropTypes.string,
	}

	static defaultProps = {
		aligned: true,
		className: '',
		newLine: false,
		separator: ':',
	}

	renderTelLink = (value) => {
		return (
			<a href={`tel:${value}`}>{value}</a>
		)
	}

	render() {
		const {
			aligned,
			className,
			newLine,
			label,
			separator,
			value,
			telLink
		} = this.props;

		if (!label || !value) {
			return null;
		}

		const alignedClass = aligned ? 'aligned' : '';
		const newLineClass = newLine ? 'new-line' : '';

		return (
			<p className={`meta ${alignedClass} ${newLineClass} ${className}`}>
				<span className="label">{label}{separator}</span>
				<span className="value">
					{
						value === 'null' ? ''
							:
							telLink ? this.renderTelLink(value) : value
					}
				</span>
			</p>
		);
	}

}
