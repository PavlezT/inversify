import {
    controller, httpPost, requestBody, httpGet
} from 'inversify-express-utils';
import { inject } from 'inversify';
import {
    ApiPath,
    ApiOperationPost,
    ApiOperationGet,
} from 'swagger-express-ts';
import { AuthMiddleware, IToken, ISignIn } from '../services/auth';
import TYPES from '../config/types';

@ApiPath({
    path: '/auth',
    name: 'Auth',
})
@controller('/auth')
export class AuthController {

    constructor( @inject(TYPES.AuthMiddleware) private authService: AuthMiddleware ) { }

    @ApiOperationGet({
        description: 'check helth of system (is it on or off)',
        parameters: {},
        path: '/helthchech',
        responses: {
            200: { description: 'Success', type: 'Object' }
        }
    })
    @httpGet('/helthchech')
    public helthchech(): any {
        return {};
    }

    @ApiOperationPost({
        description: 'Login into system',
        parameters: {
            body: {
                properties: {
                    token: { type: 'string', required: true }
                }
            }
        },
        path: '/login',
        responses: {
            200: { description: 'Success', type: 'Object' },
            412: { description: 'Incorrect token or corrupted' },
            400: { description: 'Not token in body' },
            404: { description: 'No User found by ExternalId' }
        }
    })
    @httpPost('/login') // TYPES.DBLogger - could not log anything (no authoried user in req)
    public login(
        @requestBody() body: IToken
    ): Promise<IToken> {
        return this.authService.login(body.token);
    }

    // @ApiOperationPost({
    //     description: 'Signin into system',
    //     parameters: {
    //         body: {
    //             properties: {
    //                 login: { type: 'string', required: true },
    //                 password: { type: 'string', required: true }
    //             }
    //         }
    //     },
    //     path: '/signin',
    //     responses: {
    //         200: { description: 'Success', type: 'Object' },
    //         412: { description: 'Incorrect password' },
    //         400: { description: 'Not password of login in body' },
    //         404: { description: 'No User found' }
    //     }
    // })
    // @httpPost('/signin')
    // public singin(
    //     @requestBody() body: ISignIn
    // ): Promise<IToken> {
    //     return this.authService.signin(body);
    // }
}
