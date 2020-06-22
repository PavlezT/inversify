import { prop, arrayProp, Typegoose, Ref, } from 'typegoose'; // a ModelType, InstanceType
import { injectable } from 'inversify';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { Clinic } from './clinic';
import { DefaultTransform } from '../utils/typegoose';
// import * as mongoose from 'mongoose';

enum State {
  INITIAL = 'initial',
  INACTIVE = 'inactive',
  ACTIVE = 'active'
}

enum Gender {
  Male = 'male',
  female = 'female'
}

@ApiModel({
  description: 'Patient description',
  name: 'Patient'
})
@injectable()
export class Patient extends Typegoose {
  // @prop({_id: true})
  // _id: mongoose.Types.ObjectId;

  @ApiModelProperty({
    description: 'id',
    example: '5cefdf1a9b72aa97568e49ef' as any,
    required: false,
    type: 'string',
  })
  public id: string;

  @ApiModelProperty({
    description: 'externalId of Patient',
    example: '12345' as any,
    required: true,
    type: 'string'
  })
  @prop({ required: true }) // unique: true - patient Id can be same in several clinics
  public ID: string;

  @ApiModelProperty({
    description: 'birthYear of Patient',
    example: 2019 as any,
    required: true,
    type: 'number'
  })
  @prop({required: true, max: 2200, min: 1900 }) // not best decision, but enough
  public birthYear: number;

  @ApiModelProperty({
    description: 'firstname of Patient',
    example: 'Vasyl' as any,
    required: false,
    type: 'string'
  })
  @prop()
  public firstname?: string;

  @ApiModelProperty({
    description: 'lastname of Patient',
    example: 'Pupkin' as any,
    required: false,
    type: 'string'
  })
  @prop()
  public lastname?: string;
  
  @ApiModelProperty({
    description: 'email of Patient',
    example: 'email@email' as any,
    required: false,
    type: 'string'
  })
  @prop()
  public email?: string;

  @ApiModelProperty({
    description: 'gander of patient',
    example: 'male' as any,
    required: false,
    type: 'string'
  })
  @prop({ enum: Gender })
  public gender ?: string;

  @ApiModelProperty({
    description: 'postcode of Patient',
    example: '14008' as any,
    required: false,
    type: 'string'
  })
  @prop({required: false })
  public postcode ?: string;

  @ApiModelProperty({
    description: 'height of Patient',
    example: 175 as any,
    required: false,
    type: 'number'
  })
  @prop({required: false, max: 300, min: 0 }) // not best decision, but enough
  public height ?: number;
  
  @ApiModelProperty({
		description: 'insurer',
		example: 'AIG' as any,
		required: false,
		type: 'string'
	})
  @prop()
  public insurer: string;

  @ApiModelProperty({
		description: 'referral',
		example: 'someone who knows this person' as any,
		required: false,
		type: 'string'
	})
  @prop()
  public referral: string;

  @ApiModelProperty({
    description: 'state of Patient',
    example: 'active' as any,
    required: false,
    type: 'string'
  })
  @prop({ enum: State, default: State.INITIAL })
  public state: string;

  @ApiModelProperty({
		description: 'termsAccepted',
		example: false as any,
		required: false,
		type: 'boolean'
	})
  @prop({ default: false })
  public termsAccepted: boolean;

  // @prop({ enum: Status, default: Status.PENDING })
  // packageType: string;

  // @prop({ enum: Status, default: Status.PENDING })
  // paymentType: string;

  @ApiModelProperty({
    description: 'Clinic of Patient',
    example: '5cefdf1a9b72aa97568e49ef' as any,
    required: true,
    type: 'string'
  })
  @prop({ ref: Clinic, required: true })
  public clinic: Ref<Clinic>;
}

// tslint:disable-next-line:variable-name
export const PatientModel = new Patient().getModelForClass(Patient, DefaultTransform);
