import {
    pgTable,
    serial,
    text,
    varchar,
} from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { InferModel } from "drizzle-orm";
import { sql } from "@vercel/postgres";

export const notesTable = pgTable("notes", {
    id: varchar("id", { length: 255 }).primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    note: text("note").notNull()
})

export type Note = InferModel<typeof notesTable>
export type newNote = InferModel<typeof notesTable, "insert">

export const db = drizzle(sql)