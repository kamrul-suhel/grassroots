const initialState = {
    sbMessage: '',
    sbOpen:false,
    sbTimeout:3000,
    sbColor:'white'
};

export default function snackBarMessage(state = initialState, action){
    switch(action.type){
        case 'OPEN_SNACKBAR_MESSAGE':
            const sbMessage = action.option.message;
            const sbTimeout = action.option.timeout ? action.option.timeout : 3000;
            const color = action.option.color ? action.option.color : 'white'
            return {
                ...state,
                sbMessage: sbMessage,
                sbOpen : false,
                sbTimeout: sbTimeout,
                sbColor: color
            }

        case 'CLOSE_SNACKBAR_MESSAGE':
            return {
                ...state,
                sbOpen : false,
                sbTimeout: 3000
            }

        case 'SNACKBAR_DEFAULT_STATE':
            return {
                sbMessage: '',
                sbOpen:false,
                sbTimeout:3000,
                sbColor:'white'
            }
    }

    return state;
}