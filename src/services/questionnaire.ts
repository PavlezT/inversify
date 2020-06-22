import { injectable, inject } from 'inversify';
import { NotFoundError, BadRequestError } from 'restify-errors';
import { Questionnaire, QuestionnaireModel, QuestionsModel, OutcomeModel } from '../models';
import * as mongoose from 'mongoose';
import TYPES from '../config/types';
import { OutcomeService } from './outcome';

@injectable()
export class QuestionnaireService {

    constructor( @inject(TYPES.OutcomeService) private outcomeService: OutcomeService ){}

    public getQuestionnaires(): Promise<Questionnaire[]> {
        return QuestionnaireModel.find().select('id name session') as any;
    }

    public async getQuestionnaireBySession(sessionId: string, name ?: string): Promise<Questionnaire[]> {
        if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
            throw new BadRequestError('Bad income sessionId');
        }

        const search = {session: sessionId} as any;
        if (name) {
            search.name = name;
        }

        const q = await QuestionnaireModel.find(search).populate('questions');

        if (!q) {
            throw new NotFoundError('No questionnaire for this session');
        }

        return q;
    }

    public async getUserQuestionnaires({name, sessionId}: any): Promise<Questionnaire> {
        if (!name || !sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
            throw new BadRequestError('Invalid income data');
        }

        const q = await this.getQuestionnaireBySession(sessionId, name).catch(() => null);

        if (q && q.length > 0) {
            return q[0];
        }

        const questions = await QuestionsModel.findOne({name: name});

        const questionnaire = new QuestionnaireModel({name, session: sessionId, questions: questions.id });
        return questionnaire.save().then( que => {
            que.questions = questions;
            return que;
        });
    }

    public async getQuestionnaireById(id: string): Promise<Questionnaire> {
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError('Bad income sessionId');
        }

        const q = await QuestionnaireModel.findById(id).populate('questions');

        if (!q) {
            throw new NotFoundError('No questionnaire by this id');
        }

        return q;
    }

    public async updateQuestionnaire(id: string, body: any): Promise<Questionnaire> {
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError('Bad income id');
        }

        const questionnaire = await QuestionnaireModel.findById(id);

        if ( !questionnaire ) {
            throw new NotFoundError('Questionnaire not found');
        }

        const outcome = await this.outcomeService.calculate(id, body, questionnaire.name, questionnaire.label); // wait here is important
        await QuestionnaireModel.updateOne({_id: id}, {$set: {result: body}});
        
        return outcome;
    }

}
