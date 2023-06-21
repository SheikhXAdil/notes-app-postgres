"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Note } from "@/lib/drizzle"
import { useState, useTransition } from "react"
import { Input } from "./ui/input"
import { useRouter } from "next/navigation"
import { Pencil } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const UpdateNote = ({ note }: { note: Note }) => {

    const [updatedTitle, setUpdatedTitle] = useState(note.title)
    const [updatedNote, setUpdatedNote] = useState(note.note)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isPending, startTransition] = useTransition();
    const isMutating = isUpdating || isPending


    const router = useRouter()

    const handleUpdate = async (id: string, newTitle: string, newNote: string, router: any) => {
        setIsUpdating(true)
        try {
            if (newTitle !== "" && newNote !== "") {
                const res = await fetch(`/api/notes?id=${id}`, {
                    method: "put",
                    body: JSON.stringify({
                        title: newTitle,
                        note: newNote
                    })
                })
                if (!res.ok) {
                    throw new Error(`HTTP Error: ${res.status}`);
                } else {
                    toast.success("Task added successfully")
                    startTransition(() => {
                        // Refresh the current route and fetch new data from the server without
                        // losing client-side browser or React state.
                        router.refresh();
                    });
                }
            } else {
                throw new Error("Updated values were not given, so no update occured");
            }
        } catch (error) {
            toast.error((error as { message: string }).message)
        }
        setIsUpdating(false)
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <div className={`${isMutating ? "bg-gray-400" : "bg-gray-800"} rounded-full flex justify-center items-center w-10 h-10 cursor-pointer hover:scale-110`}>
                    <Pencil className="text-white w-6 h-6" />
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader className="flex flex-col gap-10">
                    <AlertDialogTitle className="text-2xl">Enter New Details</AlertDialogTitle>
                    <AlertDialogDescription className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-semibold">Enter Updated Title (Required)</h2>
                            <Input required value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-semibold">Enter Updated Note (Required)</h2>
                            <Input required value={updatedNote} onChange={(e) => setUpdatedNote(e.target.value)} />
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={async () => await handleUpdate(note.id, /\S/.test(updatedTitle) ? updatedTitle : "", /\S/.test(updatedNote) ? updatedNote : "", router)}>Update</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default UpdateNote
