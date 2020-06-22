import { prop, Typegoose } from 'typegoose';
import { injectable } from 'inversify';
import { DefaultTransform } from '../../utils/typegoose';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  description: 'Surgery description',
  name: 'Surgery'
})
@injectable()
export class Surgery extends Typegoose {
  @ApiModelProperty({
    description: 'id',
    example: '5cefdf1a9b72aa97568e49ef' as any,
    required: true,
    type: 'string',
  })
  public id: string;

  @ApiModelProperty({
    description: 'name',
    example: 'surgery item' as any,
    required: true,
    type: 'string'
  })
  @prop({unique: true, required: true})
  public text: string;

}

export const SurgeryModel = new Surgery().getModelForClass(Surgery, { schemaOptions: {...DefaultTransform.schemaOptions, ...{collection: 'recommendedsurgeries'}}} );
