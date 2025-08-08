"use client"

import { useId, useState } from "react"
import { CircleAlertIcon, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export default function DeleteProject({name}: {name: string}) {
  const PROJECT_NAME = name;
  const id = useId()
  const [inputValue, setInputValue] = useState("")

  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button
                size="sm"
                className="w-fit flex items-center justify-end gap-2 bg-red-700 hover:bg-red-800 text-primary"
                type="button"
              >
                <Trash2 size={16} />
                Delete Project
              </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Final confirmation
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              To confirm, please enter the project name.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <div className="*:not-first:mt-2">
            <Label htmlFor={id}>Project name</Label>
            <Input
              id={id}
              type="text"
              placeholder={`Type "${name}" to confirm`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1" onClick={() => setInputValue('')}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="flex-1 bg-red-700 hover:bg-red-800 text-primary"
              disabled={inputValue !== PROJECT_NAME}
            >
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
