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
import { Patient } from '../models';
import { PatientService } from '../services/patient';
import TYPES from '../config/types';

@ApiPath({
    path: '/patient',
    name: 'Patient',
    security: { JWTtoken: ['Authorization']}
})
@controller('/patient', TYPES.AuthMiddleware)
export class PatientController {

    constructor( @inject(TYPES.PatientService) private patientService: PatientService ) { }

    // @ApiOperationGet({
    //     description: 'Get patients information',
    //     parameters: {
    //         // path: {
    //         //     patientId: {
    //         //         required: true,
    //         //         type: 'string'
    //         //     }
    //         // }
    //     },
    //     path: '/all',
    //     responses: {
    //         200: { description: 'Success', model: 'Patient'}, // , type: 'array'
    //         401: { description: 'Unauthorized' },
    //         404: { description: 'No Patient found' },
    //         400: { description: 'Bad income arguments (params)' }
    //     }
    // })
    // @httpGet('/all')
    // public getPatients(
    //     @request() { user }: any,
    // ): Promise<Patient[]> {
    //     return this.patientService.getPatients({}, user, null, );
    // }

    @ApiOperationGet({
        description: 'Get patient information',
        parameters: {
            path: {
                patientId: {
                    required: true,
                    type: 'string'
                }
            }
        },
        path: '/{patientId}',
        responses: {
            200: { description: 'Success', model: 'Patient'}, // , type: 'array'
            401: { description: 'Unauthorized' },
            404: { description: 'No Patient found' },
            400: { description: 'Bad income arguments (params)' }
        }
    })
    @httpGet('/:id')
    public getPatient(
        @request() { params }: any,
    ): Promise<Patient> {
        return this.patientService.getPatientById(params);
    }

    @ApiOperationPost({
        description: 'Get patients by regExp (search by name or ID)',
        parameters: {
            body: {
                properties: {
                        search: {
                            required: true,
                            type: 'string'
                        },
                        clinicId: {
                            required: true,
                            type: 'string'
                        },
                    }
            }
        },
        path: '/search/autocomplete',
        responses: {
            200: { description: 'Success', model: 'Patient', type: 'array'},
            401: { description: 'Unauthorized' },
            // 404: { description: 'No Patient found' },
            400: { description: 'Bad income arguments (params)' }
        }
    })
    @httpPost('/search/autocomplete')
    public searchPatientByName(
        @requestBody() body: any,
    ): Promise<Patient[]> {
        return this.patientService.getPatientByName(body);
    }

    @ApiOperationPost({
        description: 'Get patient information',
        parameters: {
            body: {
                properties: {
                        patientId: {
                            required: true,
                            type: 'string'
                        },
                        clinicId: {
                            required: false,
                            type: 'string'
                        },
                        birthYear: {
                            required: true,
                            type: 'number'
                        }
                    }
            }
        },
        path: '/search',
        responses: {
            200: { description: 'Success', model: 'Patient'}, // , type: 'array'
            401: { description: 'Unauthorized' },
            404: { description: 'No Patient found' },
            400: { description: 'Bad income arguments (params)' }
        }
    })
    @httpPost('/search')
    public searchPatient(
        @requestBody() body: any,
        @request() { user }: any
    ): Promise<Patient> {
        return this.patientService.getPatient(body, user);
    }

    @ApiOperationPost({
        description: 'Search patients with filters',
        parameters: {
            path: {
                clinicId: {
                    required: true,
                    type: 'string'
                },
            },
            query: {
                page: {
                    required: false,
                    type: 'number'
                }
            },
            body: {
                properties: {
                        matchString: {
                            required: false,
                            type: 'string'
                        },
                        myPatients: {
                            required: false,
                            type: 'boolean'
                        },
                        joint: {
                            required: false,
                            type: 'string',
                            // "enum": ["knee","feet","ankle","back","hip"]
                        },
                        pathology: {
                            required: false,
                            type: 'string'
                        },
                        activityStatus: {
                            required: false,
                            type: 'number'
                        },
                        suitability: {
                            required: false,
                            type: 'string',
                            // "enum": ["review booked", "canceled","started treatment","did not attend", "did not join", "unsuitable"]
                        },
                        sessionNumber: {
                            required: false,
                            type: 'number'
                        },
                    }
            }
        },
        path: '/all/{clinicId}',
        responses: {
            200: { description: 'Success', model: 'Patient', type: 'array' },
            401: { description: 'Unauthorized' },
            // 404: { description: 'No Patient found' },
            400: { description: 'Bad income arguments (params)' }
        }
    })
    @httpPost('/all/:clinicId', TYPES.DBLogger)
    public searchPatients(
        @requestBody() body: any,
        @request() { user, query, params }: any
    ): Promise<Patient[]> {
        return this.patientService.getPatients(body, user, params, query, null, true);
    }

    @ApiOperationPost({
        description: 'Register new patient',
        parameters: {
            body: {
                model: 'Patient'
            }
        },
        path: '/',
        responses: {
            200: { description: 'Success' },
            400: { description: 'Parameters fail' },
            409: { description: 'Already exists in this Clinic'}
        },
        summary: 'Register new patient'
    })
    @httpPost('/', TYPES.DBLogger)
    public newPatient(
        // request: Request,
        @requestBody() newPatient: any
    ): Promise<Patient> {
        // console.log('request:', !!request ? request.body : 'no request');
        return this.patientService.newPatient(newPatient);
    }

    @ApiOperationPut({
        description: 'Update patient',
        parameters: {
            path: {
                id: {
                    required: true,
                    type: 'string'
                }
            },
            body: {
                model: 'Patient'
            }
        },
        path: '/{id}',
        responses: {
            200: { description: 'Success' },
            400: { description: 'Parameters fail' },
        },
        summary: 'Update new patient'
    })
    @httpPut('/:id', TYPES.DBLogger)
    public updatePatient(request: any): Promise<Patient> {
        return this.patientService.updatePatient(request.params.id, request.body);
    }

    // @httpDelete('/:id')
    // public deletePatient(request: Request): Promise<any> {
    //     return this.patientService.deletePatient(request.params.id);
    // }
}
