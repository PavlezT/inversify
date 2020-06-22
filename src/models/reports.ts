import { prop, Typegoose, Ref} from 'typegoose';
import { User } from './user';
import { injectable } from 'inversify';
import { DefaultTransform } from '../utils/typegoose';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  description: 'Report description',
  name: 'Report'
})
@injectable()
export class Report extends Typegoose {
    @ApiModelProperty({
        description: 'id',
        example: '5cefdf1a9b72aa97568e49ef' as any,
        required: false,
        type: 'string',
    })
    public id: string;

	@ApiModelProperty({
		description: 'text (comment) of report',
		example: 'Moderate Patients' as any,
		required: false,
		type: 'string'
	})
	@prop({ required: false })
	public text: string;
	
	@ApiModelProperty({
		description: 'time of report created',
		example: '2019-23-12T11:12:33Z' as any,
		required: false,
		type: 'string'
	})
	@prop({ required: false })
	public createdAt: Date;
    
    @ApiModelProperty({
		description: 'entity from report was made',
		example: 'DATA_OUTCOME' as any,
		required: false,
		type: 'string'
	})
	@prop({ required: false })
	public from: string;

	@ApiModelProperty({
		description: 'array of week plans',
		example: "5cefdf1a9b72aa97568e49ef" as any,
		required: false,
		type: 'string'
	})
	@prop({ ref: User, required: false })
	public reporter: Ref<User>;

}

// tslint:disable-next-line:variable-name
export const ReportModel = new Report().getModelForClass(Report, DefaultTransform);
