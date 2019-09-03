import React from 'react';
import PropTypes from 'prop-types';
import { fn } from 'app/utils';
import { url } from 'app/constants';
import { Link } from 'react-router';

export default class SiteFooter extends React.PureComponent {

	render() {
		return (
			<footer role="banner" id="site-footer" className="site-footer">
				<div className="site-footer-inner">
					<ul className="site-footer-menu">
						<li><Link to={`/${url.page}/terms`}>Terms & Conditions</Link></li>
						<li><Link to={`/${url.page}/cookie-policy`}>Cookies</Link></li>
						<li><Link to={`/${url.page}/security`}>Security</Link></li>
						<li><Link to={`/${url.page}/privacy-policy`}>Privacy Policy</Link></li>
						<li><Link to={`/${url.page}/cookie-policy`}>Complaints Handling Procedure</Link></li>
						<li><Link to={`/${url.page}/treating-customers-fairly`}>Treating Customers Fairly</Link></li>
						<li className="site-footer-line">|</li>
						<li><Link to={`/${url.page}/contact-us`}>Contact Us</Link></li>
					</ul>
					<span className="copyright">&copy; My Grassroots Club Ltd {(new Date()).getFullYear()}</span>
				</div>
			</footer>
		);
	}

}
