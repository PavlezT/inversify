import { prop, Typegoose } from 'typegoose'; //  ModelType, InstanceType
import { injectable } from 'inversify';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { DefaultTransform } from '../utils/typegoose';


@ApiModel({
  description: 'Language description',
  name: 'Language'
})
@injectable()
export class Language extends Typegoose {
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
    description: 'locale of Language',
    example: 'en' as any,
    required: true,
    type: 'string'
  })
  @prop({ required: true })
  public locale: string;

  @ApiModelProperty({
    description: 'name of Language',
    example: 'English' as any,
    required: true,
    type: 'string'
  })
  @prop({ required: true })
  public name: string;

  @ApiModelProperty({
    description: 'body of Language',
    example: '{ Header: "asdasd"}' as any,
    required: true,
    type: 'string'
  })
  @prop({ required: true })
  public body: Object;

}

export const LanguageModel = new Language().getModelForClass(Language, DefaultTransform);
