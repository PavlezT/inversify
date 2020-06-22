const csv=require('csvtojson');
const { Client } = require('pg')
const client = new Client({
    host: 'fitbro-instrance.cutzvfmpwo8v.eu-west-3.rds.amazonaws.com',
    port: 5432,
    database: 'fitbro',
    user: 'fitbro_master',
    password: 'Fitbr0MasterKey'
});

const csvFilePath = __dirname + '/../../Downloads/gyms.csv';
const map = {
    'Name' : 'name',
    'Description':'description',
    'City': 'city',
    'Region_district':'region',
    'Address':'address',
    'Latitude(широта)':'latitude',
    'Longitude(довгота)':'longitude',


    'Status_id': 'statusid',
    'Min_time_cancel':'min_time_cancel',
    'Photos': 'photos',

    'Время роботи': 'work_time',
    'Contacts_name' : 'contacts_name',
    'Contacts_value' : 'contacts_value',
};

const status_map = {
    'Премиум': 1,
    '': 4,
    'Без статуса': 4,
    'Стандарт': 2,
    'Премиум, Стандарт': 3
  }

async function parse(filepath) {
    const jsonArray= await csv().fromFile(filepath);
    return jsonArray;
}

async function import_gyms(parsed_gyms) {
    const gyms = [];

    for (parsed_gym of parsed_gyms) {
        let temp = {};
        Object.keys(parsed_gym).map(key => {
            temp[map[key]] = parsed_gym[key];
        })

        let gym = {
            created_at: (new Date()).toISOString(),
            contacts: [],
            photos: [],
            statusid: status_map[temp.statusid],
        }

        if (temp.work_time && temp.work_time !== 'Неизвестно') {
            gym.contacts.push({
                name: 'Години роботи',
                value: temp.work_time
            })
        }

        if (temp.contacts_name) {

            if (temp.contacts_name === 'Сайт') {
                temp.contacts_name = 'Веб-сайт'
            }
            gym.contacts.push({
                name: temp.contacts_name,
                value: temp.contacts_value
            })
        }

        if (temp.photos) {
            gym.photos.push({
                url: temp.photos,
                description: 'auto import',
                external: true,
            })
        }

        if (temp.min_time_cancel) {
            gym.min_time_cancel = temp.min_time_cancel;
        }

        delete temp.work_time;
        delete temp.contacts_name;
        delete temp.contacts_value;
        delete temp.photos;
        delete temp.min_time_cancel;
        delete temp.statusid;

        gym = Object.assign(gym, temp);

        // console.log('gym:', gym);

        if (temp.name) {
            gyms.push(gym);
        } else {
            try {
                if (gym.contacts.length)
                    gyms[gyms.length-1].contacts.push(...gym.contacts);
                if (gym.photos.length)
                    gyms[gyms.length-1].photos.push(...gym.photos);

                gyms[gyms.length-1].contacts = gyms[gyms.length-1].contacts.sort((contact_a, b) => {
                    if (contact_a.name === b.name){ //'Години роботи' && b.name === 'Години роботи') {
                        return 0;
                    } else if (contact_a.name === 'Години роботи') {
                        return -1;
                    } else {
                        return 1;
                    }
                })
            } catch(e) {
                console.log('gyms:', gym);
                console.log('error:', e);
            }
        }
    }

    console.log('items: ' + parsed_gyms.length +' gyms: '+gyms.length);
    // gyms.length = 3;
    const values_key = ["statusid", 'longitude','latitude', 'min_time_cancel', "photos", "description", "created_at", "city", "region", "address", "name", "contacts"];
    let values = '';

    gyms.map( (gym) => {
        values += '\n(';
        values_key.map((key, index) => {
            let str = `${gym[key]}`;
            let includes = str.includes("'");
            if (typeof str === 'string' && includes) {
                str = str.replace(/'/gi,"`");
                
            }

            let value = index <= 3 ? parseFloat(gym[key]) : `'${str}'`;

            if (gym[key] && typeof gym[key] === 'object') {
                value = "'"+JSON.stringify(gym[key])+"'";
            }

            if (!gym[key]) {
                value = 'NULL';
            }
            
            values += value +',';
        })

        values = values.substring(0, values.length -1) + '),';
    })

    values = values.substring(0, values.length -1);

    const query = `INSERT INTO public.gyms(
        statusid, longitude, latitude, min_time_cancel, photos, description, created_at, city, region, address, name, contacts)
        VALUES 
        ${values}
        ON CONFLICT DO NOTHING;`;

    console.log('query:', query);
    await client.connect();
    const res = await client.query(query);
    console.log(res);
    await client.end();
}


(async function () {
    try { 
    await import_gyms(await parse(csvFilePath));
    } catch(e) {
        console.log('Error:', e);
        process.exit(1);
    }
})();
