import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class Rollover extends React.PureComponent {
    
    render() {
        const { children, hidden, position = 0 } = this.props;
        const content = (
            <div className={`rollover ${hidden ? 'hidden' : ''}`} style={{top: `${position - 5}px`}}>
                {children}
            </div>
        )
        
        return ReactDOM.createPortal(content, document.querySelector('body'))
    }
}