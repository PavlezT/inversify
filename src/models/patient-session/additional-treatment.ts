import { prop, Typegoose } from 'typegoose'; //  ModelType, InstanceType
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { Area } from './patient-session';

enum Periods {
    MONTH3 = '0-3 months',
    MONTH6 = '3-6 months',
    HALFMONTH = '>6 months',
    YEAR = '>1 year'
}

enum Kind {
    XRAY = 'x-ray',
    CT = 'ct',
    MRI = 'mri',
    SURGERY = 'recommended surgery',
    PHYSIO = 'physiotherapy',
    INJECTION = 'injection',
    MEDICATION = 'pain medications'
}

enum Sessions {
    LESS = '0-5',
    MIDDLE = '6-10',
    MORE = '>10'
}

enum Injection { 
    STEROID = 'Steroid injection',
    ACID = 'Hyaluronic acid injection',
    NONE = 'Do not know'
}

enum Medications {
    OPOIDS = 'Opioids',
    NSAIDS = 'NSAIDs',
    OTHER = 'Other prescription pain medication'
}

enum Frequency {
    DAY = 'Every day',
    WEEK6 = '4-6 times a week',
    WEEK3 = '2-3 times a week',
    WEEK1 = '0-1 times a week'
}

@ApiModel({
    description: 'AdditionalTreatment description',
    name: 'AdditionalTreatment'
})
export class AdditionalTreatment extends Typegoose {
    @ApiModelProperty({
        description: 'type of additional treatment',
        example:  'x-ray' as any,
        required: true,
        type: 'string'
    })
    @prop({ enum: Kind, required: false })
    kind: string;

    @ApiModelProperty({
        description: 'periods of additional treatment',
        example: '3-6 months' as any,
        required: false,
        type: 'string'
    })
    @prop({ enum: Periods })
    period: string;

    @ApiModelProperty({
        description: 'area of AdditionalTreatment',
        example: 'Knee' as any,
        required: false,
        type: 'string'
    })
    @prop({ enum: Area })
    joint: string;

    @ApiModelProperty({
        description: 'number of AdditionalTreatment',
        example: 1 as any,
        required: false,
        type: 'number'
    })
    @prop({ min: 1, max: 5 })
    number: Number;

    @ApiModelProperty({
        description: 'Recommended surgery for AdditionalTreatment (Recommended surgery)',
        example: 'THR revison' as any,
        required: false,
        type: 'string'
    })
    @prop()
    surgery: string;

    @ApiModelProperty({
        description: 'side of AdditionalTreatment (Recommended surgery)',
        example: 'left' as any,
        required: false,
        type: 'string'
    })
    @prop()
    side: string;

    @ApiModelProperty({
        description: 'number of sessions for AdditionalTreatment (Physiotherapy)',
        example: Sessions.MIDDLE as any,
        required: false,
        type: 'string'
    })
    @prop({ enum: Sessions })
    sessions: String;

    @ApiModelProperty({
        description: 'injectionType of AdditionalTreatment (Injection)',
        example: Injection.ACID as any,
        required: false,
        type: 'string'
    })
    @prop({ enum: Injection })
    injectionType: String

    @ApiModelProperty({
        description: 'medicationsType of AdditionalTreatment ( Pain medications)',
        example: Medications.OPOIDS as any,
        required: false,
        type: 'string'
    })
    @prop({ enum: Medications })
    medicationsType: String

    @ApiModelProperty({
        description: 'Frequency of AdditionalTreatment ( Pain medications)',
        example: Frequency.WEEK3 as any,
        required: false,
        type: 'string'
    })
    @prop({ enum: Frequency })
    frequency: String

    @ApiModelProperty({
        description: 'Dont know about this treatment',
        example: false as any,
        required: false,
        type: 'string'
    })
    @prop({ default: false })
    dontKnow: Boolean
}