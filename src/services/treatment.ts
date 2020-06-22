import { injectable, id } from 'inversify'; // inject
import { NotFoundError, BadRequestError } from 'restify-errors';
import { Treatment, TreatmentModel, PatientModel, PatientSessionModel } from '../models';
import * as mongoose from 'mongoose';

@injectable()
export class TreatmentService {

	public async getDefaultTreatments(): Promise<Treatment[]> {
		return TreatmentModel.find({customized: false}).sort({type: 'ASC'});
	}

    public async getPatientTreatments(patientId: string, customized = false): Promise<Treatment[]> {
		if ( !patientId || !mongoose.Types.ObjectId.isValid(patientId)) {
			throw new BadRequestError('Bad income data');
		}

        return TreatmentModel.aggregate([
			{ '$lookup': {
				'from': PatientSessionModel.collection.name,
				'localField': '_id',
				'foreignField': 'treatment',
				'as': 'session'
				}
			},
			{ $unwind: '$session'},
			{ '$match': { 'session.patient': mongoose.Types.ObjectId(patientId), ...(customized ? { 'customized': true } : {}) } },
			{ $addFields: {
					'id': '$_id',
					'session.id': '$session._id',
				}
			},
			{ $sort: { 'session.number': -1}},
			// { $limit: 20 }
		]) as any;
	}

    public async customizeTreatment(body: any, id ?: string) : Promise<Treatment> {
		if (!body) {
			throw new BadRequestError('Bad income data');
		}

		try {
			delete body.id;
			body.customized = true;
			
			if (id) {
				await TreatmentModel.updateOne({_id: id}, {$set: body});
				return TreatmentModel.findById(id);
			}

			const tr = (new TreatmentModel(body)).save();
			return tr;
		} catch (e) {
			console.log('[TreatmentService]: customizeTreatment error:', e)
			throw new BadRequestError('Bad income data');
		}
	}
}
