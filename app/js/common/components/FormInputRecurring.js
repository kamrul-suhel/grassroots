import React from 'react'
import PropTypes from 'prop-types'
import {
    Select,
    TextInput
} from '@xanda/react-components'

export default class FormInputRecurring extends React.PureComponent {

    static propTypes = {
        label: PropTypes.string,
        name: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        onChange: PropTypes.func,
        wide: PropTypes.bool,
    }

    static defaultProps = {
        options: [
            {id: 'once', title: 'Once'},
            {id: 'day', title: 'Daily'},
            {id: 'week', title: 'Weekly'},
            {id: 'biweek', title: 'Bi weekly'},
            {id: 'month', title: 'Monthly'},
            {id: 'year', title: 'Yearly'},
        ],
        wide: false,
    }

    constructor(props) {
        super(props)

        this.state = {
            length: 1
        };
    }

    componentDidMount() {
        // this.props.onChange(this.props.name, this.props.value);
    }

    componentWillReceiveProps(nextProps) {
        // override state only if current props is empty but next props has value
        // if (!this.props.value && nextProps.value) {
        // 	this.props.onChange(this.props.name, nextProps.value);
        // 	this.setState({ value: nextProps.value });
        // }
    }

    clear = () => {
        this.props.onChange(this.props.name, '')
        this.setState({value: ''})
    }

    handleInputChange = (name, value) => {
        this.setState(() => {
            return {[name]: value}
        }, () => {
            this.handleChange()
        });
    }

    handleChange = () => {
        const offset = this.state.occurrence === 'biweek' ? 2 : 1
        const occurrence = this.state.occurrence === 'biweek' ? 'week' : this.state.occurrence

        const obj = {
            occurrence,
            offset,
            length: this.state.length,
        };

        this.props.onChange(this.props.name, obj)
    }

    generateOccurrence = () => {
        let occurrence = this.state.occurrence

        if (occurrence === 'biweek') {
            occurrence = 'forthnight'
        }

        // pluralize the string if more than 1 character
        if (this.state.length > 1) {
            occurrence = `${occurrence}s`
        }

        return occurrence
    }

    render() {
        const {
            label,
            name,
            options,
            wide
        } = this.props
        const wideClass = wide ? 'form-group-wide' : ''
        const {occurrence} = this.state

        return (
            <div className={`form-group ${wideClass} form-type-recurring ${this.props.addClass}`}>
                {label && <label className="form-label">{label}</label>}
                <div className="form-field-wrapper">
                    <Select name="occurrence"
                            placeholder="Repeat"
                            label="Repeat"
                            className="tooltips recurring"
                            options={options}
                            returnFields="value"
                            prepend={<i className="ion-android-sync"/>}
                            onChange={this.handleInputChange}/>

                    {this.state.occurrence && occurrence !== 'once' && occurrence !== 'allDay' && [
                        <span key="for" className="for">for</span>,
                        <TextInput key="length" name="length" value="2" onChange={this.handleInputChange}/>,
                        <span key="occurrence" className="occurrence">{this.generateOccurrence()}</span>,
                    ]}
                </div>
            </div>
        )
    }
}
