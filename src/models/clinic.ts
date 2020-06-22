import { prop, Typegoose, Ref} from 'typegoose';
import { injectable } from 'inversify';
import { DefaultTransform } from '../utils/typegoose';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { Territory } from './territory';

@ApiModel({
  description: 'Clinic description',
  name: 'Clinic'
})
@injectable()
export class Clinic extends Typegoose {
  @ApiModelProperty({
    description: 'id',
    example: '5cefdf1a9b72aa97568e49ef' as any,
    required: true,
    type: 'string',
  })
  public id: string;

  @ApiModelProperty({
    description: 'name',
    example: 'ClinicA' as any,
    required: true,
    type: 'string'
  })
  @prop({unique: true, required: true})
  public name: string;

  @ApiModelProperty({
    description: 'name',
    example: 'USA' as any,
    required: true,
    type: 'string'
  })
  @prop({required: true})
  public country: String;

  @ApiModelProperty({
    description: 'name',
    example: 'New York' as any,
    required: true,
    type: 'string'
  })
  @prop()
  public city: String;

  @ApiModelProperty({
    description: 'street',
    example: '18 boulevard' as any,
    required: true,
    type: 'string'
  })
  @prop()
  public street: String;
  
  @ApiModelProperty({
    description: "profile",
    example: "compliance" as any,
    required: false,
    type: "string"
  })
  @prop()
  public profile: string;

  @ApiModelProperty({
    description: 'name',
    example: 53.123 as any,
    required: true,
    type: 'number'
  })
  @prop()
  public latitude: Number;

  @ApiModelProperty({
    description: 'name',
    example: 34.123 as any,
    required: true,
    type: 'number'
  })
  @prop()
  public longitude: Number;

  @ApiModelProperty({
    description: 'Territory of clinic',
    example: '5cefdf1a9b72aa97568e49ef' as any,
    required: false,
    type: 'string'
  })
  @prop({ ref: Territory, required: true })
  public territory: Ref<Territory>;

}

// tslint:disable-next-line:variable-name
export const ClinicModel = new Clinic().getModelForClass(Clinic, DefaultTransform);
