import {
    controller, httpPost, requestBody, httpGet, request, response
} from 'inversify-express-utils';
import { inject } from 'inversify';
import {
    ApiPath,
    ApiOperationPost,
    ApiOperationGet,
} from 'swagger-express-ts';
import { DirectoryService } from '../services';
import TYPES from '../config/types';

@ApiPath({
    path: '/directory',
    name: 'Directory',
    security: { JWTtoken: ['Authorization']}
})
@controller('/directory', TYPES.AuthMiddleware)
export class DirectoryController {

    constructor( @inject(TYPES.DirectoryService) private directoryService: DirectoryService ) { }


    @ApiOperationPost({
        description: 'Download file from AWS S3',
        parameters: {
            // fileName only - url with cyrillic symbols can be encoded incorrectly
            body: {
                properties: {
                    fileName: {
                        required: true,
                        type: 'string'
                    }
                }
            }
        },
        path: '/download',
        responses: {
            200: { description: 'Success', type: 'file' },
            401: { description: 'Unauthorized' },
            404: { description: 'Cannot find territory/file'}
        }
    })
    @httpPost('/download')
    public getFile(
        @requestBody() body: any,
    ): Promise<any> {
        return this.directoryService.getFile(body.fileName);
    }

    @ApiOperationGet({
        description: 'Get list of files from territory bucket from AWS S3',
        parameters: {
            path: {
                territoryId: {
                    required: true,
                    type: 'string'
                }
            }
        },
        path: '/list/{territoryId}',
        responses: {
            200: { description: 'Success', type: 'Array' },
            401: { description: 'Unauthorized' },
            404: { description: 'No territory is found' },
            400: { description: 'Bad income arguments (params)' }
        }
    })
    @httpGet('/list/:territoryId')
    public getFilesList(
        @request() { params }: any
    ): Promise<any> {
        return this.directoryService.getFilesList(params.territoryId);
    }
}