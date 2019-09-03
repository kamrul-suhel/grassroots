import React from 'react';
import PropTypes from 'prop-types';

export default class FormButton extends React.PureComponent {

    static propTypes = {
        name: PropTypes.string,
        label: PropTypes.string.isRequired,
        large: PropTypes.bool,
        value: PropTypes.string,
    }

    render() {
        const {name, label, large, value, disabled} = this.props;
        const largeClass = large ? 'button-large' : '';
        const btnDisabled = disabled ? disabled : false

        return (
            <button type="submit"
                    name={name}
                    value={value}
                    disabled={btnDisabled}
                    className={`button form-submit ${largeClass} hover-blue`}>{label}
            </button>
        );
    }

}
