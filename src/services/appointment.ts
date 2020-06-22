import { injectable } from 'inversify'; // inject
import { NotFoundError, BadRequestError } from 'restify-errors';
import { Appointment, AppointmentModel, PatientModel } from '../models';
import * as mongoose from 'mongoose';

@injectable()
export class AppointmentService {

     public async getAppointments(clinicId: string): Promise<Appointment[]> {
			if ( !clinicId || !mongoose.Types.ObjectId.isValid(clinicId)) {
				throw new BadRequestError('Bad income data');
			}

        return AppointmentModel.aggregate([
				{ '$lookup': {
					'from': PatientModel.collection.name,
					'localField': 'patient',
					'foreignField': '_id',
					'as': 'patient'
				}
				},
				{ $unwind: '$patient'},
				{ '$match': { 'patient.clinic': mongoose.Types.ObjectId(clinicId) } },
				{ $addFields: {
						'id': '$_id',
						'patient.id': '$patient._id',
					}
				}
		]) as any;
     }

    public async cancelAppointment(payload: Appointment, user: any): Promise<Appointment> {
        if ( !payload.patient || !mongoose.Types.ObjectId.isValid(payload.patient as any) || !payload.type || !payload.reason) {
            throw new BadRequestError('Bad income data');
        }

        const appointment = new AppointmentModel(payload);
			//   {
			// 	date: payload.date,
			// 	patient: payload.patient,
			// 	type: payload.type,
			// 	reason: payload.reason,
			// }
		//   );

        return appointment.save();
    }
}
