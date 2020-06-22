import {
    controller, httpPost,
    requestBody, request, httpGet
} from 'inversify-express-utils';
import { inject } from 'inversify';
import {
    ApiPath,
    ApiOperationPost,
	ApiOperationGet
} from 'swagger-express-ts';
// import { Request } from 'express'; // Response
import { Appointment } from '../models';
import { AppointmentService } from '../services/appointment';
import TYPES from '../config/types';

@ApiPath({
    name: 'appointment',
    path: '/appointment',
    security: { JWTtoken: ['Authorization']}
})
@controller('/appointment', TYPES.AuthMiddleware)
export class AppointmentController {

    constructor( @inject(TYPES.AppointmentService) private appointmentService: AppointmentService ) { }

    @ApiOperationGet({
		description: 'get appointments by clinic',
		parameters: {
			path: {
				clinicId: {
					required: true,
					type: 'string'
				}
			}
		},
		path: '/{clinicId}',
		responses: {
			200: { description: 'Success', model: 'Appointment', type: 'array'},
			401: { description: 'Unauthorized' },
			400: { description: 'Bad income arguments (params)' }
		}
	})
	@httpGet('/:clinicId')
	public getAppointments(
		@request() {params}: any
	): Promise<Appointment[]> {
		return this.appointmentService.getAppointments(params.clinicId);
	}

    @ApiOperationPost({
        description: 'cancel appointment',
        parameters: {
            body: {
               model: 'Appointment'
            }
        },
        path: '/cancel',
        responses: {
            200: { description: 'Success', model: 'Appointment'},
            401: { description: 'Unauthorized' },
            400: { description: 'Bad income arguments (params)' }
        }
    })
    @httpPost('/cancel', TYPES.DBLogger)
    public startappointment(
        @requestBody() body: any,
        @request() { user }: any
    ): Promise<Appointment> {
        return this.appointmentService.cancelAppointment(body, user);
    }
}
