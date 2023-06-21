"use client"
import { Note } from "@/lib/drizzle"
import { Pencil, TrashIcon } from 'lucide-react'
import { useRouter } from "next/navigation"
import UpdateNote from "./UpdateNote"
import FullNote from "./FullNote"
import { useState, useTransition } from "react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const NoteCard = ({ note }: { note: Note }) => {

    let router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [isPending, startTransition] = useTransition();
    const isMutating = isDeleting || isPending

    const handleDelete = async (id: string, router: any) => {
        setIsDeleting(true)
        try {
            const res = await fetch(`/api/notes?id=${id}`, {
                method: "delete"
            })
            if (!res.ok) {
                throw new Error(`HTTP Error: ${res.status}`);
            } else {
                toast.success("Task deleted successfully")
                startTransition(() => {
                    // Refresh the current route and fetch new data from the server without
                    // losing client-side browser or React state.
                    router.refresh();
                });
            }
        } catch (error) {
            console.log(error)
        }
        setIsDeleting(false)
    }

    return (
        <div>

            <div className='col-span-4 md:col-span-2 lg:col-span-1 h-64 rounded-lg flex flex-col justify-between gap-4 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative'>

                <div className="flex flex-col gap-3">
                    <div className="flex gap-4">
                        <h3 className="text-xl font-semibold">{note.title.length > 40 ? `${note.title.slice(0, 20)}...` : note.title}</h3>
                        <FullNote note={note} />
                    </div>
                    <p>{note.note.length > 40 ? `${note.note.slice(0, 45)}...` : note.note}</p>
                </div>

                <div className="flex gap-3 justify-between">

                    <div className="flex items-center gap-3">
                        <div className={`${isDeleting ? "bg-gray-400" : "bg-gray-800"} rounded-full flex justify-center items-center w-10 h-10 cursor-pointer hover:scale-110`}>
                            <UpdateNote note={note} />
                        </div>

                        <div onClick={async () => await handleDelete(note.id, router)} className={`${isMutating ? "bg-gray-400" : "bg-gray-800"} rounded-full flex justify-center items-center w-10 h-10 cursor-pointer hover:scale-110`}>
                            <TrashIcon className="text-white w-6 h-6" />
                        </div>
                    </div>

                </div>

            </div>

            <ToastContainer />
        </div>
    )
}

export default NoteCard
