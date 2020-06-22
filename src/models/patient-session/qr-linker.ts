import { prop, Typegoose, Ref } from 'typegoose'; //  ModelType, InstanceType
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { DefaultTransform } from '../../utils/typegoose';
import { PatientSession } from './patient-session';
import { Patient } from '../patient';

@ApiModel({
    description: 'QR linker description',
    name: 'QRLinker'
})
export class QrLinker extends Typegoose {
    @ApiModelProperty({
        description: 'id',
        example: '5cefdf1a9b72aa97568e49ef' as any,
        required: false,
        type: 'string',
    })
    public id: string;

    @ApiModelProperty({
        description: 'token',
        example: 'e234.asdasd1.1231asdasd&^*&^*^' as any,
        required: false,
        type: 'string',
    })
    @prop()
    public token: string;

    @ApiModelProperty({
        description: 'date of token expiry',
        example: '2019-06-05T10:41:23.381Z' as any,
        required: false,
        type: 'string',
    })
    @prop()
    public expiryDate: Date;
    
    @ApiModelProperty({
          description: 'id of patient',
          example:  '5ce6976c920b7739d19cb4dd' as any,
          required: false,
          type: 'string'
      })
    @prop({ ref: Patient })
    patient: Ref<Patient>;
  
    @ApiModelProperty({
          description: 'id of session',
          example: '5ce6976c920b7739d19cb4dd' as any,
          required: false,
          type: 'string'
      })
    @prop({ ref: PatientSession })
    session: Ref<PatientSession>;
}

export const QrLinkerModel = new QrLinker().getModelForClass(QrLinker, DefaultTransform);