import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { fn } from 'app/utils';

export default class _Link extends React.PureComponent {

	static propTypes = {
		activeClassName: PropTypes.string,
		className: PropTypes.string,
		onClick: PropTypes.func,
		to: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.string,
		]),
	}

	static defaultProps = {
		activeClassName: '',
		className: '',
		to: '',
	}

	constructor(props) {
		super(props);

		this.isExternal = false;
	}

	prependUrl = (url) => {
		const basename = fn.getBasename();
		const pattern = /^((http|https):\/\/)/;
		this.isExternal = false;

		if (pattern.test(url)) {
			this.isExternal = true;
			return url;
		}

		if (!basename) {
			return `/${url}`;
		}

		if (url === '/') {
			return `/${basename}/`;
		}

		return `/${basename}/${url}`;
	}

	renderToPath = () => {
		const { to } = this.props;

		if (_.isPlainObject(to)) {
			return {
				...to,
				pathname: to.pathname ? this.prependUrl(to.pathname) : '',
			};
		}

		return to ? this.prependUrl(to) : '';
	}

	render() {
		const { activeClassName, className, onClick } = this.props;
		const to = this.renderToPath();

		if (this.isExternal) {
			return <a className={className} href={to} target="_blank">{this.props.children}</a>;
		}

		return <Link activeClassName={activeClassName} className={className} to={to} onClick={onClick}>{this.props.children}</Link>;
	}

}
