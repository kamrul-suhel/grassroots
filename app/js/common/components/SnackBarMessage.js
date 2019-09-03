import React from 'react';
import {connect} from 'react-redux';

class SnackBarMessage extends React.PureComponent {
    hideSnackBar = () => {
        const timeOut = this.props.snackbar.sbTimeout ? this.props.snackbar.sbTimeout : 3000;
        setTimeout(() => {
            this.props.closeSnackbar()
        }, timeOut)

        setTimeout(() => {
           this.props.getDefaultState();
        }, timeOut + 3000)
    }

    render() {
        if(this.props.snackbar.sbOpen){
            this.hideSnackBar();
        }

        return (
            <div className={'message-success '+ (this.props.snackbar.sbColor) + (this.props.snackbar.sbOpen ? ' open' : '')}>
                {this.props.snackbar.sbMessage}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        snackbar: state.snackBarMessage
    }
}

const mapPropsToState = (dispatch) => {
    return {
        closeSnackbar : () => dispatch({
            type: 'CLOSE_SNACKBAR_MESSAGE',
            option: {
                open: false
            }
        }),

        getDefaultState : () => dispatch({
            type: 'SNACKBAR_DEFAULT_STATE'
        })
    }
}

export default connect(mapStateToProps, mapPropsToState)(SnackBarMessage);