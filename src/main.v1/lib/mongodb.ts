import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

let conn: any = null;

export default class Mongo {
  static async connect() {
    const uri: string = process.env['MONGO_URI'];
    const production: boolean = process.env['production'] === 'true';
    const limit: number = 2 //parseInt(process.env['PAGE_LIMIT']);
    mongoosePaginate.paginate.options = {
      lean: true,
      leanWithId: false,
      limit,
    };

    if (!production) {
      mongoose.set('debug', { shell: true });
    }

    const connection = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    })
    console.log('Connected correctly to Mongo server');
    return connection;
  }

  static async getConnection() {
    if (conn) {
      return conn;
    }

    conn = await this.connect();
    return conn;
  }
}
