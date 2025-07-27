import { Model } from "@nozbe/watermelondb";
import { date, field } from "@nozbe/watermelondb/decorators";

export class Log extends Model {
  static table = "log";

  @field("user_id")
  user_id!: string;

  @date("updated_at")
  updated_at!: Date;
}
