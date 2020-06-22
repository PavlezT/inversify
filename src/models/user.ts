import { prop, arrayProp, Typegoose, Ref, } from 'typegoose'; //  ModelType, InstanceType
import { injectable } from 'inversify';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { Clinic } from './clinic';
import { DefaultTransform } from '../utils/typegoose';
// import * as mongoose from 'mongoose';

enum Status {
  PENDING = 'pending',
  VALIDATED = 'validated',
  ACTIVE = 'active'
}

enum Roles {
  Receptionist = 'receptionist',
  Manager = 'manager',
  ATC = 'ATC'
}

@ApiModel({
  description: 'UserClinic description',
  name: 'UserClinic'
})
export class UserClinic extends Typegoose {
  @ApiModelProperty({
    description: 'Role',
    example: 'manager' as any,
    required: true,
    type: 'string',
  })
  @prop({ enum: Roles, required: true })
  public role: string;

  @ApiModelProperty({
    description: 'Clinic',
    example: '5cefdf1a9b72aa97568e49ef' as any,
    required: true,
    type: 'string',
  })
  @prop({ ref: Clinic, required: true })
  public clinic: Ref<Clinic>;
}

@ApiModel({
  description: 'User description',
  name: 'User'
})
@injectable()
export class User extends Typegoose {
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
    description: 'externalId of user (Cognito)',
    example: 'fd074912-ec37-4829-aa41-eabd776e5519' as any,
    required: true,
    type: 'string'
  })
  @prop()
  public externalId: string;

  @ApiModelProperty({
    description: 'Status of user',
    example: 'active' as any,
    required: true,
    type: 'string'
  })
  @prop({ enum: Status, default: Status.PENDING })
  public status: string;

  @ApiModelProperty({
    description: 'firstname of user',
    example: 'Vasyl' as any,
    required: true,
    type: 'string'
  })
  @prop()
  public firstname?: string;

  @ApiModelProperty({
    description: 'lastname of user',
    example: 'Pupkin' as any,
    required: true,
    type: 'string'
  })
  @prop()
  public lastname?: string;

  @ApiModelProperty({
    description: 'email of user',
    example: 'some@mail.com' as any,
    required: true,
    type: 'string'
  })
  @prop({ required: true })
  public email: string;

  // @ApiModelProperty({
  //   description: 'hashed password of user',
  //   example: 'asd12e1212ewd.x@xasdqwdq.cccasdasdqwww222' as any,
  //   required: false,
  //   type: 'string'
  // })
  // @prop({ required: false })
  // public password: string;
  
  @ApiModelProperty({
    description: 'phonenumber of user',
    example: '+380677709623' as any,
    required: true,
    type: 'string'
  })
  @prop({ required: true })
  public phonenumber: string;

  @ApiModelProperty({
    description: 'Clinics of user',
    example: [{ role: 'manager', clinic: '5cefdf1a9b72aa97568e49ef'}, { role: 'atc', clinic: '5cefdf1a9b72aa97568e49ef'}] as any,
    required: false,
    type: 'array'
  })
  @arrayProp({ items: UserClinic, _id: false })
  public clinics: UserClinic[];
}

export const UserModel = new User().getModelForClass(User, DefaultTransform);
