import { injectable } from 'inversify'; // inject
import { UnauthorizedError, NotFoundError, BadRequestError, PreconditionFailedError, UnprocessableEntityError } from 'restify-errors';
import { UserModel, User } from '../models';
import { BaseMiddleware } from 'inversify-express-utils';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../config';
import * as AuthHelper from '../utils/auth';
// import TYPES from '../config/types';

export interface IToken {
  token: string;
}

export interface ISignIn {
  login: string;
  password: string;
}

@injectable()
export class AuthMiddleware extends BaseMiddleware {
//   private mongoClient: MongoDBClient;

//   constructor(
//     @inject(TYPES.MongoDBClient) mongoClient: MongoDBClient
//   ) {
//     this.mongoClient = mongoClient;
//   }

  public async handler(req: Request, res: Response, next: NextFunction) {
    // this.passport.authenticate('jwt', { session: false }, (err, user, info) => {

        // if (err) {
        //     next(new UnauthorizedError(err.message ? err.message : err));
        // }

        // if (!user) {
        //     next(new UnauthorizedError(info.toString()));
        // }
        const token = req.get('Authorization');

        if (!token || !(token.split(' ')[1] && token.split(' ')[0] === 'Bearer')) {
          return next(new UnauthorizedError('No authorization payload provided'));
        }

        try {
          const payload = jwt.decode(token.split(' ')[1]) as any;//jwt.verify(token.split(' ')[1], config.AUTH.secret) as any;
          const user = await this.findUserByExternalId(payload.username)//this.findUserById(payload.id);

         // if (user.status !== 'active') {
         //   return next(new UnprocessableEntityError('User is not activated'));
         // }

        // tslint:disable-next-line
          req['user'] = user;

          next();
        } catch (e) {
          // next(e);
          return next(new UnauthorizedError('Token invalid'));
        }
    // })(req, res, next);
  }

  public async signin({login, password}: ISignIn): Promise<IToken> {
    if (!login || !password) {
      throw new BadRequestError('no signin data');
    }

    const user = await this.findUserByEmail(login);

    // if ( !(await AuthHelper.checkUserPassword(password, user.password))) {
    //   throw new PreconditionFailedError('password is incorrect');
    // }

    const token = jwt.sign({
      username: user.externalId,
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname
    }, config.AUTH.secret, { expiresIn: config.AUTH.expiry});

    return { token };
  }

  public async login(externalToken: string): Promise<IToken> {
    if (!externalToken) {
      throw new BadRequestError('not external token provided');
    }

    let payload = null;
    try {
      payload = jwt.decode(externalToken);//jwt.verify(externalToken, config.AUTH.secret) as any;
    } catch (e) {
      throw new PreconditionFailedError('incorrect external token');
    }

    const externalId = payload.username;
    const user = await this.findUserByExternalId(externalId);

    // const token = jwt.sign({
    //   id: user.id,
    //   firstname: user.firstname,
    //   lastname: user.lastname
    // }, config.AUTH.secret, { expiresIn: config.AUTH.expiry});

    return { token : externalToken }; //{ token };
  }

  private async findUserByExternalId(externalId: string): Promise<User> {
    const user = await UserModel.findOne({externalId});

    if (!user) {
      throw new NotFoundError('No user found');
    }

    return user;
  }

  private async findUserById(id: string): Promise<User> {
    const user = await UserModel.findById(id);

    if (!user) {
      throw new UnauthorizedError('No user found');
    }

    return user;
  }
  
  private async findUserByEmail(email: string): Promise<User> {
    const user = await UserModel.findOne({email});

    if (!user) {
      throw new NotFoundError('No user found');
    }

    return user;
  }
}
