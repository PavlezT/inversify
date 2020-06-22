export const DefaultTransform = {
    schemaOptions: {
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (doc, ret, options) => {
                delete ret._id;

                if ( ret.externalId ) {
                    delete ret.externalId;
                }

                return ret;
            }
        }
    }
};
