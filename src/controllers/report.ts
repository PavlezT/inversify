import {
    controller, httpPost, requestBody, request
} from 'inversify-express-utils';
import { inject } from 'inversify';
import {
    ApiPath,
    ApiOperationPost
} from 'swagger-express-ts';
import { Report } from '../models';
import { ReportService } from '../services';
import TYPES from '../config/types';

@ApiPath({
    path: '/report',
    name: 'Report an issue',
    security: { JWTtoken: ['Authorization']}
})
@controller('/report', TYPES.AuthMiddleware)
export class ReportController {

    constructor( @inject(TYPES.ReportService) private service: ReportService ) {}

    @ApiOperationPost({
        description: 'Report an issue',
        parameters: {
            body: {
                properties : {
                    text: {
                        type: 'string',
                        required: true
                    },
                    from: {
                        type: 'string',
                        required: false
                    }
                }
            }
        },
        path: '/',
        responses: {
            200: { description: 'Success', model: 'Report'},
            401: { description: 'Unauthorized' },
        }
    })
    @httpPost('/')
    public getPatients(
        @requestBody() body: any,
        @request() { user }: any
    ): Promise<Report> {
        return this.service.report(user, body);
    }
}
