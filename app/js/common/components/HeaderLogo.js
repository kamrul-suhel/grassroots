import React from 'react'

export default class HeaderLogo extends React.PureComponent{
    constructor(props){
        super(props)
    }


    render() {
        const { logo, top } = this.props
        const topSpace = top ? `${top}px` : null
        return(
            <div className="header-logo" style={{top: topSpace}}>
                {logo && <span style={{backgroundImage: `url('${logo}')`}}/>}
            </div>
        )
    }
}