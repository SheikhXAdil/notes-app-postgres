import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { db, Note, newNote, notesTable } from "@/lib/drizzle";
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';



export async function GET(request: NextRequest) {

    try {
        await sql`CREATE TABLE IF NOT EXISTS Notes(id varchar(255), Title varchar(255), Note text)`

        const res: Note[] = await db.select().from(notesTable).execute()
        return NextResponse.json({ data: res })
    } catch (error) {
        console.log((error as { message: string }).message)
        return NextResponse.json("Something Went Wrong")
    }

}

export async function POST(request: NextRequest) {

    const req: newNote = await request.json()

    try {
        if (req.title && req.note) {
            const res = await db.insert(notesTable).values({
                id: uuidv4(),
                title: req.title,
                note: req.note
            }).returning().execute()

            return NextResponse.json({ message: "Data Added Successfully", data: res })
        } else {
            throw new Error("Title and Task Fields are required")
        }

    } catch (error) {
        return NextResponse.json({ message: (error as { message: string }).message })

    }
}

export async function DELETE(request: NextRequest) {
    const reqId = request.nextUrl.searchParams.get("id")
    try {
        if (reqId) {
            const res = await db.delete(notesTable).where(eq(notesTable.id, reqId)).returning().execute()
            return NextResponse.json({ message: "Data deleted Successfully", date: res })
        }

    } catch (error) {
        return NextResponse.json({ message: (error as { message: string }).message })

    }

}

export async function PUT(request: NextRequest) {
    const reqId = request.nextUrl.searchParams.get("id")
    const req: newNote = await request.json()

    try {
        if (reqId) {
            const res = await db.update(notesTable)
                .set({
                    title: req.title,
                    note: req.note
                })
                .where(eq(notesTable.id, reqId)).returning().execute()
            return NextResponse.json({ message: "Data updated Successfully", date: res })
        }

    } catch (error) {
        return NextResponse.json({ message: (error as { message: string }).message })

    }
}