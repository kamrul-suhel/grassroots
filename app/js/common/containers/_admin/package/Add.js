import React from 'react';
import {Form, TextInput, Dialog} from '@xanda/react-components';
import {api, fn} from 'app/utils';
import {url} from 'app/constants';
import {Back, FormButton, PageTitle} from 'app/components';
import {connect} from "react-redux";

@connect((store, ownProps) => {
    return {

    };
})

export default class Add extends React.PureComponent {

    state = {
        errorMsg: ''
    }

    handleInputChange = (name, value) => {
        this.setState({[name]: value});
    }

    handleSubmit = async () => {
        const formData = new FormData();
        this.state.description && formData.append('description', this.state.description);
        this.state.maxSlot && formData.append('max_slot', this.state.maxSlot);
        this.state.price && formData.append('price', this.state.price);
        this.state.title && formData.append('title', this.state.title);

        const response = await api.post('/packages', formData);

        if (!api.error(response, false)) {
            fn.navigate(url.package);

            this.props.dispatch({
                type:'OPEN_SNACKBAR_MESSAGE',
                option: {
                    message:'Package has been created successfully!',
                    color:'white'
                }
            })
        } else {
            this.refDialog.open();
            const errorHtml = api.getErrorsHtml(response.data);
            this.setState({
                errorMsg: errorHtml
            });
            this.refForm && this.refForm.hideLoader();
        }
    }

    render() {
        return (
            <div id="content" className="site-content-inner">
                <PageTitle value="Create package"/>
                <Form loader onSubmit={this.handleSubmit} className="form-section" ref={ref => this.refForm = ref}>
                    <TextInput
                        className="tooltips"
                        label="Package title"
                        placeholder="Package title"
                        name="title"
                        onChange={this.handleInputChange}
                        prepend={<i className="ion-pricetag"/>}
                        validation="required"
                    />
                    <TextInput
                        className="tooltips"
                        label="Max number of players"
                        placeholder="Max number of players"
                        name="maxSlot"
                        onChange={this.handleInputChange}
                        prepend={<i className="ion-person-stalker"/>}
                        validation="required"
                    />
                    <TextInput
                        className="tooltips"
                        label="Price"
                        placeholder="Price"
                        name="price"
                        onChange={this.handleInputChange}
                        prepend="£"
                        validation="required"
                    />
                    <TextInput
                        placeholder="Package description"
                        name="description"
                        onChange={this.handleInputChange}
                        textarea
                        wide
                    />

					<div className="form-actions">
						<Back className="button">Cancel</Back>
						<Dialog
                            showCloseButton={false}
							ref={ref => this.refDialog = ref}
							className='text-danger'
                            title=''
							content={
                                <div className="dialog-body-inner">
                                    <div className={"dialog-left-sidebar"}>
                                        <img src={'/images/ball-soccer.png'}/>
                                    </div>
                                    <div className={"dialog-right-side"}>
                                        <h3>Error!</h3>
                                        {this.state.errorMsg}
                                    </div>
                                </div>
							}
                            buttons={[<button key="cancel" className="button">Back</button>]}
						>
							<FormButton label="Save" />
						</Dialog>

                    </div>
                </Form>
            </div>
        );
    }

}
