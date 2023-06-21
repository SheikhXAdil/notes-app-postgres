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
import { useState, useTransition } from "react"
import { Input } from "./ui/input"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const AddNote = () => {

    const [title, setTitle] = useState("")
    const [note, setNote] = useState("")

    const [isUpdating, setIsUpdating] = useState(false)
    const [isPending, startTransition] = useTransition();
    const isMutating = isUpdating || isPending

    const router = useRouter()

    const handleAdd = async (title: (string | null), note: (string | null), router: any) => {
        setIsUpdating(true)
        try {
            if (title && note) {
                const res = await fetch(`/api/notes`, {
                    method: "post",
                    body: JSON.stringify({
                        title: title,
                        note: note
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
                        setNote("")
                        setTitle("")
                    });
                }
            } else {
                throw new Error("Values were not given, so no addition occured");
            }
        } catch (error) {
            toast.error((error as { message: string }).message)
        }
        setIsUpdating(false)
    }


    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger className={`fixed bottom-4 sm:bottom-10 right-4 sm:right-10 w-12 sm:w-16 h-12 sm:h-16 rounded-full ${isMutating ? "bg-gray-400" : "bg-gray-800"} flex justify-center items-center hover:scale-110`}><Plus className="text-white w-8 sm:w-10 h-8 sm:h-10" /></AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader className="flex flex-col gap-10">
                        <AlertDialogTitle className="text-2xl">Enter Details</AlertDialogTitle>
                        <AlertDialogDescription className="flex flex-col gap-6">
                            <div className="flex flex-col gap-4">
                                <h2 className="text-xl font-semibold">Enter Title (Required)</h2>
                                <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-4">
                                <h2 className="text-xl font-semibold">Enter Note (Required)</h2>
                                <Input required value={note} onChange={(e) => setNote(e.target.value)} />
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={async () => await handleAdd(/\S/.test(title) ? title : null, /\S/.test(note) ? note : null, router)}>Add</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <ToastContainer />
        </>
    )
}

export default AddNote
