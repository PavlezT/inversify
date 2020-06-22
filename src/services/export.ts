import { Transform } from 'json2csv';
import { injectable, inject } from 'inversify';
import { Patient } from '../models';
import { PatientService } from './patient';
import TYPES from '../config/types';
const { Readable } = require('stream');

@injectable()
export class ExportService {
    constructor( @inject(TYPES.PatientService) private patientService: PatientService ) { }

    public async getPatients(params, response): Promise<any> {
        const input = new Readable({ objectMode: true });
        input._read = () => {};

        const opts = { fields: ['ID', 'birthYear', 'state', 'firstname', 'lastname', 
            {
                label: 'sessionNumber',
                value: 'session.number',
                default: 'NULL'
            },
            {
                label: 'lastSessionDate',
                value: 'session.startDate',
                default: 'NULL'
            }
        ]};
        const transformOpts = { objectMode: true };
     
        const json2csv = new Transform(opts, transformOpts);

        // use if browser automatically download file
        response.writeHead(200, {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": "attachment; filename=" + `patients_for_clinic${params.clinicId}.csv`
        });

        input.pipe(json2csv).pipe(response);
        await this.loadPatients(input, params, 0);
    }

    private async loadPatients(input, params, page): Promise<any> {
        const limit = 200;
        
        const patients: Patient[] = await this.patientService.getPatients({}, {id: null}, params, {page}, limit, false)
            .catch(err => {
                console.log('[Export] loadPatients error:', err);
                return [];
            })
        console.log('[First patient] of patients:', patients[0])

        patients.map(p => input.push(p))

        if (!patients.length || patients.length < limit) {
            input.push(null);
            return;
        } 

        return this.loadPatients(input, params, ++page);
    }
}