import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  timestamp,
  varchar,
  numeric,
  integer,
} from "drizzle-orm/pg-core";

export const carts = pgTable("carts", {
  id: serial("id").primaryKey(), // for db record
  customerId: integer("customer_id").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Cart = InferSelectModel<typeof carts>;