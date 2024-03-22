import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect('mongodb+srv://db_user_1:1qaz2wsx3edc@cluster0.et0zfcq.mongodb.net/'),
  },
];