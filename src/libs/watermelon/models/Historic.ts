import { Model, Relation } from "@nozbe/watermelondb";
import { field, date, children } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import { Location } from "./Location";

export class Historic extends Model {
  static table = "historic";
  static associations: Associations = {
    location: { type: "has_many", foreignKey: "historic_id" },
  };

  @field("user_id")
  user_id!: string;

  @field("license_plate")
  license_plate!: string;

  @field("description")
  description!: string;

  @field("status")
  status!: string;

  @date("created_at")
  created_at!: Date;

  @date("updated_at")
  updated_at!: Date;

  @children("location") location!: Relation<Location>;
}
