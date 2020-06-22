import {
    controller, httpGet, request
} from 'inversify-express-utils';
import { inject } from 'inversify';
import {
    ApiPath,
    ApiOperationGet,
} from 'swagger-express-ts';
import { Clinic } from '../models';
import { ClinicService } from '../services';
import TYPES from '../config/types';

@ApiPath({
    path: '/clinic',
    name: 'Clinic',
    security: { JWTtoken: ['Authorization']}
})
@controller('/clinic', TYPES.AuthMiddleware)
export class ClinicController {

    constructor( @inject(TYPES.ClinicService) private clinicService: ClinicService ) { }


    @ApiOperationGet({
        description: 'Get user clinics',
        parameters: {},
        path: '/user',
        responses: {
            200: { description: 'Success', model: 'Clinic', type: 'array' },
            401: { description: 'Unauthorized' },
        }
    })
    @httpGet('/user')
    public getUserClinics(
        @request() { user }: any,
    ): Promise<Clinic[]> {
        return this.clinicService.getUserClinics(user.clinics);
    }

    @ApiOperationGet({
        description: 'Get clinic by Id',
        parameters: {
            path: {
                clinicId: {
                    required: true,
                    type: 'string'
                }
            }
        },
        path: '/{clinicId}',
        responses: {
            200: { description: 'Success', model: 'Clinic' },
            401: { description: 'Unauthorized' },
            404: { description: 'No Clinic found' },
            400: { description: 'Bad income arguments (params)' }
        }
    })
    @httpGet('/:clinicId')
    public getClinic(
        @request() { user, params }: any,
    ): Promise<Clinic> {
        return this.clinicService.getClinic(params.clinicId);
    }
}
