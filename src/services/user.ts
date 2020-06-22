import { injectable } from 'inversify'; // inject
import { UnauthorizedError, NotFoundError, BadRequestError } from 'restify-errors';
import { User, UserModel } from '../models';
import * as mongoose from 'mongoose';
// import TYPES from '../config/types';

@injectable()
export class UserService {

    public async getUser(id: string): Promise<User> {
        if (!id || !mongoose.Types.ObjectId.isValid(id) ) {
            throw new BadRequestError('Bad income data');
        }

        const user = await UserModel.findById(id) as any;

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return user;
    }

    public getUsers(): Promise<User[]> {
        return UserModel.find() as any;
    }

//   public updateUser(id: string, user: User): Promise<User> {
//     return new Promise<User>((resolve, reject) => {
//       this.mongoClient.update('user', id, user, (error, data: User) => {
//         resolve(data);
//       });
//     });
//   }

//   public deleteUser(id: string): Promise<any> {
//     return new Promise<any>((resolve, reject) => {
//       this.mongoClient.remove('user', id, (error, data: any) => {
//         resolve(data);
//       });
//     });
//   }
}
