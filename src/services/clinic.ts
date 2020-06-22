import { injectable } from 'inversify'; // inject
import { NotFoundError, BadRequestError } from 'restify-errors';
import { Clinic, ClinicModel } from '../models';
import * as mongoose from 'mongoose';

@injectable()
export class ClinicService {

    public async getClinic(id: string): Promise<Clinic> {
        if (!id || !mongoose.Types.ObjectId.isValid(id) ) {
            throw new BadRequestError('Bad income data');
        }

        const clinic = await ClinicModel.findById(id) as any;

        if (!clinic) {
            throw new NotFoundError('Clinic not found');
        }

        return clinic;
    }

    public getUserClinics(clinics: [{role: String, clinic: String}]): Promise<Clinic[]> {
        const ids = clinics.map( item => item.clinic);
        return ClinicModel.find({_id: { $in : ids }}) as any;
    }
}
