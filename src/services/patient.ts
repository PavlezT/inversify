import { injectable } from 'inversify'; // inject
import { NotFoundError, BadRequestError, PreconditionFailedError } from 'restify-errors';
import { Patient, PatientModel, PatientSession as Session, PatientSessionModel as SessionModel } from '../models';
import * as mongoose from 'mongoose';

@injectable()
export class PatientService {

    public async getPatient({clinicId, patientId, birthYear}: any, {clinics}: any): Promise<Patient> {
        if ( (!patientId || !birthYear) &&
           ((clinicId && !mongoose.Types.ObjectId.isValid(clinicId)) || !clinicId)
        ) {
            throw new BadRequestError('Bad income data');
        }

        if ( !clinicId ) {
            clinicId = clinics[0];
        }

        const patients = await PatientModel.findOne({
            ID: patientId,
            // birthYear,
            clinic: clinicId
        }) as any;

        if (!patients ) { // || patients.length === 0) {
            throw new NotFoundError('Patient not found');
        }

       if (patients.birthYear !== birthYear) {
          throw new PreconditionFailedError('Incorrect birthDate for patient');
       }

        return patients;
    }

    public async getPatientById({id}: any): Promise<Patient> {
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError('Bad income data, or patientId is not ObjectId');
        }

        const patient = await PatientModel.findById(id);

        if (!patient) {
            throw new NotFoundError('Patient not found');
        }

        return patient;
    }

    public async getPatientByName({search, clinicId}: any): Promise<Patient[]> {
        if (!search || !clinicId || !mongoose.Types.ObjectId.isValid(clinicId)) {
            throw new BadRequestError('Bad income data');
        }

        let patients = null;

        try {
            patients = await PatientModel.find({
                $or: [
                    { firstname: { $regex : search}},
                    { lastname: { $regex : search}},
                    { ID: { $regex: search }}
                ],
                clinic: clinicId,
            }).select('id ID firstname lastname').limit(20)
        } catch (e) {
            throw new BadRequestError('Bad request data');
        }

        return patients;
    }

    public async getPatients(body, user: { id: number }, {clinicId}, {page}, limit ?: number, total = true): Promise<Patient[]> {
        if ( !clinicId || !mongoose.Types.ObjectId.isValid(clinicId) || (page && isNaN(parseInt(page, 10))) ) {
            throw new BadRequestError('Bad income data: no clinicId or page not a positive number');
        }

        const pageNumber = parseInt(page, 10);
        const ammount = (limit || 20 ) * (page && pageNumber > 0 ? pageNumber : 0);
        const search = {} as any;

        // tslint:disable-next-line:forin
        for (let item in body) {
            if ( !body[item]) {
                continue;
            }
            switch (item) {
                case 'matchString':
                    let name = [
                        // {
                        //     'firstname': {'$regex': body[item]},
                        // }, {
                        //     'lastname': {'$regex': body[item]},
                        // },
                        {
                            'ID': { '$regex' : body[item]}
                        }
                    ];

                    if ('$or' in search) {
                        search.$or.push(name[0]);
                        search.$or.push(name[1]);
                    } else {
                        search.$or = name;
                    }
                    break;
                case 'myPatients':
                    if (body.myPatients === true) {
                        search['session.therapist'] = mongoose.Types.ObjectId(user.id);
                    }
                    break;
                case 'joint':
                    let join = [{
                        'session.primaryArea': body[item]
                    }];
                    //  {
                    //     'session.otherAreas': body[item]
                    // }];

                    if ('$or' in search) {
                        search.$or.push(join[0]);
                        // search.$or.push(join[1]);
                    } else {
                        search.$or = join;
                    }
                    // "enum": ["knee","feet","ankle","back","hip"]
                    break;
                case 'pathology':
                    let pathology = [{
                        'session.pathology.primary.area': body[item]
                    }, {
                        'session.pathology.secondary.area': body[item]
                    }, {
                        'session.pathology.other': body[item]
                    }];

                    if ('$or' in search) {
                        search.$or.push(pathology[0]);
                        search.$or.push(pathology[1]);
                        search.$or.push(pathology[2]);
                    } else {
                        search.$or = pathology;
                    }

                    break;
                case 'activityStatus':
                    // search.
                    break;
                case 'suitability':
                    search['session.assessment.suitability'] = body[item];
                    break;
                case 'sessionNumber':
                    search['session.number'] = body.sessionNumber;
                    break;
            }
        }

        const results = await PatientModel.aggregate([
            {$match: {'clinic': mongoose.Types.ObjectId(clinicId)}},
            { '$lookup': {
                'as': 'session',
                'from': SessionModel.collection.name,
					 let : { patientId: '$_id'},
					 pipeline: [
						 { $match : { $expr: { $eq: ['$patient', '$$patientId']}} },
						 { $sort: { number: -1}},
						 { $limit: 1},
					 ],
              }
            },
            { $unwind: '$session'},
            { '$match': search },
            { $addFields : {
                id: '$_id',
                'session.id': '$session._id'
            }},
            { $sort: { 'session.state': 1, 'session.startDate': -1 }},
            { $skip: ammount },
            { $limit: limit || 20 }
        ]) as any;

        if (ammount === 0 && total) {
            const count = await PatientModel.aggregate([
                {$match: {'clinic': mongoose.Types.ObjectId(clinicId)}},
                { '$lookup': {
                    'as': 'session',
                    'from': SessionModel.collection.name,
                         let : { patientId: '$_id'},
                         pipeline: [
                             { $match : { $expr: { $eq: ['$patient', '$$patientId']}} },
                             { $sort: { number: -1}},
                             { $limit: 1},
                         ],
                  }
                },
                { $unwind: '$session'},
                { '$match': search },
                {
                    $count: "total"
                }
            ]);
            // TODO: temporary solution
            if ( count && count[0] && count[0].total && results.length) {
                results[0].totalCount = count[0].total;
            }
        }

        return results;
    }

    public async newPatient(payload: Patient): Promise<Patient> {
        const patient = new PatientModel(payload);
        await patient.save();
        return patient;
    }

    public updatePatient(id: string, patient: Patient): Promise<Patient> {
        return PatientModel.updateOne({_id: id}, { $set: patient }, { runValidators: true }) as any;
    }

//   public deletePatient(id: string): Promise<any> {
//     return new Promise<any>((resolve, reject) => {
//       this.mongoClient.remove('patient', id, (error, data: any) => {
//         resolve(data);
//       });
//     });
//   }
}
