import { prop, Typegoose } from 'typegoose'; //  ModelType, InstanceType
import { injectable } from 'inversify';
import { DefaultTransform } from '../utils/typegoose';
import { Patient } from './patient';

@injectable()
export class DBLogger extends Typegoose {

    public id: string;
    
    @prop({ required: true })
    public action: string;

    @prop({ required: true })
    public date: Date;

    @prop({ ref: Patient, required: false })
    public user: string;
    
    @prop({ required: false })
    public firstname: string;

    @prop({ required: false })
    public lastname: string;

    @prop({ required: false })
    public email: string;

    @prop({ required: true })
    public body: object;
}

export const DBLoggerModel = new DBLogger().getModelForClass(DBLogger, DefaultTransform);
