import React from 'react';
import PropTypes from 'prop-types';
import { fn } from 'app/utils';

export default class FileIcon extends React.PureComponent {

	static propTypes = {
		onDelete: PropTypes.func,
		size: PropTypes.number,
		title: PropTypes.string,
		type: PropTypes.string,
		url: PropTypes.string,
	}

	static defaultProps = {
		type: '',
		url: '',
	}

	renderIcon = () => {
		const { type, url } = this.props;

		// check if file type is pdf
		if (type.includes('application/pdf') || url.includes('.pdf')) {
			return 'https://cdn4.iconfinder.com/data/icons/file-extensions-1/64/pdfs-512.png';
		}
		return url;
	}

	handleDelete = () => {
		this.props.onDelete(this.props.title);
	}

	render() {
		const { onDelete, size, title, url, showIcon } = this.props;
		const fileIcon = this.renderIcon();

		return (
			<div className="file-icon-wrapper">
				{showIcon && !url ? <div className="file-icon"><i className="icon ion-android-warning"></i></div> : <div className="file-icon" style={{ backgroundImage: `url(${fileIcon})` }} />}
				<div className="file-meta">
					{!url && title && <span className="file-name">{title}</span>}
					{url && title && <a href={url} target="_blank" className="file-name">{title}</a>}
					{size && <span className="file-size">{fn.bytesToSize(size)}</span>}
				</div>
				{onDelete && <span onClick={this.handleDelete}><i className="button-icon ion-trash-b" /></span>}
			</div>
		);
	}

}
