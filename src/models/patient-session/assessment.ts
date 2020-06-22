import { prop, Typegoose } from 'typegoose'; //  ModelType, InstanceType
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
    description: 'Assessment description',
    name: 'Assessment'
})
export class Assessment extends Typegoose {
    @ApiModelProperty({
          description: 'id of ActivityStatus',
          example:  '5ce6976c920b7739d19cb4dd' as any,
          required: false,
          type: 'string'
      })
    @prop()
    suitability: string;
  
    @ApiModelProperty({
          description: 'reason of Assessment',
          example: 'dont know' as any,
          required: false,
          type: 'string'
      })
    @prop()
    reason: string;
  
    @ApiModelProperty({
          description: 'comment about Assessment',
          example: 'I think it is needed' as any,
          required: false,
          type: 'string'
      })
    @prop()
    comment: string;
}