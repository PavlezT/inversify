import { prop, Typegoose, arrayProp } from 'typegoose';
import { injectable } from 'inversify';
import { DefaultTransform } from '../utils/typegoose';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  description: 'Territory description',
  name: 'Territory'
})
@injectable()
export class Territory extends Typegoose {
  @ApiModelProperty({
    description: 'id',
    example: '5cefdf1a9b72aa97568e49ef' as any,
    required: true,
    type: 'string',
  })
  public id: string;

  @ApiModelProperty({
    description: 'name',
    example: 'Amerika' as any,
    required: true,
    type: 'string'
  })
  @prop({required: true})
  public name: String;

  @ApiModelProperty({
    description: 'postcode',
    example: true as any,
    required: false,
    type: 'boolean'
  })
  @prop({default: false})
  public postcode: Boolean;

  @ApiModelProperty({
    description: 'name',
    example: 'uk' as any,
    required: true,
    type: 'string'
  })
  @prop({required: true})
  public language: String;

  @ApiModelProperty({
    description: 'name',
    example: 'metric' as any,
    required: true,
    type: 'string'
  })
  @prop({enum: ['imperial', 'metric'], required: true })
	public unitSystem: String;

  @ApiModelProperty({
    description: 'name',
    example: ['Coca-Cola'] as any,
    required: true,
    type: 'array'
  })
  @arrayProp({items: String})
  public referrals: [String];

  @ApiModelProperty({
    description: 'issuer',
    example: ['AIG'] as any,
    required: false,
    type: 'array'
  })
  @arrayProp({items: String})
  public insurers: [String];

  @ApiModelProperty({
    description: 'name',
    example: ['cash'] as any,
    required: true,
    type: 'array'
  })
  @arrayProp({items: String})
  public paymentTypes: [String];

  @ApiModelProperty({
    description: 'name',
    example: ['Delivered', 'Unused'] as any,
    required: true,
    type: 'array'
  })
  @arrayProp({items: Object })
  public activityStatus: [ {id: string, name: string, session: string} ];

  @ApiModelProperty({
    description: 'name',
    example: ['full', 'home'] as any,
    required: true,
    type: 'array'
  })
  @arrayProp({items: String})
  public supportedPackages: [String];

  @ApiModelProperty({
    description: 'name',
    example:  ['not working', 'not suits well'] as any,
    required: true,
    type: 'array'
  })
  @arrayProp({items: String})
  public dropOutReasons: [String];
  
  @ApiModelProperty({
    description: 'isUK territory',
    example: true as any,
    required: false,
    type: 'boolean'
  })
  @prop()
  public isUK: boolean
}

export const TerritoryModel = new Territory().getModelForClass(Territory, DefaultTransform);
