import { prop, arrayProp, Typegoose, Ref, } from 'typegoose'; //  ModelType, InstanceType
import { injectable } from 'inversify';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { DefaultTransform } from '../utils/typegoose';
import { Questionnaire } from './questionnaire';

@ApiModel({
  description: 'OutcomeData description',
  name: 'OutcomeData'
})
@injectable()
export class OutcomeData extends Typegoose {

  @ApiModelProperty({
    description: 'param of graph data',
    example: 'Stiffness' as any,
    required: false,
    type: 'string',
  })
  @prop()
  public param: string;

  @ApiModelProperty({
    description: 'value of graph data',
    example: 62 as any,
    required: false,
    type: 'number',
  })
  @prop()
  public value: number | boolean;
}

@ApiModel({
  description: 'Outcome description',
  name: 'Outcome'
})
@injectable()
export class Outcome extends Typegoose {

  @ApiModelProperty({
    description: 'id',
    example: '5cefdf1a9b72aa97568e49ef' as any,
    required: false,
    type: 'string',
  })
  public id: string;

  @ApiModelProperty({
    description: 'name of outcome data',
    example: 'WOMAC' as any,
    required: false,
    type: 'string',
  })
  @prop()
  public name: string;

  @ApiModelProperty({
    description: 'Label of outcome data',
    example: 'WOMAC' as any,
    required: false,
    type: 'string',
  })
  @prop()
  public label: string;

  @ApiModelProperty({
    description: 'type of chart',
    example: 'bar' as any,
    required: false,
    type: 'string',
  })
  @prop({ default: 'bar' })
  public type: string;

  @ApiModelProperty({
    description: 'params of outcome data',
    example: ["Pain","Stiffness","Function","Total"] as any,
    required: false,
    type: 'array',
  })
  @arrayProp({ items: String })
  public params: string;

  @ApiModelProperty({
    description: 'date of calculating results',
    example: '2019-12-04' as any,
    required: false,
    type: 'string',
  })
  @prop({ default: Date.now })
  public date: Date;

  @ApiModelProperty({
    description: 'computed data',
    // example: { points: [] } as any,
    // required: false,
    type: 'array',
    model: 'OutcomeData'
  })
  @arrayProp({ _id: false, items: OutcomeData })
  public points: OutcomeData[];

  @ApiModelProperty({
    description: 'Questionnaire for Outcome',
    example: '5cefdf1a9b72aa97568e49ef' as any,
    required: true,
    type: 'string'
  })
  @prop({ ref: Questionnaire, required: true })
  questionnaire: Ref<Questionnaire>;
}

export const OutcomeModel = new Outcome().getModelForClass(Outcome, DefaultTransform);

/// WOMAC
// {
//   name: 'WOMAC',
//   questionnaire,
//   params: ['Pain','Stiffness','Function','Total'],
//   date: Date.now(),
//   points: [
//       {
//           param: 'Pain',
//           value: 50.5
//       },
//       {
//           param: 'Stiffness',
//           value: 50.5
//       },
//       {
//           param: 'Function',
//           value: 50.5
//       },
//       {
//           param: 'Total',
//           value: 50.5
//       }
//   ]
// };

/// SF-56
// {
//   name: 'SF-36',
//   questionnaire,
//   params: ['Function_physical','Function_social','Pain', 'Limitation_physical_health','Limitation_emotional_health',
//   'Emotional_wellness', 'Energy', 'General_health', 'Physical_summary', 'Mental_summary', 'Irritability','Total'],
//   date: Date.now(),
//   points: [ ... ]
// };

/// KOOS
// {
//   name: 'KOOS',
//   questionnaire,
//   params: ['Symptoms','ADL','Pain', 'Sport','QoL', 'Total'],
//   date: Date.now(),
//   points: [ ... ]
// }

/// FAOS
// {
//   name: 'FAOS',
//   questionnaire,
//   params: ['Symptoms','ADL','Pain', 'Sport','QoL', 'Total'],
//   date: Date.now(),
//   points: [ ... ]
// }

/// ED-5D
// {
//   name: 'ED-5D',
//   questionnaire,
//   params: ['Mobility','Self-care','Activity', 'Anxiety','Pain', 'EQ_VAS', 'Total'],
//   date: Date.now(),
//   points: [ ... ]
// }

/// Oswestry
// {
//   name: 'Oswestry',
//   questionnaire,
//   params: ['VAS', 'Score'],
//   date: Date.now(),
//   points: [ ... ]
// }