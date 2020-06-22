import {
    controller, httpGet, response, request
} from 'inversify-express-utils';
import { inject } from 'inversify';
import {
    ApiPath,
    ApiOperationGet
} from 'swagger-express-ts';
import { Patient } from '../models';
import { ExportService } from '../services';
import TYPES from '../config/types';

@ApiPath({
    path: '/export',
    name: 'Export CSV',
    security: { JWTtoken: ['Authorization']}
})
@controller('/export', TYPES.AuthMiddleware)
export class ExportController {

    constructor( @inject(TYPES.ExportService) private exportService: ExportService ) {}

    @ApiOperationGet({
        description: 'Export patients in CSV',
        parameters: {
            path:{
                clinicId: {
                    required: true,
                    type: 'string'
                }
            }
        },
        path: '/csv/{clinicId}',
        responses: {
            200: { description: 'Success', model: 'Patient', type: 'array' },
            401: { description: 'Unauthorized' },
        }
    })
    @httpGet('/csv/:clinicId')
    public getPatients(
        @request() { params }: any,
        @response() res: any,
    ): Promise<Patient[]> {
        return this.exportService.getPatients(params, res);
    }
}
