import {
    controller, httpGet, request
} from 'inversify-express-utils';
import { inject } from 'inversify';
import {
    ApiPath,
    ApiOperationGet,
} from 'swagger-express-ts';
import { Language } from '../models';
import { LanguageService } from '../services';
import TYPES from '../config/types';

@ApiPath({
    path: '/language',
    name: 'Languages',
    security: { JWTtoken: ['Authorization']}
})
@controller('/language', TYPES.AuthMiddleware)
export class LanguageController {

    constructor( @inject(TYPES.LanguageService) private languageService: LanguageService ) { }


    @ApiOperationGet({
        description: 'Get all languages',
        parameters: {},
        path: '/all',
        responses: {
            200: { description: 'Success', model: 'Language', type: 'array' },
            401: { description: 'Unauthorized' },
        }
    })
    @httpGet('/all')
    public getUserLanguages(): Promise<Language[]> {
        return this.languageService.getLanguages();
    }

    @ApiOperationGet({
        description: 'Get language by locale',
        parameters: {
            path: {
                locale: {
                    required: true,
                    type: 'string'
                }
            }
        },
        path: '/{locale}',
        responses: {
            200: { description: 'Success', model: 'Language' },
            401: { description: 'Unauthorized' },
            404: { description: 'No Language found' },
            400: { description: 'Bad income arguments (params)' }
        }
    })
    @httpGet('/:locale')
    public getLanguage(
        @request() { user, params }: any,
    ): Promise<Language> {
        return this.languageService.getLanguage(params.locale);
    }
}
