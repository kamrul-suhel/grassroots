import React from 'react';
import {connect} from 'react-redux';
import {PageTitle, Back} from 'app/components';

@connect((store, ownProps) => {
    return {
        faq: store.faq.collection[ownProps.params.faqId] || {},
    };
})
export default class Edit extends React.PureComponent {

    constructor(props) {
        super(props)
    }

    render() {
        const {faq} = this.props

        return (
            <div id="content" className="site-content-inner faq">
                <PageTitle value={faq.question}/>
                {<div dangerouslySetInnerHTML={{__html: faq.answer}}></div>}

                <div style={{textAlign:'right'}}>
                    <Back className={"button"}>back</Back>
                </div>

            </div>
        );
    }

}
