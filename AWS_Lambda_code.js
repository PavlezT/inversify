console.log('Loading function');
// for local use (in cts_backend repo)
// const CalcFunctions = require('./src/utils/calcutation_questionnaries_to_outcome');

// for lambda usage
const CalcFunctions = require('./calculations');

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const calculate = ({results, name}, cb ) => {

        let calculated = {
            name: name || 'NoNameSelected',
            // questionnaire,
            // params: ['VAS', 'Score'],
            date: new Date(Date.now()),
            // points: []
        };

        if (name && (`calc${name.replace('-','_')}` in CalcFunctions) ) {
            calculated = { ...calculated, ...CalcFunctions[`calc${name.replace('-','_')}`](results)};
        }

        if (!calculated.points ) {
            return cb(new Error('No calcutaion form for this type of questionnarie'), null);
        }

        cb(null, calculated);
    }

    switch (event.httpMethod) {
        case 'GET':
            done(null, {message: 'Lambda is running'});
            break;
        case 'POST':
            calculate(JSON.parse(event.body), done);
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};
