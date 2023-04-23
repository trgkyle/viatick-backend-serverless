import { Schema } from 'dynamoose';

export const UserSchema = new Schema({
  username: {
    type: String,
    hashKey: true,
  },
  password: {
    type: String,
  },
});
