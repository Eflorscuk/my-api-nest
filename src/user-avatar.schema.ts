import * as mongoose from 'mongoose';

export const UserAvatarSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  image: { type: Buffer, required: true },
});

export interface UserAvatar extends mongoose.Document {
  id: string;
  userId: string;
  image: Buffer;
  remove: () => Promise<void>;
}

export const UserAvatarModel = mongoose.model<UserAvatar>(
  'UserAvatar',
  UserAvatarSchema,
);
