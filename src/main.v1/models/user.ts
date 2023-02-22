import {
  DocumentType, getModelForClass, plugin, prop, ReturnModelType
} from '@typegoose/typegoose';
import {Types} from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import {Role} from './role';

@plugin(paginate)
export class User {
  @prop({ required: true, unique: true, trim: true })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ trim: true })
  public name!: string;

  @prop({ enum: Role, type: Number })
  public role!: Role;

  @prop()
  public dob?: Date;

  @prop({ trim: true })
  public passwordResetToken?: string;

  @prop()
  public passwordResetTokenExpires?: Date;

  @prop({unique: true})
  public accessToken?: string;

  @prop()
  public id?: Types.ObjectId;

  public static async getByEmail(this: ReturnModelType<typeof User>, email: string, flag = true): Promise<DocumentType<User> | null> {
    return this.findOne({ email }).exec();
  }

  public static async getByToken(this: ReturnModelType<typeof User>, accessToken: string): Promise<DocumentType<User> | null> {
    return this.findOne({ accessToken }).exec();
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
