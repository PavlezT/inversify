import { injectable } from 'inversify';
import { User, ReportModel } from '../models';
import { BadRequestError } from 'restify-errors';

@injectable()
export class ReportService {

  public async report(user: User, {text, from}: any) {
        if (!text) {
            throw new BadRequestError('Not text field');
        }

        try {
            const report = new ReportModel({
                reporter: user.id,
                text,
                from: from || 'NO_SOURCE',
                createdAt: new Date(Date.now())
            });
            return await report.save();
        } catch (e) {
            console.log('[DBLogger] Could not save log:', e);
            throw new BadRequestError('Report does not saved, check income values');
        }
  }

}
