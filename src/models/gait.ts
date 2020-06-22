import { prop, Typegoose, Ref } from 'typegoose';
import { injectable } from 'inversify';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { DefaultTransform } from '../utils/typegoose';
import { Clinic } from './clinic';

@ApiModel({
    description: 'GAIT data by patient',
    name: 'GAIT'
})

@injectable()
export class Gait extends Typegoose {
    @ApiModelProperty({
        description: 'id',
        example: '5cefdf1a9b72aa97568e49ef' as any,
        required: false,
        type: 'string',
    })
    public id: string;

    @ApiModelProperty({
        description: 'Patient internal id',
        example: '5cefdf1a9b72aa97568e49ef' as any,
        required: true,
        type: 'string'
    })
    @prop({ ref: Clinic, required: true, unique: true })
    public clinicId: Ref<Clinic>;

    @ApiModelProperty({
        description: 'externalId of Patient',
        example: '12345' as any,
        required: true,
        type: 'string'
      })
      @prop({ required: true })
      public ID: string;
      
      @ApiModelProperty({
        description: 'type of gait',
        example: 'ZM' as any,
        required: true,
        type: 'string'
      })
      @prop({ required: false })
      public type: string;

    @ApiModelProperty({
        description: 'date of GAIT data uploaded',
        example: '23/08/2018 13:44:08' as any,
        required: true,
        type: 'string',
    })
    @prop({ required: true })
    public TestDate: string;

    @ApiModelProperty({
        description: 'Created at date',
        example: '2019-06-18T15:05:11.000+00:00' as any,
        required: true,
        type: 'string',
    })
    @prop({ required: true })
    public createdAt: Date;

    @ApiModelProperty({
        description: 'Step Length Left (cm.)',
        example: 39.20 as any,
        required: true,
        type: 'number',
    })
    @prop({ required: true })
    public StepLen_L: number;

    @ApiModelProperty({
        description: 'Step Length Right (cm.)',
        example: 39.20 as any,
        required: true,
        type: 'string',
    })
    @prop({ required: true })
    public StepLen_R: number;

    @ApiModelProperty({
        description: 'Velocity (cm./sec.)',
        example: 69 as any,
        required: true,
        type: 'number',
    })
    @prop({ required: true })
    public Velocity: number;

    @ApiModelProperty({
        description: 'Single Support Left (sec.)',
        example: 32.20 as any,
        required: true,
        type: 'number',
    })
    @prop({ required: true })
    public SSuppTime_L: number;

    @ApiModelProperty({
        description: 'Single Support Right (sec.)',
        example: 34.20 as any,
        required: true,
        type: 'number',
    })
    @prop({ required: true })
    public SSuppTime_R: number;
}

export const GaitModel = new Gait().getModelForClass(Gait, DefaultTransform);