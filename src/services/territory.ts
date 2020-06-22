import { injectable } from 'inversify';
import { NotFoundError, BadRequestError } from 'restify-errors';
import { Territory, TerritoryModel } from '../models';
import * as mongoose from 'mongoose';

@injectable()
export class TerritoryService {
    public async getTerritory(id: string): Promise<Territory> {
        if (!id || !mongoose.Types.ObjectId.isValid(id) ) {
            throw new BadRequestError('Bad income data');
        }

        const territory = await TerritoryModel.findById(id) as any;

        if (!territory) {
            throw new NotFoundError('Territory not found');
        }

        return territory;
    }

    public getTerritories(): Promise<Territory[]> {
        return TerritoryModel.find() as any;
    }
}
