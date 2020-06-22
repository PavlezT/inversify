import { prop, arrayProp, Typegoose, Ref, } from 'typegoose'; //  ModelType, InstanceType
import { injectable } from 'inversify';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { DefaultTransform } from '../utils/typegoose';
import { PatientSession as Session } from './patient-session/patient-session';

@injectable()
export class Questions extends Typegoose {
  @ApiModelProperty({
    description: 'id',
    example: '5cefdf1a9b72aa97568e49ef' as any,
    required: true,
    type: 'string',
  })
  public id: string;

  @ApiModelProperty({
    description: 'name of questioonaire',
    example: 'WOMAC' as any,
    required: true,
    type: 'string',
  })
  @prop()
  public name: string;

  @ApiModelProperty({
    description: 'Name of questionnaire to show in UI',
    example: 'WOMAC' as any,
    required: true,
    type: 'string',
  })
  @prop()
  public label: string;

  @ApiModelProperty({
    description: 'payload of Questionnaire',
    example: { question: 'result', answers: ['answer1', 'answer2']} as any,
    required: false,
    type: 'object'
  })
  @arrayProp({ items: Object})
  public sections: Array<Object>;
}


@ApiModel({
  description: 'Questionnaire description',
  name: 'Questionnaire'
})
@injectable()
export class Questionnaire extends Typegoose {

  @ApiModelProperty({
    description: 'id',
    example: '5cefdf1a9b72aa97568e49ef' as any,
    required: true,
    type: 'string',
  })
  public id: string;

  @ApiModelProperty({
    description: 'name',
    example: 'WOMAC' as any,
    required: true,
    type: 'string',
  })
  @prop()
  public name: string;

  @ApiModelProperty({
    description: 'Name of questionnaire to show in UI',
    example: 'WOMAC' as any,
    required: true,
    type: 'string',
  })
  @prop()
  public label: string;

  @ApiModelProperty({
    description: 'session',
    example: '5cefdf1a9b72aa97568e49ef' as any,
    required: true,
    type: 'string',
  })
  @prop({ ref: Session })
  public session: Ref<Session>;

  @ApiModelProperty({
    description: 'questions of Questionnaire',
    example: 'asdad12312dasd1' as any,
    required: false,
    type: 'string'
  })
  @prop({ ref: Questions })
  public questions: Ref<Questions>;

  @ApiModelProperty({
    description: 'Result of Questionnaire',
    example: { name: 'result'} as any,
    required: false,
    type: 'object'
  })
  @prop()
  public result: any;

  @ApiModelProperty({
    description: 'date of Questionnaire filling',
    example: '2019-02-12T11:00:43Z' as any,
    required: false,
    type: 'string'
  })
  @prop()
  fillDate: Date

}

export const QuestionnaireModel = new Questionnaire().getModelForClass(Questionnaire, DefaultTransform);
export const QuestionsModel = new Questions().getModelForClass(Questions, DefaultTransform);