import { prop, getModelForClass, ReturnModelType, plugin } from '@typegoose/typegoose';
import paginate from 'mongoose-paginate-v2';

export class ClientInfo {
  @prop()
  id: string;

  @prop()
  userAgent: string;

  @prop()
  browser: string;

  @prop()
  browser_version: string;

  @prop()
  device: string;

  @prop()
  version: string;

  @prop()
  os: string;

  @prop()
  os_version: string;
}

@plugin(paginate)
export class RefreshToken {
  @prop({ required: true })
  _id?: string;

  @prop({ _id: false })
  userId: string;

  // @prop({ _id: false, ref: ClientInfo })
  // client: ClientInfo;

  @prop()
  expiresIn: Date;

  @prop()
  createdAt: Date;

  @prop()
  updatedAt: Date;

  get id() {
    return this._id;
  }
  set id(id: string) {
    this._id = id;
  }

  static async getByToken(this: ReturnModelType<typeof RefreshToken>, token: string) {
    return this.findOne({ _id: token });
  }

  static async getByUser(this: ReturnModelType<typeof RefreshToken>, userId: string) {
    return this.find({ userId });
  }

  static async add(
    this: ReturnModelType<typeof RefreshToken>,
    token: string,
    expiresIn: Date,
    userId: string,
    client: ClientInfo
  ) {
    const now = new Date();
    const newDoc = new RefreshTokenModel({
      _id: token,
      userId,
      client,
      expiresIn,
      createdAt: now,
      updatedAt: now,
    });
    return newDoc.save();
  }

  static async deleteToken(this: ReturnModelType<typeof RefreshToken>, token: string) {
    return this.deleteOne({ _id: token });
  }
}

const DefaultTransform = {
  schemaOptions: {
    collection: 'refresh-tokens',
    toJSON: {
      virtuals: true,
      // versionKey: false,
      transform: (doc, ret, options) => {
        delete ret._id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret, options) => {
        delete ret._id;
        return ret;
      },
    },
  },
};

export const RefreshTokenModel = getModelForClass(RefreshToken, DefaultTransform);
