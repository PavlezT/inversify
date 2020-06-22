import {
    controller, httpPost,
    requestBody, request, httpGet
} from 'inversify-express-utils';
import { inject } from 'inversify';
import {
    ApiPath,
    ApiOperationPost,
	ApiOperationGet
} from 'swagger-express-ts';
import { Treatment } from '../models';
import { TreatmentService } from '../services/treatment';
import TYPES from '../config/types';

@ApiPath({
    name: 'treatment',
    path: '/treatment',
    security: { JWTtoken: ['Authorization']}
})
@controller('/treatment', TYPES.AuthMiddleware)
export class TreatmentController {

    constructor( @inject(TYPES.TreatmentService) private treatmentService: TreatmentService ) { }

    @ApiOperationGet({
		description: 'get treatments predefined',
		parameters: {},
		path: '/',
		responses: {
			200: { description: 'Success', model: 'Treatment', type: 'array'},
			401: { description: 'Unauthorized' },
			400: { description: 'Bad income arguments (params)' }
		}
	})
	@httpGet('/')
	public getDefaultTreatments(): Promise<Treatment[]> {
		return this.treatmentService.getDefaultTreatments();
    }
    
    @ApiOperationGet({
		description: 'get treatments from sessions',
		parameters: {
            path: {
                patientId: {
                    required: true,
                    type: 'string'
                },
                customized: {
                    required: false,
                    type: 'string'
                }
            }
        },
		path: '/{patientId}/{customized}',
		responses: {
			200: { description: 'Success', model: 'Treatment', type: 'array'},
			401: { description: 'Unauthorized' },
			400: { description: 'Bad income arguments (params)' }
		}
	})
	@httpGet('/:patientId/:customized?')
	public getPatientTreatments(
        @request() {params}: any
    ): Promise<Treatment[]> {
		return this.treatmentService.getPatientTreatments(params.patientId, params.customized);
	}

    @ApiOperationPost({
        description: 'cancel treatment',
        parameters: {
            body: {
               model: 'Treatment'
            },
            path: {
                id: {
                    required: false,
                    type: 'string'
                }
            }
        },
        path: '/customize/{id}',
        responses: {
            200: { description: 'Success', model: 'Treatment'},
            401: { description: 'Unauthorized' },
            400: { description: 'Bad income arguments (params)' }
        }
    })
    @httpPost('/customize/:id?', TYPES.DBLogger)
    public starttreatment(
        @requestBody() body: any,
        @request() {params}: any
    ): Promise<Treatment> {
        return this.treatmentService.customizeTreatment(body, params.id);
    }
}
