import { injectable } from 'inversify'; // inject
import { NotFoundError, BadRequestError, UnprocessableEntityError, PreconditionFailedError } from 'restify-errors';
import {
    PatientSession as Session,
    PatientSessionModel as SessionModel,
    PatientModel,
    Equipment,
    EquipmentModel,
    User,
    QrLinkerModel,
    TerritoryModel,
    QuestionnaireModel,
} from '../models';
import * as mongoose from 'mongoose';
import { IToken } from './auth';
import * as jwt from 'jsonwebtoken';
import config from '../config';

@injectable()
export class SessionService {

    public async getSession({patientId}: any): Promise<Session[]> {
        if (
           ((patientId && !mongoose.Types.ObjectId.isValid(patientId)) || !patientId)
        ) {
            throw new BadRequestError('Bad income data');
        }

        const sessions = await SessionModel.find({
            'patient': patientId,
        })
        .select('id patient number pathology primaryArea otherAreas startDate')
        .sort({number: 'DESC'})
        .limit(10) as any;

        if (!sessions ) {
            throw new NotFoundError('Session not found');
        }

        return sessions;
    }

    public async getSessionById({sessionId}: any, select ?: string): Promise<Session> {
        if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
            throw new BadRequestError('Bad income data');
        }

        const sessions = await SessionModel.findById(sessionId).select(select) as any;

        if (!sessions ) {
            throw new NotFoundError('Session not found');
        }

        return sessions;
    }

    public async getOtherList({patientId, sessionId}, {select}): Promise<Session[]> {
        if (!patientId || !mongoose.Types.ObjectId.isValid(patientId)) {
            throw new BadRequestError('Bad income data');
        }

        const search = { patient: patientId } as any;

        if (sessionId) {
            const temp = await this.getSessionById({sessionId}, 'startDate'); // will check on sessionId validity
            search.startDate = { $gte: temp.startDate };
        }

        let projection = 'id startDate ' + (select 
            ? select.replace(/,/g,' ')
            : 'additionalTreatments pathology weight recommendation assessment paymentType equipmentProvided therapist insurer bmi'
        );

        return SessionModel.find(search).select(projection).populate('therapist', 'firstname lastname email').sort({startDate: 'DESC'});
    }

    public async getEquipmentHistory({patientId}): Promise<Equipment[]> {
        if (!patientId || !mongoose.Types.ObjectId.isValid(patientId)) {
            throw new BadRequestError('Bad income data');
        }

        const sessions = await SessionModel.find({patient: patientId}).select('id equipment startDate').populate('equipment');

        const equipments = sessions.map(s => { 
           if (s.equipment) {
               let temp = (s.equipment as any).toJSON();
               temp.startDate = s.startDate;
               return temp;
           } 
           return null;
        }).filter(e => e);
       
        return equipments as any;
    }

    public async getEquipmentSession({sessionId}): Promise<Equipment> {
        if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
            throw new BadRequestError('Bad income data');
        }

        const session = await SessionModel.findById(sessionId).select('id equipment').populate('equipment');

        if (!session || !session.equipment) {
            throw new NotFoundError('Session not found or there is no equipment for it');
        }

        return session.equipment as Equipment;
    }

    public getSessions({clinicId, state}, {page}): Promise<Session[]> {
        if ( !clinicId || !mongoose.Types.ObjectId.isValid(clinicId) || (page && isNaN(parseInt(page, 10))) ) {
            throw new BadRequestError('No clinicId provided or It is malformed, or page is not a number');
        }

        const search = {...state ? {state} : {}, ...{ 'patient.clinic' : mongoose.Types.ObjectId(clinicId)}};
        const pageNumber = parseInt(page, 10);
        const ammount = 20 * (page && pageNumber > 0 ? pageNumber : 0);

        return SessionModel.aggregate([
            { '$lookup': {
                'from': PatientModel.collection.name,
                'localField': 'patient',
                'foreignField': '_id',
                'as': 'patient'
              },
			},
			{ '$lookup': {
					'from': EquipmentModel.collection.name,
					'localField': 'equipment',
					'foreignField': '_id',
					'as': 'equipment'
			    },
			},
			{ $unwind: '$patient'},
			{ $unwind: { path: '$equipment', preserveNullAndEmptyArrays: true}},
            { '$match': search },
            { $addFields: {
					'id': '$_id',
					'patient.id': '$patient._id',
                }
            },
            { $sort: {startDate: -1}},
            { $skip: ammount },
            { $limit: 20}
        ]) as any;
    }

    public async startSession(payload: Session, user: any): Promise<Session> {
        if ( !payload.patient || !mongoose.Types.ObjectId.isValid(payload.patient as any)) {
            throw new BadRequestError('Bad income data');
        }

        const prevSession = await SessionModel.findOne({patient: payload.patient}).sort({number: 'DESC'});
        
        const nextNumber = prevSession ? prevSession.number + 1 : 1;

        if (prevSession && prevSession.state === 'in') {
            const err = new PreconditionFailedError('Check in session for this patient is already opened') as any;
            err.message = prevSession;
            throw err;
        }

        const session = new SessionModel({
            number: nextNumber,
            patient: payload.patient,
            type: payload.type || (nextNumber > 1 ? 'followup' : 'initial'),
            primaryArea: payload.primaryArea || prevSession.primaryArea,
            otherAreas: payload.otherAreas || prevSession.otherAreas || [],
            // copy from prev session
            // linked items (ObjectId)
            therapist: prevSession ? prevSession.therapist : null,
            equipment: prevSession ? prevSession.equipment : null,
            treatment: prevSession ? prevSession.treatment : null,
            // copied as values
            additionalTreatments: prevSession ? prevSession.additionalTreatments : [],
            pathology: prevSession ? prevSession.pathology : null,
            weight: prevSession ? prevSession.weight : null,
            hearOfApos: prevSession ? prevSession.hearOfApos : null,
            paymentType: prevSession ? prevSession.paymentType : null,
            packageType: prevSession ? prevSession.packageType : null,
            recommendation: prevSession ? prevSession.recommendation : null,
            assessment: prevSession ? prevSession.assessment : null,
        });

        session.recommendedQuestionnaires = await this.getQCurrentSession(session, session.patient);

        await session.save();
        return session;
    }

    public async setEquipment(sessionId: string, eq: Equipment, user: User): Promise<Session> {
        if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
            throw new BadRequestError('Bad income data');
        }

        const session = await SessionModel.findById(sessionId).select('patient equipment');
        let equipment:any = session.equipment as any;

        try {
            if (!equipment) {
                equipment = (await (new EquipmentModel(eq)).save() as any).id as any;
            } else {
                await EquipmentModel.updateOne({_id: equipment}, eq, { runValidators: true });
            }
            await PatientModel.updateOne({_id: session.patient}, { $set: { state: 'active'}}); // set that patient is active because he has equipment
        } catch (e) {
            console.log('[Session] setEquipment error:', e);
            throw new BadRequestError('Bad equipment data');
        }
        // set therapist to the patient because he gave him equipment
        return SessionModel.findByIdAndUpdate(sessionId, { equipment: equipment, therapist: user.id});
    }

    public async updateSession(id: string, session: Session): Promise<Session> {
        try {
            return await SessionModel.findByIdAndUpdate({_id: id}, { $set: session }, { runValidators: true, new: true }) as any;
        } catch (e) {
            throw Object.assign(new BadRequestError(), e); // nice))
        }
    }

    public async getQrBySession({sessionId}): Promise<IToken> {
        if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
            throw new BadRequestError('Bad income data');
        }

        const session = await SessionModel.findById(sessionId).select('id patient state');

        if (!session || session.state === 'out') {
            throw new NotFoundError('Session not found or state is not checked in');
        }

        let qr = await QrLinkerModel.findOne({session: sessionId});

        if (qr && qr.expiryDate <= (new Date(Date.now()))) {
            await QrLinkerModel.deleteOne({_id: qr.id});
            qr = null;
        }

        if (!qr ) {
            try {
                const expiry = 1000 * 60 * 60 * 24;
                const token = jwt.sign({
                    id: sessionId
                }, config.AUTH.secret, { expiresIn: expiry/1000 });

                qr = await new QrLinkerModel({
                    session: sessionId,
                    patient: session.patient,
                    token,
                    expiryDate: new Date(Date.now() + expiry)
                }).save(); 
            } catch(e) {
                throw new UnprocessableEntityError('Not possible to generate token or save token to DB');
            }
        }

        return { token: qr.token };
    }

    public async isEditable(id: string): Promise<any> {
        const session = await SessionModel.findById(id).select('id startDate endDate');
        const date = new Date(Date.now() - 1000 * 60 * 60 * 12); // 12 hours from now

        if (!session || session.endDate && (new Date(session.endDate)) <= date) { // if session was ended more than 12 hours ago
            throw new UnprocessableEntityError('Session is locked');
        }

        return null;
    }

//   public deleteSession(id: string): Promise<any> {
//     return new Promise<any>((resolve, reject) => {
//       this.mongoClient.remove('session', id, (error, data: any) => {
//         resolve(data);
//       });
//     });
//   }

    private async getQCurrentSession(session, patient): Promise<string[]> {
        let questions: Promise<string[]> = Promise.resolve([]);

        try {
            let [{clinic}, sessions] = await Promise.all([
                PatientModel.findById(patient).populate('clinic', 'profile territory').select('clinic'),
                SessionModel.find({patient: patient})
                    .select('id patient startDate')
                    .sort({startDate: 'desc'})
                    .limit(100) // all user sessions to get history of questionnaries
            ]);

            sessions = sessions.map( s => s.id );		

            questions = (clinic as any).profile === 'requirements'
                ? this.getQforMinRequirements(sessions)
                : this.getQforCompliance(session, sessions); // , clinic
        } catch(e) {
            console.log(`[Error] getQCurrentSession for session: ${patient} ;`, e)
        }

        return questions;
    }

    private async getQforCompliance(session, sessions) { // , clinic
        const search = [ 'SF-36' ];
        // const territory = (await TerritoryModel.findById(clinic.territory).select('isUK')) || {} as any;
        // const {isUK: isUKterritory} = territory;

        if (session.type === 'initial') {
            search.push(...(await this.getQforComplianceInitial(session)))//, isUKterritory)))
        } else {
            search.push(...(await this.getQforComplianceFU(session, sessions)))//, isUKterritory)))
        }

        return search;
    }

    private async getQforComplianceInitial({primaryArea, otherAreas}) { // , isUKterritory
        let matchingMap = {
            'WOMAC': ['Knee', 'Hip', 'Lower back', 'Upper back', 'Other'],
            'FAOS': ['Foot & ankle'],
            'Oswestry': ['Lower back', 'Upper back'],
            // manual select - now not required
            // 'Satisfaction-IC': [], 
            // 'KOOS': [],
        }

        // if (isUKterritory) {
        //     matchingMap = {...matchingMap, ...{
        //         'OXFORD-HIP': ['Hip'],
        //         'OXFORD-KNEE':['Knee'],
        //         'ED-5D': ['Knee', 'Hip', 'Lower back', 'Upper back', 'Other'],
        //     }};
        // }

        const search = ['STEADI'];

        Object.keys(matchingMap).map( name => {
            if (
                matchingMap[name].includes(primaryArea) ||
                otherAreas.some( area => matchingMap[name].includes(area) )
            )
                search.push(name);
        })

        return search;
    }

    private async getQforComplianceFU({primaryArea, otherAreas, patient}, sessions) { // , isUKterritory
        let matchingMap = {
            'WOMAC': ['Knee', 'Hip', 'Lower back', 'Upper back', 'Other'],
            'FAOS': ['Foot & ankle'],
            'Oswestry': ['Lower back', 'Upper back'],
            // manual select - now not required
            // 'KOOS': [],
        }

        let timeFrames = {
            'STEADI': 316, // days
            // 'Satisfaction-NHS': 316,
            // 'Satisfaction-FU': 136, // days
            // 'Family-friends': 136,
        }

        // if (isUKterritory) {
        //     matchingMap = {...matchingMap, ...{
        //         'OXFORD-HIP': ['Hip'], // 136, 316, 647, 1004
        //         'OXFORD-KNEE':['Knee'], // 136, 316, 647, 1004
        //         'ED-5D': ['Knee', 'Hip'], // 136, 316, 647, 1004
        //     }};

        //     timeFrames = {...timeFrames, ...{
        //         'OXFORD-HIP': 136,
        //         'OXFORD-KNEE': 136,
        //         'ED-5D': 136,
        //     }}
        // }

        const now = new Date(Date.now()) as any;
        const search = ['STEADI']//, 'Satisfaction-NHS', 'Satisfaction-FU', 'Family-friends']; // default questions

        Object.keys(matchingMap).map( name => {
            if (
                matchingMap[name].includes(primaryArea) ||
                otherAreas.some( area => matchingMap[name].includes(area) )
            )
                search.push(name);
        })
        // check if some of questions are time specific 
        const timePassed = search.filter( name => name in timeFrames);
        // get dates of filling questionarries last time
        const /*[{startDate}, ...dates]*/ dates = await Promise.all([
            // Session.findOne({patient, type: 'initial', number: 1}).select('startDate'),
            ...timePassed.map( name => getDateLastQ(name, sessions))
        ]).catch(console.log.bind(null, '[Questionnaire] getQCurrentSession -> Promise[getDateLastQ] error:'))

        return search.filter( name => {
            if (timePassed.includes(name) && dates && dates[timePassed.indexOf(name)] &&
                ((now - dates[timePassed.indexOf(name)])/1000/60/60/24/timeFrames[name]) < 1
            ) {
                return false; // delete from list of recommended questions
            }

            return true;
        })
    }

    private async getQforMinRequirements(sessions) {
        const search = ['AposShortForm'];
        const now = new Date(Date.now()) as any;
        const steadyDate = await getDateLastQ('STEADI', sessions);

        if (!steadyDate || ((now - steadyDate)/1000/60/60/24/365) >= 1) { // on IC (first time) and every year
            search.push('STEADI');
        }
        
        return search;
    }
}

async function getDateLastQ(name, sessions): Promise<any> {
    const q = await QuestionnaireModel
                        .find({session: { $in: sessions }, name})
                        .select('id name fillDate')
                        .sort({fillDate: 'desc'})
                        .limit(1);
    
    return q && q.length ? q[0].fillDate : null;
}
