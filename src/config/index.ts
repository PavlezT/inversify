import * as development from './development.json';
import * as production from './production.json';
import * as test from './test.json';

const DEFAULT = 'development';

const configs = {
	development,
	production,
	test,
};

export default {
	...configs[process.env.NODE_ENV || DEFAULT],
	name: process.env.NODE_ENV || DEFAULT,
	swagger: process.env.SWAGGER || false
};
