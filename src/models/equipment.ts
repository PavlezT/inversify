import { prop, Typegoose, pre, arrayProp } from 'typegoose'; //  ModelType, InstanceType
import { injectable } from 'inversify';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { DefaultTransform } from '../utils/typegoose';
// import * as mongoose from 'mongoose';

enum Model {
  Apos3 = 'Apos3',
  Apos4 = 'Apos4'
}

enum Type {
  Velcro = 'Velcro',
  Laces = 'Laces'
}

// enum Part {
//   Anterior = 'Anterior',
//   Exterior = 'Exterior'
// }

// enum Side {
//   Left = 'Left',
//   Right = 'Right'
// }

enum Size {
  Small85 = 85,
  Big95 = 95
}

enum Hardness {
  Hard = 'Hard',
  Soft = 'Soft'
}

enum ShoeType {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D'
}

enum Calibration {
  L1 = 'L1',
  L2 = 'L2',
  L3 = 'L3',
  L4 = 'L4',
  L5 = 'L5',
  L6 = 'L6',
  L7 = 'L7',
  L8 = 'L8',
  M1 = 'M1',
  M2 = 'M2',
  M3 = 'M3',
  M4 = 'M4',
  M5 = 'M5',
  M6 = 'M6',
  M7 = 'M7',
  M8 = 'M8',
  none = '0'
}

@ApiModel({
  description: 'Shoe description',
  name: 'Shoe'
})
export class Shoe extends Typegoose {

  // @ApiModelProperty({
  //   description: 'part of Shoe of Equipment',
  //   example: 'Anterior' as any,
  //   required: true,
  //   type: 'string'
  // })
  // @prop({ enum: Part  })
  // part: string;

  // @ApiModelProperty({
  //   description: 'side of Shoe of Equipment',
  //   example: 'Left' as any,
  //   required: true,
  //   type: 'string'
  // })
  // @prop({ enum: Side })
  // side: string;

  @ApiModelProperty({
    description: 'size of Equipment',
    example: 85 as any,
    required: true,
    type: 'number'
  })
  @prop({ enum: Size })
  public size: number;

  @ApiModelProperty({
    description: 'hardness of Shoe of Equipment',
    example: 'Hard' as any,
    required: true,
    type: 'string'
  })
  @prop({ enum: Hardness })
  public hardness: string;

  @ApiModelProperty({
    description: 'type of Shoe of Equipment',
    example: 'A' as any,
    required: true,
    type: 'string'
  })
  @prop({ enum: ShoeType })
  public type: string;


  @ApiModelProperty({
    description: 'spaces of Shoe of Equipment',
    example: 5 as any,
    required: false,
    type: 'number'
  })
  @prop({ max: 10, min: 0 })
  public spaces: number;


  @ApiModelProperty({
    description: 'weights of Shoe of Equipment',
    example: 5 as any,
    required: false,
    type: 'number'
  })
  @prop({ max: 10, min: 0 })
  public weights: number;

  @ApiModelProperty({
    description: 'calibration of Shoe (if model == Apos4)',
    example: 'L8' as any,
    required: false,
    type: 'string'
  })
  @prop({ enum: Calibration })
  public calibration: string;

  @ApiModelProperty({
    description: 'pointer of Shoe (if part == Anterior)',
    example: 5 as any,
    required: false,
    type: 'number'
  })
  @prop({ max: 5, min: 0 })
  public pointer: number;

  @ApiModelProperty({
    description: 'scale of Shoe (if part == Exterior)',
    example: -1 as any,
    required: false,
    type: 'number'
  })
  @prop({ max: 2, min: -5 })
  public scale: number;
}

@ApiModel({
  description: 'Equipment description',
  name: 'Equipment'
})
@injectable()
@pre<Equipment>('save', function(next) {
  // if (this.model === Model.Apos3) {
  //   this.shoeAnteriorLeft = null;
  //   this.shoeExteriorLeft = null;
  //   this.shoeExteriorRight = null;
  //   this.shoeAnteriorRight = null;
  // } else {
  //   if (!this.shoeAnteriorLeft || !this.shoeExteriorLeft || !this.shoeExteriorRight || !this.shoeAnteriorRight) {
  //     return next(new Error('no both shoes specificated'));
  //   }

  //   this.shoeAnteriorLeft.scale = null;
  //   this.shoeExteriorLeft.pointer = null;
  //   this.shoeAnteriorRight.scale = null;
  //   this.shoeExteriorRight.pointer = null;
  // }

  next();
})
export class Equipment extends Typegoose {
  // @prop({_id: true})
  // _id: mongoose.Types.ObjectId;

  @ApiModelProperty({
    description: 'id',
    example: '5cefdf1a9b72aa97568e49ef' as any,
    required: true,
    type: 'string',
  })
  public id: string;

  @ApiModelProperty({
    description: 'model of Equipment',
    example: 'Apos3' as any,
    required: true,
    type: 'string'
  })
  @prop({ enum: Model  })
  public model: string;

  @ApiModelProperty({
    description: 'type of Equipment',
    example: 'Velcro' as any,
    required: true,
    type: 'string'
  })
  @prop({ enum: Type })
  public type: string;

  @ApiModelProperty({
    description: 'sensor of Equipment',
    example: true as any,
    required: false,
    type: 'boolean'
  })
  @prop({ default: false })
  public sensor: boolean;


  @ApiModelProperty({
    description: 'size of Equipment',
    example: 35 as any,
    required: false,
    type: 'number'
  })
  @prop({ max: 51, min: 35 })
  public size: number;

  @ApiModelProperty({
    description: 'bag of Equipment',
    example: true as any,
    required: false,
    type: 'boolean'
  })
  @prop({ default: false })
  public bag: boolean;

  @ApiModelProperty({
    description: 'shoe of Equipment',
    // example: { } as any,
    required: false,
    model: 'Shoe'
  })
  @prop()
  public shoeAnteriorLeft: Shoe;

  @ApiModelProperty({
    description: 'shoe of Equipment',
    // example: { } as any,
    required: false,
    model: 'Shoe'
  })
  @prop()
  public shoeAnteriorRight: Shoe;

  @ApiModelProperty({
    description: 'shoe exterior left of Equipment',
    // example: { } as any,
    required: false,
    model: 'Shoe'
  })
  @prop()
  public shoeExteriorLeft: Shoe;

  @ApiModelProperty({
    description: 'shoe exterior of Equipment',
    // example: { } as any,
    required: false,
    model: 'Shoe'
  })
  @prop()
  public shoeExteriorRight: Shoe;
}

export const EquipmentModel = new Equipment().getModelForClass(Equipment, DefaultTransform);
