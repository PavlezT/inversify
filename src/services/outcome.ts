import { injectable, inject } from 'inversify';
import { NotFoundError, BadRequestError, PreconditionFailedError, InternalServerError } from 'restify-errors';
import { Gait, GaitModel, Outcome, OutcomeModel, QuestionnaireModel, PatientSessionModel as SessionModel, QuestionsModel } from '../models';
import * as mongoose from 'mongoose';
import axios from 'axios';
import config from '../config';

@injectable()
export class OutcomeService {
    // constructor(@inject(TYPES.QuestionnaireService) private questionnaireService: QuestionnaireService ) {}

    public getOutcomes(): Promise<Outcome[]> {
        return OutcomeModel.find() as any;
    }

    public async getOutcomeBySession(sessionId: string, name ?: string): Promise<Outcome[]> {
        console.log('sessionId:', sessionId)
        if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
            throw new BadRequestError('Bad income sessionId');
        }

        const questionnaires = await QuestionnaireModel.find({ session: sessionId }).select('id');

        if ( !questionnaires || questionnaires.length === 0) {
            throw new NotFoundError('Not questionnaires find for this session');
        }

        const search = { questionnaire: { $in: questionnaires.map( q => q.id )}} as any;

        if (name) {
            search.name = name;
        }

        let outcome = null;
        try{
            outcome = await OutcomeModel.find(search);
        } catch (e) {
            throw new InternalServerError('Internal Server Error');
        }
        return outcome;
    }

    public async getOutcomeByPatient(patientId: string, locale ?: string): Promise<Outcome[]> {
        if (!patientId || !mongoose.Types.ObjectId.isValid(patientId)) {
            throw new BadRequestError('Bad income patientId');
        }

        const sessions = await SessionModel
            .find({ 'patient': patientId })
            .select('id') // recommendedQuestionnaires
            .sort({startDate: -1})
            .limit(100);

        if ( !sessions || sessions.length === 0) {
            throw new NotFoundError('Not sessions find for this patient');
        }

        const questionnaires = await QuestionnaireModel.find({ session: { $in: sessions.map( s => s.id)} }).select('id');
        
        let outcome = [];

        if ( questionnaires && questionnaires.length > 0) {
            const search = { questionnaire: { $in: questionnaires.map( q => q.id )}} as any;

            try {
                outcome = await OutcomeModel.find(search);
            } catch (e) {
                throw new InternalServerError('Internal Server Error: Outcome is unreachable');
            }
        }
        // mock not filled questionnaries for DataOutcome
        // for (const qName of (sessions[0].recommendedQuestionnaires || [])) {
        //     if (!outcome.find( item => item.name === qName)) {
        //         let mock = {
        //             name: qName,
        //             label: qName,
        //             type: 'bar',
        //             params: [],
        //             points: [],
        //         };

        //         const q = await QuestionsModel.findOne({name: qName, locale: locale || 'us-us'})
        //         mock.label = q ? q.label : qName;

        //         outcome.push(mock);
        //     }
        // }

        return outcome;
    }

    public async getRecommendedOutcomeBySession(sessionId, locale ?: string): Promise<any> {
        if ( !sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
            throw new BadRequestError('Bad income patientId');
        }
    
        const defaultQ = [{name:'Gait', label:'Gait'}, {name:'Sensor', label:'Sensor'}];
        const session = await SessionModel.findById(sessionId).select('recommendedQuestionnaires');

        if (!session || !session.recommendedQuestionnaires) {
            return defaultQ;
        }
        
        const questions = await QuestionsModel.find({name: {$in: session.recommendedQuestionnaires }, locale: locale || 'us-us'}).select('name label');

        return [...questions, ...defaultQ];
    }

    public async getGAITByPatient({ID, clinicId}): Promise<Gait[]> {
        if (!ID || !clinicId || !mongoose.Types.ObjectId.isValid(clinicId)) {
            throw new BadRequestError('Bad income patientId');
        }
        let gait = null;
        try {
            gait = await GaitModel.find({ ID, clinicId }).select('ID clinicId GaitTestType TestDate createdAt Velocity StepLen_L StepLen_R SSuppTime_L SSuppTime_R');
        } catch(e) {
            throw new InternalServerError('Internal Server Error: Gait is unreachable');
        }

        return gait;
    }

    public async calculate(questionnaire: string, result: any, name ?: string, label ?: string): Promise<any> {
        const calculated = await this.sendToCalcDataOutcome(result, name);

        if ( !calculated ) {
            throw new PreconditionFailedError('Questionnaire not found');
        }

        calculated.questionnaire = questionnaire;
        calculated.label = label;

        let outcome = (await OutcomeModel.findOne({ questionnaire, name: calculated.name })) as any;

        if ( !outcome ) {
            outcome = (new OutcomeModel(calculated)) as any;
            await outcome.save();
        } else {
            await OutcomeModel.updateOne({_id: outcome.id}, calculated);
        }

        return calculated;
    }

    private async sendToCalcDataOutcome(result, name) {
        const data =  {
			results: result,
            name: name
		}

		return axios.post(
			config.LAMBDA.url,
			JSON.stringify(data),
			{headers: {'x-api-key' : config.LAMBDA.key}}
		)
		.then(response => response && response.data)
		.catch(error => {
			console.log('[Questionnaire] sendToCalcDataOutcome error:', error);
			return null;
		})
    }
}
