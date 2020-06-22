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
import {Gait, Outcome } from '../models';
import { OutcomeService } from '../services';
import TYPES from '../config/types';

@ApiPath({
    path: '/outcome',
    name: 'Outcomes',
    security: { JWTtoken: ['Authorization']}
})
@controller('/outcome', TYPES.AuthMiddleware)
export class OutcomeController {

    constructor( @inject(TYPES.OutcomeService) private outcomeService: OutcomeService ) { }

    @ApiOperationGet({
        description: 'Get all outcomes',
        parameters: {},
        path: '/all',
        responses: {
            200: { description: 'Success', model: 'Outcome', type: 'array' },
            401: { description: 'Unauthorized' },
        }
    })
    @httpGet('/all')
    public getUserQuestionnairies(): Promise<Outcome[]> {
        return this.outcomeService.getOutcomes();
    }

    @ApiOperationPost({
        description: 'Get GAIT (sensor data) by external patient ID (&clinicId)',
        parameters: {
            body: {
                properties: {
                    ID: {
                        required: true,
                        type: 'string'
                    },
                    clinicId: {
                        required: true,
                        type: 'string'
                    }
                }
            }
        },
        path: '/gait',
        responses: {
            200: { description: 'Success', model: 'GAIT', type: 'array'},
            401: { description: 'Unauthorized' },
            400: { description: 'Bad income data' },
            404: { description: 'Not found any outcome for this patientId' },
        }
    })
    @httpPost('/gait')
    public getGAITByPatient(
        @requestBody() body: any
    ): Promise<Gait[]> {
        return this.outcomeService.getGAITByPatient(body);
    }

    @ApiOperationGet({
        description: 'Get questionnairy outcome by patientId',
        parameters: {
            path: {
                patientId: {
                    required: true,
                    type: 'string'
                },
                locale: {
                    required: false,
                    type: 'string'
                }
            }
        },
        path: '/history/{patientId}/{locale}',
        responses: {
            200: { description: 'Success', model: 'Outcome', type: 'array'},
            401: { description: 'Unauthorized' },
            400: { description: 'Bad income data' },
            404: { description: 'Not found any outcome for this sessionId' },
        }
    })
    @httpGet('/history/:patientId/:locale?')
    public getOutcomeByPatient(
        @request() { params }: any
    ): Promise<Outcome[]> {
        return this.outcomeService.getOutcomeByPatient(params.patientId);
    }

    @ApiOperationGet({
        description: 'Get recommended questionnairy outcome by sessionId',
        parameters: {
            path: {
                sessionId: {
                    required: true,
                    type: 'string'
                },
                locale: {
                    required: false,
                    type: 'string'
                }
            }
        },
        path: '/recommended/{sessionId}/{locale}',
        responses: {
            200: { description: 'Success', model: 'Outcome', type: 'array'},
            401: { description: 'Unauthorized' },
            400: { description: 'Bad income data' },
            404: { description: 'Not found any outcome for this sessionId' },
        }
    })
    @httpGet('/recommended/:sessionId/:locale?')
    public getRecommendedOutcomeBySession(
        @request() { params }: any
    ): Promise<Outcome[]> {
        return this.outcomeService.getRecommendedOutcomeBySession(params.sessionId, params.locale);
    }

    @ApiOperationGet({
        description: 'Get outcome by sessionId',
        parameters: {
            path: {
                sessionId: {
                    required: true,
                    type: 'string'
                }
            },
            query: {
                name: {
                    required: false,
                    type: 'string'
                }
            }
        },
        path: '/{sessionId}',
        responses: {
            200: { description: 'Success', model: 'Outcome', type: 'array' },
            401: { description: 'Unauthorized' },
            400: { description: 'Bad income data' },
            404: { description: 'Not found any outcome for this sessionId' },
        }
    })
    @httpGet('/:sessionId')
    public getOutcomeBySession(
        @request() { params, query }: any
    ): Promise<Outcome[]> {
        return this.outcomeService.getOutcomeBySession(params.sessionId, query.name);
    }
}
