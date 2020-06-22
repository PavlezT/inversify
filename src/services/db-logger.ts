import { injectable } from 'inversify';
import { DBLoggerModel } from '../models';
import { BaseMiddleware } from 'inversify-express-utils';
import { NotImplementedError, BadRequestError } from 'restify-errors';
import { Request, Response, NextFunction } from 'express';
import config from '../config';

@injectable()
export class DBLogger extends BaseMiddleware {

  public async handler(req: Request, res: Response, next: NextFunction) {

        const user = req['user'];
        const body = req.body;
        const action = req.originalUrl;

        try {
            const log = new DBLoggerModel({
                action,
                date: new Date(),
                user: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                body: body
            });
            await log.save();
        } catch (e) {
            console.log('[DBLogger] Could not save log:', e);
        }

        return next();
  }

}
