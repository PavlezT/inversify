import { injectable } from 'inversify';
import { NotFoundError, BadRequestError } from 'restify-errors';
import { Language, LanguageModel } from '../models';

@injectable()
export class LanguageService {
    public async getLanguage(locale: string): Promise<Language> {
        if (!locale ) {
            throw new BadRequestError('Bad income data');
        }

        const language = await LanguageModel.findOne({locale}) as any;

        if (!language) {
            throw new NotFoundError('Language not found');
        }

        return language;
    }

    public getLanguages(): Promise<Language[]> {
        return LanguageModel.find().select('id locale name') as any;
    }
}
