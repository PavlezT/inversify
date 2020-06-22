import {
    controller, httpGet, request
} from 'inversify-express-utils';
import { inject } from 'inversify';
import {
    ApiPath,
    ApiOperationGet,
} from 'swagger-express-ts';
import { Territory } from '../models';
import { TerritoryService } from '../services';
import TYPES from '../config/types';

@ApiPath({
    path: '/territory',
    name: 'Territory',
    security: { JWTtoken: ['Authorization']}
})
@controller('/territory', TYPES.AuthMiddleware)
export class TerritoryController {

    constructor( @inject(TYPES.TerritoryService) private territoryService: TerritoryService ) { }

    @ApiOperationGet({
        description: 'Get user by Id',
        parameters: {
            path: {
                territoryId: {
                    required: true,
                    type: 'string'
                }
            }
        },
        path: '/{territoryId}',
        responses: {
            200: { description: 'Success', model: 'Territory' },
            401: { description: 'Unauthorized' },
            404: { description: 'No Territory found' },
            400: { description: 'Bad income arguments (params)' }
        }
    })
    @httpGet('/:territoryId')
    public getTerritory(
        @request() { user, params }: any,
    ): Promise<Territory> {
        return this.territoryService.getTerritory(params.territoryId);
    }
}
