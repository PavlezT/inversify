import {
    controller, httpGet
} from 'inversify-express-utils';
import { inject } from 'inversify';
import {
    ApiPath,
    ApiOperationGet,
} from 'swagger-express-ts';
import { Pathologies, Surgery, MarketingItems } from '../models';
import { SettingsService } from '../services';
import TYPES from '../config/types';

@ApiPath({
    path: '/settings',
    name: 'Settings',
    security: { JWTtoken: ['Authorization']}
})
@controller('/settings', TYPES.AuthMiddleware)
export class SettingsController {

    constructor( @inject(TYPES.SettingsService) private service: SettingsService ) { }


    @ApiOperationGet({
        description: 'Get MarketingItems',
        parameters: {},
        path: '/items',
        responses: {
            200: { description: 'Success', model: 'MarketingItems', type: 'array' },
            401: { description: 'Unauthorized' },
        }
    })
    @httpGet('/items')
    public getMarketingItems(): Promise<MarketingItems[]> {
        return this.service.getMarketingItems();
    }

    @ApiOperationGet({
        description: 'Get pathologies',
        parameters: {},
        path: '/pathologies',
        responses: {
            200: { description: 'Success', model: 'Pathologies', type: 'array' },
            401: { description: 'Unauthorized' },
        }
    })
    @httpGet('/pathologies')
    public getPathologies(): Promise<Pathologies[]> {
        return this.service.getPathologies();
    }

    @ApiOperationGet({
        description: 'Get surgery settings',
        parameters: {},
        path: '/surgery',
        responses: {
            200: { description: 'Success', model: 'Surgery', type: 'array' },
            401: { description: 'Unauthorized' },
        }
    })
    @httpGet('/surgery')
    public getSurgery(): Promise<Surgery[]> {
        return this.service.getSurgery();
    }
}
