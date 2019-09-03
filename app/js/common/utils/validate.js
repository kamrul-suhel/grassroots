import { fn } from './';

const validateField = (object, rule, key, label, error) => {
	return rule.split('|').map((ruleCase) => {
		const value = object[key];
		const newLabel = label ? label : key;

		// empty validation
		if (ruleCase === 'required') {
			if (!value) {
				error.push(`${fn.slugToReadableString(newLabel)} is required`);
				return false;
			}
		}

		if (value === undefined || value === null) {
			return false;
		}

		// integer validation
		if (ruleCase === 'integer') {
			if (_.isNaN(parseInt(value))) {
				error.push(`${fn.slugToReadableString(newLabel)} must be number`);
				return false;
			}
		}

		// string validation
		if (ruleCase === 'string') {
			if (!_.isString(value)) {
				error.push(`${fn.slugToReadableString(newLabel)} must be string`);
				return false;
			}
		}

		// min value validation
		if (ruleCase.indexOf('min:') !== -1) {
			const minValue = ruleCase.replace('min:', '');
			if (parseInt(value) < parseInt(minValue)) {
				error.push(`${fn.slugToReadableString(newLabel)} cannot be smaller than ${minValue}`);
				return false;
			}
		}

		// max value validation
		if (ruleCase.indexOf('max:') !== -1) {
			const maxValue = ruleCase.replace('max:', '');
			if (parseInt(value) > parseInt(maxValue)) {
				error.push(`${fn.slugToReadableString(newLabel)} cannot be greater than ${maxValue}`);
				return false;
			}
		}
	});
}

const validate = (object, rules) => {
	fn.hideAlert();
	const error = [];

	_.map(rules, (val, key) => {
		// validate object
		if (_.isPlainObject(val)) {
			return _.map(val, (subVal, subKey) => {
				const label = `${key} ${subKey}`;
				return validateField(object[key], subVal, subKey, label, error);
			});
		}

		return validateField(object, val, key, false, error);
	});

	if (error.length > 0) {
		fn.showAlert(error, 'error');
		return false;
	}

	return true;
};

export default validate;
