import { prop, Typegoose } from 'typegoose';
import { injectable } from 'inversify';
import { DefaultTransform } from '../../utils/typegoose';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  description: 'MarketingItems description',
  name: 'MarketingItems'
})
@injectable()
export class MarketingItems extends Typegoose {
  @ApiModelProperty({
    description: 'id',
    example: '5cefdf1a9b72aa97568e49ef' as any,
    required: true,
    type: 'string',
  })
  public id: string;

  @ApiModelProperty({
    description: 'name',
    example: 'SOme stuff' as any,
    required: true,
    type: 'string'
  })
  @prop({unique: true, required: true})
  public text: string;

  @ApiModelProperty({
    description: 'name',
    example: '95%' as any,
    required: true,
    type: 'number'
  })
  @prop({required: true})
  public count: string;
}

export const MarketingItemsModel = new MarketingItems().getModelForClass(MarketingItems, DefaultTransform);
