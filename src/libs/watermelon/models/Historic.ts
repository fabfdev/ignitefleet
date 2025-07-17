import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export class Historic extends Model {
  static table = 'historic';

  @field('user_id')
  user_id!: string;

  @field('license_plate')
  license_plate!: string;

  @field('description')
  description!: string;

  @field('status')
  status!: string;

  @date('created_at')
  created_at!: Date;

  @date('updated_at')
  updated_at!: Date;
}
