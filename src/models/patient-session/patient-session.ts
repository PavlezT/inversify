import { prop, Typegoose, Ref, arrayProp, ModelType} from 'typegoose'; //  ModelType, InstanceType
import { injectable } from 'inversify';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { Patient } from '../patient';
import { DefaultTransform } from '../../utils/typegoose';
import { User } from '../user';
import { Equipment } from '../equipment';
import { Treatment } from '../treatment';
import { Pathology } from './pathology';
import { PTRecommendation } from './PTRecommendation';
import { Assessment } from './assessment';
import { AdditionalTreatment } from './additional-treatment';

enum Type {
  INITIAL = 'initial',
  FOLLOWUP = 'followup'
}

enum CheckOut {
  AUTOMATIC = 'automatic',
  MANUAL = 'manual'
}

enum State {
  IN = 'in',
  OUT = 'out',
  INCOMPLETE = 'incomplete'
}

enum Irritability {
  COPER = 'Coper',
  MILD = 'Mild Irritable',
  IRRITABLE = 'Very Irritable'
}

enum Severity {
  VERY_MILD = 'Very Mild',
  MILD = 'Mild',
  MODERATE = 'Moderate',
  MODERATE_SEVERE = 'Moderate-Severe',
  SEVERE = 'Severe'
}

export enum Area {
  KNEE = 'Knee',
  LOWER_BACK = 'Lower back',
  HIP = 'Hip',
  FOOT_ANKLE = 'Foot & ankle',
  BACK_UPPER = 'Upper back',
  NEURO = 'Neurological condition',
  PEDIATRIC = 'Pediatric',
  OTHER = 'Other',
  // old list
  BACK = 'Back',
  FOOT = 'Foot',
  ANKLE = 'Ankle',
  ADULT = 'Adult',
  LUMBAR = 'Lumbar spine'
}

@ApiModel({
  description: 'PatientSession description',
  name: 'PatientSession'
})
@injectable()
export class PatientSession extends Typegoose {
  // @prop({_id: true})
  // _id: mongoose.Types.ObjectId;

  @ApiModelProperty({
    description: 'id',
    example: '5cefdf1a9b72aa97568e49ef' as any,
    required: true,
    type: 'string',
  })
  public id: string;

  @ApiModelProperty({
    description: 'patient Id of PatientSession',
    example: '5cefdf1a9b72aa97568e49ef' as any,
    required: true,
	//  model: 'Pat'
	type: 'string'
  })
  @prop({ ref: Patient, required: true, index: true })
  public patient: Ref<Patient>;

  @ApiModelProperty({
    description: 'startDate of PatientSession',
    example: '2019-06-05T10:41:23.381Z' as any,
    required: false,
    type: 'string'
  })
  @prop({ required: false, default: Date.now })
  public startDate ?: Date;

  @ApiModelProperty({
    description: 'endDate of PatientSession',
    example: '2019-06-05T10:41:23.381Z' as any,
    required: false,
    type: 'string'
  })
  @prop()
  public endDate?: Date;

  @ApiModelProperty({
    description: 'type of PatientSession',
    example: 'initial' as any,
    required: false,
    type: 'string'
  })
  @prop({ enum: Type, default: Type.INITIAL })
  public type: string;

  @ApiModelProperty({
    description: 'number of PatientSession',
    example: 1 as any,
    required: false,
    type: 'number'
  })
  @prop({ required: false, default: 1 })
  public number: number;

  @ApiModelProperty({
    description: 'checkoutType of PatientSession',
    example: 'automatic' as any,
    required: false,
    type: 'string'
  })
  @prop({ enum: CheckOut })
  public checkoutType ?: string;

  @ApiModelProperty({
    description: 'state of PatientSession',
    example: 'in' as any,
    required: false,
    type: 'string'
  })
  @prop({ enum: State, default: 'in' })
  public state ?: string;

  @ApiModelProperty({
    description: 'doctor assigned to patient',
    example: '5cfa12c622fd770b0047e7f6' as any,
    required: false,
    type: 'string'
  })
  @prop({ ref: User })
  public therapist: Ref<User>;

  @ApiModelProperty({
    description: 'equipment assigned to patient',
    example: '5cfa12c622fd770b0047e7f6' as any,
    required: false,
    type: 'string'
  })
  @prop({ ref: Equipment })
  public equipment: Ref<Equipment>;

  @ApiModelProperty({
    description: 'treatment assinged to this pationt',
    example: '5cfa12c622fd770b0047e7f6' as any,
    required: false,
    type: 'string'
  })
  @prop({ ref: Treatment })
  public treatment: Ref<Treatment>;

  @ApiModelProperty({
    description: 'additional treatments assinged to this patient in PatientInfo screen',
    // example: '5cfa12c622fd770b0047e7f6' as any,
    required: false,
    type: 'array',
    model: 'AdditionalTreatment'
    // itemType: 'AdditionalTreatment'
  })
  @arrayProp({ items: AdditionalTreatment, _id: false, required: false })
  public additionalTreatments: AdditionalTreatment[];

  @ApiModelProperty({
    description: 'pathology of Patient',
    // example: 'some pathology' as any,
    required: false,
    // type: 'string'
    model: 'Pathology'
  })
  @prop({ required: false, _id: false  })
  public pathology ?: Pathology;

  @ApiModelProperty({
	description: 'weight of Patient',
	example: '72 kg' as any,
	required: false,
	type: 'string'
 })
 @prop({ required: false })
 public weight ?: string;

  @ApiModelProperty({
    description: 'primaryArea of PatientSession',
    example: 'Back' as any,
    required: false,
    type: 'string'
  })
  @prop({ enum: Area })
  public primaryArea: string;

  @ApiModelProperty({
    description: 'otherAreas of PatientSession',
    example: ['Knee', 'Hip'] as any,
    required: false,
    type: 'array'
  })
  @arrayProp({ items: String, validate: (value) =>
    value && Array.isArray(value) && value.every( val => typeof val === 'string' && (Object as any).values(Area).includes(val))
  })
  public otherAreas: string[];

  @ApiModelProperty({
		description: 'name of person',
		example: 'Some Person' as any,
		required: false,
		type: 'string'
	})
  @prop()
  public hearOfApos: string;

  @ApiModelProperty({
		description: 'paymentType',
		example: 'Debit Card' as any,
		required: false,
		type: 'string'
	})
  @prop()
  public paymentType: string;

  @ApiModelProperty({
		description: 'packageType that fived to patient',
		example: 'package A (6)' as any,
		required: false,
		type: 'string'
	})
  @prop()
  public packageType: string;

  @ApiModelProperty({
		description: 'payment accomplished',
		example: true as any,
		required: false,
		type: 'boolean'
	})
  @prop()
  public payment: boolean;

  @ApiModelProperty({
		description: 'equipment given',
		example: true as any,
		required: false,
		type: 'boolean'
	})
	@prop()
  public equipmentProvided: boolean;
  
  @ApiModelProperty({
		description: 'recommendation',
		example: 'some text recommendstion' as any,//{ next: 'appointment', time: '10 days' } as any,
		required: false,
    type: 'string'
    // model: 'PTRecommendation'
	})
  // @prop({ _id: false })
  @prop()
  public recommendation: String;//PTRecommendation;

  @ApiModelProperty({
		description: 'Assessment',
		example: { suatibility: 'Start treatment', reason: 'why not?', comment: 'that is why' } as any,
		required: false,
    // type: 'object'
    model: 'Assessment'
	})
	@prop({ _id: false })
  public assessment: Assessment;

  @ApiModelProperty({
		description: 'insurer',
		example: 'some insurer' as any,
		required: false,
    type: 'string'
	})
  @prop()
  public insurer: String;

  @ApiModelProperty({
		description: 'bmi',
		example: 'bmi' as any,
		required: false,
    type: 'string'
	})
  @prop()
  public bmi: String;
  
  @ApiModelProperty({
		description: 'bmi',
		example: 'bmi' as any,
		required: false,
    type: 'string'
	})
  @prop({enum: Irritability})
  public irritability: String;
  
  @ApiModelProperty({
		description: 'bmi',
		example: 'bmi' as any,
		required: false,
    type: 'string'
	})
  @prop({enum: Severity})
  public severity: String;

  @prop({ default: [] })
  public recommendedQuestionnaires: string[];
}

// tslint:disable-next-line:variable-name
export const PatientSessionModel = new PatientSession().getModelForClass(PatientSession, DefaultTransform);
