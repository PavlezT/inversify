import { prop, Typegoose, Ref} from 'typegoose';
import { injectable } from 'inversify';
import { DefaultTransform } from '../../utils/typegoose';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { Territory } from '../territory';

@ApiModel({
  description: 'Pathologies description',
  name: 'Pathologies'
})
@injectable()
export class Pathologies extends Typegoose {
  @ApiModelProperty({
    description: 'id',
    example: '5cefdf1a9b72aa97568e49ef' as any,
    required: true,
    type: 'string',
  })
  public id: string;

  // some other fields

}

export const PathologiesModel = new Pathologies().getModelForClass(Pathologies, DefaultTransform);
