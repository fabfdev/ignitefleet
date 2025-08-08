import { Model, Relation } from "@nozbe/watermelondb";
import { date, field, relation } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import { Historic } from "./Historic";

export class Location extends Model {
  static table = "location";
  static associations: Associations = {
    historic: { type: "belongs_to", key: "historic_id" },
  };

  @field("latitude")
  latitude!: number;

  @field("longitude")
  longitude!: number;

  @date("timestamp")
  timestamp!: Date;

  @relation("historic", "historic_id") historic!: Relation<Historic>;
}
