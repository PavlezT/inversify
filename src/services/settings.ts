import { injectable } from 'inversify'; // inject
import { Pathologies, PathologiesModel, Surgery, SurgeryModel, MarketingItems, MarketingItemsModel } from '../models';

@injectable()
export class SettingsService {

    public getPathologies(): Promise<Pathologies[]> {
        return PathologiesModel.find() as any;
    }


    public getSurgery(): Promise<Surgery[]> {
        return SurgeryModel.find() as any;
    }


    public getMarketingItems(): Promise<MarketingItems[]> {
        return MarketingItemsModel.find() as any;
    }
}
