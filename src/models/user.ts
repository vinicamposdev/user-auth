import {
  prop,
  getModelForClass,
  ReturnModelType,
  plugin,
  DocumentType,
} from '@typegoose/typegoose';
import paginate from 'mongoose-paginate-v2';

@plugin(paginate)
export class User {
  @prop({ required: true, unique: true, trim: true })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ trim: true })
  public name?: string;

  @prop({ trim: true })
  public firstName?: string;

  @prop({ trim: true })
  public lastName?: string;

  @prop({ trim: true })
  public role?: string;

  @prop({ trim: true })
  public passwordResetToken?: string;

  @prop()
  public passwordResetTokenExpires?: Date;

  @prop()
  public id?: string;

  public static async getByEmail(this: ReturnModelType<typeof User>, email: string, flag = true): Promise<DocumentType<User> | null> {
    return this.findOne({ email }).exec();
  }

  public static async getUsers(page: number, limit: number, parsedFilter: Record<string, unknown>): Promise<{ users: User[]; count: number }> {
    const skip = (page - 1) * limit;
  
    const [users, count] = await Promise.all([
      UserModel.find(parsedFilter).skip(skip).limit(limit),
      UserModel.countDocuments(parsedFilter),
    ]);
  
    return { users, count };
  }

  public static async add(this: ReturnModelType<typeof User>, newUser: User): Promise<{name: string, id: string, email: string}> {
    const createdUser = await this.create(newUser)
    const { name, _id, email, role } = createdUser
    return { name, id: _id, email }
  }

  public static async getById(this: ReturnModelType<typeof User>, userId: string, includePassword?: boolean): Promise<DocumentType<User> | null> {
    if (includePassword) {
      return this.findById(userId).exec();
    }
    return this.findById(userId).select('-password').exec();
  }

  public static async updateUser(this: ReturnModelType<typeof User>, userId: string, { password }: { password: string }): Promise<DocumentType<User> | null> {
    const updatedUser = await this.findByIdAndUpdate(userId, { password }, { new: true }).exec();
    if (!updatedUser) {
      throw new Error(`User with id ${userId} not found.`);
    }
    return updatedUser;
  }

  public static async deleteById(this: ReturnModelType<typeof User>, userId: string): Promise<void> {
    const deletedUser = await this.findByIdAndDelete(userId).exec();
    if (!deletedUser) {
      throw new Error(`User with id ${userId} not found.`);
    }
  }
}

const DefaultTransform = {
  schemaOptions: {
    collection: 'users',
    toJSON: {
      virtuals: true,
      getters: true,
      // versionKey: false,
      transform: (doc, ret, options) => {
        delete ret._id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      getters: true,
      transform: (doc, ret, options) => {
        delete ret._id;
        return ret;
      },
    },
  },
};    

export const UserModel = getModelForClass(User, DefaultTransform);
