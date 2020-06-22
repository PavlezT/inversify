import {
    controller, httpGet, httpPost, // httpPut, httpDelete
    requestBody, request
} from 'inversify-express-utils';
import { inject } from 'inversify';
import {
    ApiPath,
    ApiOperationGet,
    // ApiOperationPut,
    // ApiOperationPost
} from 'swagger-express-ts';
// import { Request } from 'express'; // Response
import { User } from '../models';
import { UserService } from '../services/user';
import TYPES from '../config/types';

@ApiPath({
    path: '/user',
    name: 'User',
    security: { JWTtoken: ['Authorization']}
})
@controller('/user', TYPES.AuthMiddleware)
export class UserController {

    constructor( @inject(TYPES.UserService) private userService: UserService ) { }

    @ApiOperationGet({
        description: 'Get user self information',
        parameters: {
            // path: {
            //     userId: {
            //         required: true,
            //         type: 'string'
            //     }
            // }
        },
        path: '/self',
        responses: {
            200: { description: 'Success', model: 'User'}, // , type: 'array'
            401: { description: 'Unauthorized' },
            404: { description: 'No User found' },
            400: { description: 'Bad income arguments (params)' }
        }
    })
    @httpGet('/self')
    public getSelf(
        @request() { user, params }: any,
        // @response() res: Response,
        // @requestParam("year") yearParam: string,
    ): Promise<User> {
        return this.userService.getUser(user.id);
    }

    // @ApiOperationPost({
    //     description: 'Register new user',
    //     parameters: {
    //         body: {
    //             model: 'User'
    //         }
    //     },
    //     path: '/',
    //     responses: {
    //         200: { description: 'Success' },
    //         409: { description: 'Parameters fail' }
    //     },
    //     summary: 'Register new user'
    // })
    // @httpPost('/')
    // public newUser(
    //     // request: Request,
    //     @requestBody() newUser: any
    // ): Promise<User> {
    //     // console.log('request:', !!request ? request.body : 'no request');
    //     console.log('newMovie:', newUser)
    //     return this.userService.newUser(newUser);
    // }

    // @httpPut('/:id')
    // public updateUser(request: Request): Promise<User> {
    //     return this.userService.updateUser(request.params.id, request.body);
    // }

    // @httpDelete('/:id')
    // public deleteUser(request: Request): Promise<any> {
    //     return this.userService.deleteUser(request.params.id);
    // }
}
