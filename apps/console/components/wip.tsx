import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { SquareArrowOutUpRight } from "lucide-react"
import Link from "next/link"

  export default function WIPAlert({open}: {open: boolean}) {
    return (
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Work In Progress</AlertDialogTitle>
            <AlertDialogDescription>
              The app is currently under development. Please check back later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link href="https://l.devwtf.in/plura-dc" target="_blank" rel="noopener noreferrer">
            <Button variant={"outline"}>
            <SquareArrowOutUpRight />
            Discord Server
            </Button>
            </Link>
            <Link href="https://git.new/prexo" target="_blank" rel="noopener noreferrer">
              <Button variant={"outline"}>
                <SquareArrowOutUpRight />
                GitHub
              </Button>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  