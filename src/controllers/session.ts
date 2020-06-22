import {
    controller, httpGet, httpPost, httpPut, //  httpDelete
    requestBody, request
} from 'inversify-express-utils';
import { inject } from 'inversify';
import {
    ApiPath,
    ApiOperationGet,
    ApiOperationPut,
    ApiOperationPost
} from 'swagger-express-ts';
// import { Request } from 'express'; // Response
import { PatientSession as Session, Equipment } from '../models';
import { SessionService } from '../services/session';
import TYPES from '../config/types';
import { IToken } from '../services';

@ApiPath({
    path: '/session',
    name: 'Session',
    security: { JWTtoken: ['Authorization']}
})
@controller('/session', TYPES.AuthMiddleware)
export class SessionController {

    constructor( @inject(TYPES.SessionService) private sessionService: SessionService ) { }

    @ApiOperationGet({
        description: 'Get session information',
        parameters: {
            path: {
                clinicId: {
                    required: true,
                    type: 'string'
                },
                sessionType: {
                    description: 'state of session: "in" or "out" or "incomplete"',
                    required: false,
                    type: 'string'
                },
            },
            query: {
                page: {
                    required: false,
                    type: 'number'
                }
            }
        },
        path: '/all/{clinicId}/{sessionType}',
        responses: {
            200: { description: 'Success', type: 'array', model: 'PatientSession'}, // , type: 'array'
            401: { description: 'Unauthorized' },
            // 404: { description: 'No Session found' },
            400: { description: 'Bad income arguments (params)' }
        }
    })
    @httpGet('/all/:clinicId/:state?')
    public getSessions(
        @request() { query, params }: any,
    ): Promise<Session[]> {
        return this.sessionService.getSessions(params, query);
    }

    @ApiOperationGet({
        description: 'Get patient session information',
        parameters: {
            path: {
                patientId: {
                    required: true,
                    type: 'string'
                }
            }
        },
        path: '/patient/{patientId}',
        responses: {
            200: { description: 'Success', type: 'array', model: 'PatientSession'}, // , type: 'array'
            401: { description: 'Unauthorized' },
            404: { description: 'No Session found' },
            400: { description: 'Bad income arguments (params)' }
        }
    })
    @httpGet('/patient/:patientId')
    public getPatientSession(
        @request() { query, params }: any,
    ): Promise<Session[]> {
        return this.sessionService.getSession(params);
    }

    @ApiOperationGet({
        description: 'Get patient pathologies and weight from sessions',
        parameters: {
            path: {
                patientId: {
                    required: true,
                    type: 'string'
                },
                sessionId: {
                    required: false,
                    type: 'string'
                }
            },
            query: {
                select: {
                    required: false,
                    type: 'string'
                }
            }
        },
        path: '/other/{patientId}/{sessionId}',
        responses: {
            200: { description: 'Success', model: 'Session', type: 'array' },
            401: { description: 'Unauthorized' },
            404: { description: 'No Session found' },
            400: { description: 'Bad income arguments (params)' }
        }
    })
    @httpGet('/other/:patientId/:sessionId?')
    public getOtherList(
        @request() { params, query }: any,
    ): Promise<Session[]> {
        return this.sessionService.getOtherList(params, query);
    }

    @ApiOperationGet({
        description: 'Get equipment session history',
        parameters: {
            path: {
                patientId: {
                    required: true,
                    type: 'string'
                }
            }
        },
        path: '/equipment/history/{patientId}',
        responses: {
            200: { description: 'Success', model: 'Equipment', type: 'array'},
            401: { description: 'Unauthorized' },
            404: { description: 'No Session found' },
            400: { description: 'Bad income arguments (params)' }
        }
    })
    @httpGet('/equipment/history/:patientId')
    public getEquipmentHistory(
        @request() { params }: any,
    ): Promise<Equipment[]> {
        return this.sessionService.getEquipmentHistory(params);
    }

    @ApiOperationGet({
        description: 'Get patient session information',
        parameters: {
            path: {
                sessionId: {
                    required: true,
                    type: 'string'
                }
            }
        },
        path: '/equipment/{sessionId}',
        responses: {
            200: { description: 'Success', model: 'Equipment'}, // , type: 'array'
            401: { description: 'Unauthorized' },
            404: { description: 'No Session found' },
            400: { description: 'Bad income arguments (params)' }
        }
    })
    @httpGet('/equipment/:sessionId')
    public getEquipmentSession(
        @request() { params }: any,
    ): Promise<Equipment> {
        return this.sessionService.getEquipmentSession(params);
    }

    @ApiOperationGet({
        description: 'Get patient qr code by sessionId',
        parameters: {
            path: {
                sessionId: {
                    required: true,
                    type: 'string'
                }
            }
        },
        path: '/qr/{sessionId}',
        responses: {
            200: { description: 'Success', type: 'string'}, // '{ "token":"e23234.sdfsdf.adsasd"}' },
            401: { description: 'Unauthorized' },
            404: { description: 'No Session found or state is not "in"' },
            400: { description: 'Bad income arguments (params)' },
            422: { description: 'Not possible to generate token or save token to DB' }
        }
    })
    @httpGet('/qr/:sessionId')
    public getQrBySession(
        @request() { params }: any,
    ): Promise<IToken> {
        return this.sessionService.getQrBySession(params);
    }

    @ApiOperationGet({
        description: 'Get patient session information',
        parameters: {
            path: {
                sessionId: {
                    required: true,
                    type: 'string'
                }
            }
        },
        path: '/{sessionId}',
        responses: {
            200: { description: 'Success', model: 'PatientSession'},
            401: { description: 'Unauthorized' },
            404: { description: 'No Session found' },
            400: { description: 'Bad income arguments (params)' }
        }
    })
    @httpGet('/:sessionId')
    public getPatientSessionById(
        @request() { params }: any,
    ): Promise<Session> {
        return this.sessionService.getSessionById(params);
    }

    @ApiOperationPost({
        description: 'start session',
        parameters: {
            body: {
               type: 'object',
               properties: {
                    primaryArea: {
                        required: false,
                        type: 'string'
                    },
                    otherAreas: {
                        required: false,
                        type: 'array of string'
                    },
                    patient: {
                        required: true,
                        type: 'string'
                    },
                    type: {
                        required: true,
                        type: 'string'
                    }
               },
            //    default: 1
            }
        },
        path: '/start',
        responses: {
            200: { description: 'Success', model: 'PatientSession'}, // , type: 'array'
            401: { description: 'Unauthorized' },
            400: { description: 'Bad income arguments (params)' },
            412: { description: 'Already opened active session' }
        }
    })
    @httpPost('/start', TYPES.DBLogger)
    public startSession(
        @requestBody() body: any,
        @request() { user }: any
    ): Promise<Session> {
        return this.sessionService.startSession(body, user);
    }

    @ApiOperationPut({
        description: 'Set session equipment',
        parameters: {
            path: {
                sessionId: {
                    required: true,
                    type: 'string'
                }
            },
            body: {
                model: 'Equipment'
            }
        },
        path: '/equipment/{sessionId}',
        responses: {
            200: { description: 'Success', model: 'PatientSession' },
            400: { description: 'Parameters fail' },
            422: { description: 'Session is locked'}
        },
        summary: 'Update new session'
    })
    @httpPut('/equipment/:sessionId', TYPES.DBLogger)
    public async setSessionEquipment(
        request: any
    ): Promise<Session> {
        await this.sessionService.isEditable(request.params.sessionId);
        return this.sessionService.setEquipment(request.params.sessionId, request.body, request.user);
    }

    @ApiOperationPut({
        description: 'Update session',
        parameters: {
            path: {
                id: {
                    required: true,
                    type: 'string'
                }
            },
            body: {
                model: 'PatientSession'
            }
        },
        path: '/{id}',
        responses: {
            200: { description: 'Success' },
            204: { description: 'Updated' },
            400: { description: 'Parameters fail' },
            422: { description: 'Session is locked'}
        },
        summary: 'Update new session'
    })
    @httpPut('/:id', TYPES.DBLogger)
    public async updateSession(request: any): Promise<Session> {
        await this.sessionService.isEditable(request.params.id);
        return this.sessionService.updateSession(request.params.id, request.body);
    }

    // @httpDelete('/:id')
    // public deleteSession(request: Request): Promise<any> {
    //     return this.sessionService.deleteSession(request.params.id);
    // }
}
