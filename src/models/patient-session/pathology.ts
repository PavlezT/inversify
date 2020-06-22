import { prop, Typegoose } from 'typegoose'; //  ModelType, InstanceType
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
    description: 'PathologyInfo description of Pathology',
    name: 'PathologyInfo'
})
export class PathologyInfo extends Typegoose {
    @ApiModelProperty({
        description: 'type of next action',
        example:  'Knee' as any,
        required: false,
        type: 'string'
    })
    @prop()
    area: string;

    @ApiModelProperty({
        description: 'condition of sided area',
        example: 'good' as any,
        required: false,
        type: 'string'
    })
    @prop()
    condition: string;

    @ApiModelProperty({
        description: 'side of Pathology',
        example: 'left' as any,
        required: false,
        type: 'string'
    })
    @prop()
    side: string;
}

@ApiModel({
    description: 'Pathology description',
    name: 'Pathology'
})
export class Pathology extends Typegoose {
    @ApiModelProperty({
        description: 'primary pathology',
        // example:  NextSessionRecomendation.CALL as any,
        required: false,
        // type: 'object'
        model: 'PathologyInfo'
    })
    @prop({_id: false })
    primary: PathologyInfo;

    @ApiModelProperty({
        description: 'secondary pathology',
        // example: RecommendationTime.DAYS10 as any,
        required: false,
        // type: 'object'
        model: 'PathologyInfo'
    })
    @prop({_id: false })
    secondary: PathologyInfo;

    @ApiModelProperty({
        description: 'other pathology areas/sides/conditions',
        example: 'Neck' as any,
        required: false,
        type: 'string'
    })
    @prop()
    other: string;
}