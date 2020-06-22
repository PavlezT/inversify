import { prop, Typegoose, Ref} from 'typegoose';
import { injectable } from 'inversify';
import { DefaultTransform } from '../utils/typegoose';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { Territory } from './territory';
import { User } from './user';

enum CanceletionType {
	CANCELED = 'canceled',
	NOT_ATTEND= 'not_attend'
}

@ApiModel({
  description: 'Appointment description',
  name: 'Appointment'
})
@injectable()
export class Appointment extends Typegoose {
  @ApiModelProperty({
    description: 'id',
    example: '5cefdf1a9b72aa97568e49ef' as any,
    required: false,
    type: 'string',
  })
  public id: string;

  @ApiModelProperty({
    description: 'type of cancelation: "canceled" or "not_attend"',
    example: 'not_attend' as any,
    required: true,
    type: 'string'
  })
  @prop({ required: true, enum: CanceletionType })
  public type: string;

	@ApiModelProperty({
		description: 'date of appointment',
		example: '2019-06-05T10:41:23.381Z' as any,
		required: true,
		type: 'string'
	})
	@prop({ required: false })
	public date: Date;

	@ApiModelProperty({
		description: 'reason',
		example: 'move to another day' as any,
		required: false,
		type: 'string'
	})
	@prop({ required: false })
	public reason: string;

	@ApiModelProperty({
		description: 'comment aka free text',
		example: 'cancel this and create a new one for doctor Who' as any,
		required: false,
		type: 'string'
	})
	@prop({ required: false })
	public comment: string;

  @ApiModelProperty({
		description: 'patient assigned',
		example: '5cfa12c622fd770b0047e7f6' as any,
		required: false,
		type: 'string'
	})
	@prop({ ref: User, required: true })
	public patient: Ref<User>;

}

// tslint:disable-next-line:variable-name
export const AppointmentModel = new Appointment().getModelForClass(Appointment, DefaultTransform);
