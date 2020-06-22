import { prop, Typegoose } from 'typegoose'; //  ModelType, InstanceType
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';


enum NextSessionRecomendation {
    APPOINTMENT = 'appointment',
    CALL = 'call'
}
  
enum RecommendationTime {
    DAYS10 = '10 days',
    WEEKS3 = '3-4 weeks',
    WEEKS6 = '6-8 weeks',
    MONTH3 = '3 months'
}

@ApiModel({
    description: 'PT recommendation description',
    name: 'PTRecommendation'
})
export class PTRecommendation extends Typegoose {
    @ApiModelProperty({
        description: 'text of next action',
        example:  'some text as recoomendation' as any,
        required: false,
        type: 'string'
    })
    @prop()
    text: string;

    @ApiModelProperty({
          description: 'type of next action',
          example:  NextSessionRecomendation.CALL as any,
          required: false,
          type: 'string'
      })
    @prop({enum: NextSessionRecomendation, default: NextSessionRecomendation.CALL})
    next: string;
  
    @ApiModelProperty({
          description: 'time to skip before the next action',
          example: RecommendationTime.DAYS10 as any,
          required: false,
          type: 'string'
      })
    @prop({ enum: RecommendationTime })
    time: string;
}