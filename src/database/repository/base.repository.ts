import { HydratedDocument, Model, PopulateOptions } from 'mongoose';
import { IUser } from '../../common/interfaces'

import { QueryOptions, QueryFilter, UpdateQuery } from 'mongoose';

//TRawDocs means that the class is generic can work with any model not just the user model and it will be defined when we create an instance of the repository in our service, allowing us to have a reusable repository class that can be used with different models throughout our application.
export class DatabaseRrepository<TRawDocs> {
    constructor(private model: Model<TRawDocs>) {

    }


    //partial means that when we create a new document we don't have to provide all the fields defined in the model, only the required ones or the ones we want to set, this is useful for creating new documents without having to specify every single field, especially when some fields have default values or are optional.
    //hydrated document is a mongoose document that has all the methods and properties of a regular mongoose document, but it also has the type information of the raw document, allowing us to have type safety when working with the documents returned from the database. 
    create(data: Partial<TRawDocs>): Promise<HydratedDocument<TRawDocs>> {
        return this.model.create(data);
    }


    //find one document that matches the filter criteria, with optional select and populate parameters to specify which fields to return and which related documents to populate. It returns a promise that resolves to a hydrated document of the specified type.
    findOne(
        filter: Partial<TRawDocs>,
        select?: string | Record<string, 0 | 1>,
        populate?: PopulateOptions | PopulateOptions[]) {

        let docs = this.model.findOne(filter);
        if (select) {
            docs = docs.select(select);
        }
        if (populate) {
            docs = docs.populate(populate);
        }
        return docs;
    }

    findOneAndUpdate(
        filter: QueryFilter<TRawDocs>,
        update: UpdateQuery<TRawDocs>,
        select?: string | Record<string, 0 | 1 | Boolean>,
        options?: QueryOptions,

        populate?: PopulateOptions | PopulateOptions[]) {
        let docs = this.model.findOneAndUpdate(filter, update, {
            new: true,
            ...options,
            runValidators: true,

        });
        if (select) {
            docs = docs.select(select);
        }

        if (populate) {
            docs = docs.populate(populate);
        }

        return docs;
    }


}