const mongoose = require('mongoose');
import config from './src/config';
const fs = require('fs');
const {user, password, url, ssl} = config.DB;

let uri = `mongodb+srv://${user && password ? user + ':' + password + '@' : ''}${url}?retryWrites=true`;

var ca = [fs.readFileSync("./rds-combined-ca-bundle.pem")];

let connection = null;

async function connect() {
	let options = {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false} as any;

	if (!user)// 'dev' env
		uri = uri.replace('mongodb+srv', 'mongodb');

	if (ssl === true) {
		uri+='&ssl=true&replicaSet=rs0';
		options.sslValidate = true;
		options.sslCA = ca;
	}

	connection = await mongoose.connect(uri, options);
	if(connection) {
		console.log('connected to DB: ' + uri);
	}
	return connection;
}

function stop() {
	if (connection) {
		return connection.close();
	}
}

export default {
	connect,
	stop
};
