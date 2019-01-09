module.exports = {
	extends: 'eslint:recommended',
	rules: {
		'quotes': [1, 'single'],
		'curly': [1, 'multi-line'],
		'no-extra-parens': 1,
		'key-spacing': [1, {
			'beforeColon': false,
			'afterColon': true,
			'mode': 'strict'
		}],
		'no-multi-spaces': 1,
		'dot-location': [1, 'property'],
		'max-len': [1, { 'code': 80, 'tabWidth': 2 }],
		'no-trailing-spaces': 1,
		'indent': [1, 'tab'],
		'no-empty-function': 2,
		'eol-last': [2, 'always'],
		'semi': [2, 'always'],
		'no-multiple-empty-lines': 2,
		'no-undef': 0
	}
};