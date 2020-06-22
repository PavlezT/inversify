import * as AWS from 'aws-sdk';
import { injectable } from 'inversify'; // inject
import { inject } from 'inversify';
import { BadRequestError } from 'restify-errors';
import { TerritoryService } from '../services';
import TYPES from '../config/types';
import config from '../config';

@injectable()
export class DirectoryService {
    s3: any;

    constructor( @inject(TYPES.TerritoryService) private territoryService: TerritoryService ) {
        const { IAM_USER_KEY, IAM_USER_SECRET, SIGNATURE_VERSION, REGION } = config.AWS;

        this.s3 = new AWS.S3({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey: IAM_USER_SECRET,
            signatureVersion: SIGNATURE_VERSION,
            region: REGION
        });
    }

    public async getFile(fileName: string): Promise<any> {
        const options = {
            Bucket: config.AWS.BUCKET_NAME,
            Key: fileName
        };
        let url = null;
        try {
            url =  await this.s3.getSignedUrl('getObject', options);
        } catch(e) {
            throw new BadRequestError('Error while fetching document url');
        }
        return {url: url};
    }

    public async getFilesList(territoryId: string): Promise<any> {
        // this method throws 404 error if no territory or territoryId is invalid
        const territory = await this.territoryService.getTerritory(territoryId);
        
        const options = {
            Bucket: config.AWS.BUCKET_NAME,
            Prefix: `CTS_${territory.name}_Documents/`,
            MaxKeys: 1000
        };
        
        return this.s3.listObjects(options).promise()
            .then(data => {
                return data.Contents.filter(file => {
                    let temp = file.Key.split('/');
                    return temp[1] && temp[1] !== 'testFile.txt'; // watch aposcts/Backend territory create
                });
            }).catch((err) => {
                throw new BadRequestError('Error while fetching documents list from bucket');
            });
    }
}