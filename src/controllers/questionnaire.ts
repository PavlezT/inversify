import {
    controller, httpGet, request, requestBody, httpPut, httpPost
} from 'inversify-express-utils';
import { inject } from 'inversify';
import {
    ApiPath,
    ApiOperationGet,
    ApiOperationPut,
    ApiOperationPost,
} from 'swagger-express-ts';
import { Questionnaire } from '../models';
import { QuestionnaireService } from '../services';
import TYPES from '../config/types';

@ApiPath({
    path: '/questionnaire',
    name: 'Questionnaires',
    security: { JWTtoken: ['Authorization']}
})
@controller('/questionnaire', TYPES.AuthMiddleware)
export class QuestionnaireController {

    constructor( @inject(TYPES.QuestionnaireService) private questionnaireService: QuestionnaireService ) { }

    @ApiOperationGet({
        description: 'Get all questionnaires',
        parameters: {},
        path: '/all',
        responses: {
            200: { description: 'Success', model: 'Questionnaire', type: 'array' },
            401: { description: 'Unauthorized' },
        }
    })
    @httpGet('/all')
    public getUserQuestionnairies(): Promise<Questionnaire[]> {
        return this.questionnaireService.getQuestionnaires();
    }

    @ApiOperationGet({
        description: 'Get questionnairy by id',
        parameters: {
            path: {
                id: {
                    required: true,
                    type: 'string'
                }
            }
        },
        path: '/one/{id}',
        responses: {
            200: { description: 'Success', model: 'Questionnaire' },
            401: { description: 'Unauthorized' },
            400: { description: 'Bad income data' },
            404: { description: 'Not found any questionnaire for this sessionId' },
        }
    })
    @httpGet('/one/:id')
    public getQuestionnaireById(
        @request() { params }: any
    ): Promise<Questionnaire> {
        return this.questionnaireService.getQuestionnaireById(params.id);
    }

    @ApiOperationGet({
        description: 'Get questionnairy for session by sessionId',
        parameters: {
            path: {
                sessionId: {
                    required: true,
                    type: 'string'
                },
                name: {
                    required: false,
                    type: 'string'
                }
            }
        },
        path: '/{sessionId}/{name}',
        responses: {
            200: { description: 'Success', model: 'Questionnaire' },
            401: { description: 'Unauthorized' },
            400: { description: 'Bad income data' },
            404: { description: 'Not found any questionnaire for this sessionId' },
        }
    })
    @httpGet('/:sessionId/:name?')
    public getQuestionnaireBySession(
        @request() { params }: any
    ): Promise<Questionnaire[]> {
        return this.questionnaireService.getQuestionnaireBySession(params.sessionId, params.name);
    }

    @ApiOperationPost({
        description: 'Get questionnairy (create new questionary for user/patient)',
        parameters: {
            body: {
                properties: {
                    name: {
                        required: true,
                        type: 'string'
                    },
                    sessionId: {
                        required: true,
                        type: 'string'
                    }
                }
            }
        },
        path: '/',
        responses: {
            200: { description: 'Success', model: 'Questionnaire' },
            401: { description: 'Unauthorized' },
        }
    })
    @httpPost('/', TYPES.DBLogger)
    public getUserQuestionnairy(
        @requestBody() body: any
    ): Promise<Questionnaire> {
        return this.questionnaireService.getUserQuestionnaires(body);
    }

    @ApiOperationPut({
        description: 'Update results of questionnaire by id',
        parameters: {
            path: {
                questionnaryId: {
                    required: true,
                    type: 'string'
                }
            },
            body: {
                properties: {
                    any: { 
                        required: false,
                        type: 'object'
                    }
                }
            }
        },
        path: '/{questionnaryId}',
        responses: {
            200: { description: 'Success', model: 'Outcome' },
            401: { description: 'Unauthorized' },
            404: { description: 'No Questionnaire found' },
            400: { description: 'Bad income arguments (params)' },
            412: { description: 'Failed to calculate data outcome'}
        }
    })
    @httpPut('/:id', TYPES.DBLogger)
    public updateQuestionnaire(
        @request() { params }: any,
        @requestBody() body: any,
    ): Promise<Questionnaire> {
        return this.questionnaireService.updateQuestionnaire(params.id, body);
    }
}
