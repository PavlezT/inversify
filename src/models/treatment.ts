import { prop, Typegoose, Ref, arrayProp} from 'typegoose';
import { injectable } from 'inversify';
import { DefaultTransform } from '../utils/typegoose';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

enum Frequency {
	EVERY = 'Every day',
	ALTERNATE = 'Alternate day',
	EVERY_OLD = 'every',
	ALTERNATE_OLD = 'alternate'
}

@ApiModel({
  description: 'Week for Treatment description',
  name: 'Week'
})
export class Week extends Typegoose {
	@ApiModelProperty({
		description: 'title of the week',
		example: 'Week 1 & second' as any,
		required: false,
		type: 'string'
	})
	@prop({ required: false })
	public title: string;
	
	@ApiModelProperty({
		description: 'frequency of the plan',
		example: Frequency.EVERY as any,
		required: false,
		type: 'string'
	})
	@prop({ required: false, enum: Frequency, default: Frequency.EVERY })
	public frequency: string;

	@ApiModelProperty({
		description: 'minutes indoor',
		example: 60 as any,
		required: false,
		type: 'number'
	})
	@prop({ required: false })
	public indoor: number;

	@ApiModelProperty({
		description: 'minutes outdoor',
		example: 30 as any,
		required: false,
		type: 'number'
	})
	@prop({ required: false })
	public outdoor: number;
}

@ApiModel({
  description: 'Treatment description',
  name: 'Treatment'
})
@injectable()
export class Treatment extends Typegoose {
  @ApiModelProperty({
    description: 'id',
    example: '5cefdf1a9b72aa97568e49ef' as any,
    required: false,
    type: 'string',
  })
  public id: string;

	@ApiModelProperty({
		description: 'name of the plan',
		example: 'Moderate Patients' as any,
		required: false,
		type: 'string'
	})
	@prop({ required: false })
	public type: string;

	@ApiModelProperty({
		description: 'customized plan or not',
		example: false as any,
		required: false,
		type: 'boolean'
	})
	@prop({ required: false , default: false})
	public customized: boolean;

	@ApiModelProperty({
		description: 'array of week plans',
		example: [{ title: 'Week 1 & second', indoor: 15, outdoor: 20, frequency: Frequency.EVERY }] as any,
		required: false,
		type: 'string'
	})
	@arrayProp({ items: Week })
	public weeks: Week[];

}

// tslint:disable-next-line:variable-name
export const TreatmentModel = new Treatment().getModelForClass(Treatment, DefaultTransform);
