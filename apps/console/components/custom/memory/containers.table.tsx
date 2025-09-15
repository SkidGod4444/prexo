"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { useReadLocalStorage } from "usehooks-ts";
import { useContainersStore } from "@prexo/store";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CONTAINERS_API_ENDPOINT =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3001/v1/container"
    : "https://api.prexoai.xyz/v1/container";

export default function ContainersTable() {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const consoleId = useReadLocalStorage("@prexo-#consoleId");
  const { containers, addContainer, removeContainer } = useContainersStore();

  const isAllSelected =
    selectedItems.length === containers.length && containers.length > 0;
  const isIndeterminate =
    selectedItems.length > 0 && selectedItems.length < containers.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(containers.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  const handleDeleteSelected = async () => {
    setIsLoading(true);
    toast.promise(
      Promise.all(
        selectedItems.map(async (itemId) => {
          const res = await fetch(`${CONTAINERS_API_ENDPOINT}/delete`, {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "x-project-id": typeof consoleId === "string" ? consoleId : "",
            },
            body: JSON.stringify({ id: itemId }),
          });
          if (!res.ok) {
            throw new Error(`Failed to delete container with id: ${itemId}`);
          }
          removeContainer(itemId);
        }),
      ),
      {
        loading: "Deleting selected containers...",
        success: "Selected containers deleted successfully!",
        error: "Failed to delete one or more containers.",
      },
    );
    setIsLoading(false);
    setSelectedItems([]);
  };

  const handleDeleteSingle = async (itemId: string) => {
    const data = await fetch(`${CONTAINERS_API_ENDPOINT}/delete`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-project-id": typeof consoleId === "string" ? consoleId : "",
      },
      body: JSON.stringify({
        id: itemId,
      }),
    });
    console.log(data);
    toast.success("Container deleted successfully!");
    removeContainer(itemId);
    setSelectedItems((prev) => prev.filter((id) => id !== itemId));
  };

  const handleOnClick = (itemKey: string) => {
    router.push(`/memory/container/${itemKey}`);
  };

  const handleAddItem = async () => {
    if (!name.trim()) {
      return;
    }
    setIsLoading(true);
    const data = await fetch(`${CONTAINERS_API_ENDPOINT}/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-project-id": typeof consoleId === "string" ? consoleId : "",
      },
      body: JSON.stringify({
        name: name,
        description: desc,
        projectId: consoleId,
      }),
    });

    if (!data.ok) {
      setIsLoading(false);
      setName("");
      setDesc("");
      throw new Error(`Failed to create container: ${data.status}`);
    }

    const response = await data.json();
    if (response.container) {
      addContainer(response.container);
    }
    setIsLoading(false);
    setName("");
    setDesc("");
    setIsAddDialogOpen(false);
  };

  return (
    <div>
      <div className="mb-4 flex justify-end items-center">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size={"sm"}>
              <Plus className=" h-4 w-4" />
              Create Container
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Container</DialogTitle>
              <DialogDescription>
                Enter the details for the new container.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter container name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Enter container description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddItem}>
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {containers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Badge variant={"secondary"}>No container exists. Create one!</Badge>
        </div>
      ) : (
        <>
          {selectedItems.length > 0 && (
            <div className="mb-4 flex items-center justify-between rounded-2xl border bg-card p-2">
              <span className="text-sm font-medium">
                {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""}{" "}
                selected
              </span>
              <div className="flex gap-2">
                {/* <Button size="sm" variant={'outline'}>
                      <PencilLine className="h-4 w-4" />
                      Edit
                    </Button> */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-red-700 hover:bg-red-800 text-primary"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Selected
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Selected Items</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedItems.length}{" "}
                        selected item
                        {selectedItems.length > 1 ? "s" : ""}? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteSelected}
                        className="bg-red-700 hover:bg-red-800 text-primary"
                      >
                        {isLoading ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}

          <Table>
            <TableHeader className="bg-transparent">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    className="cursor-pointer"
                    ref={(el) => {
                      if (el && "indeterminate" in el) {
                        (el as HTMLInputElement).indeterminate =
                          isIndeterminate;
                      }
                    }}
                    aria-label="Select all items"
                  />
                </TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Resources</TableHead>
                <TableHead>Status</TableHead>
                {/* <TableHead className="text-right">Balance</TableHead> */}
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <tbody aria-hidden="true" className="table-row h-2"></tbody>
            <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
              {containers.map((item) => (
                <TableRow
                  key={item.id}
                  className={`odd:bg-muted/50 odd:hover:bg-muted/50 border-none hover:bg-transparent${
                    selectedItems.includes(item.id)
                      ? "bg-blue-50 dark:bg-muted/20"
                      : ""
                  }`}
                >
                  <TableCell className="py-2.5">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={(checked) =>
                        handleSelectItem(item.id, checked as boolean)
                      }
                      aria-label={`Select ${item.name}`}
                      className="cursor-pointer"
                    />
                  </TableCell>
                  <TableCell className="py-2.5 px-0 font-medium">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant={"secondary"}
                          className="cursor-pointer py-1"
                          onClick={() => handleCopyToClipboard(item.key)}
                        >
                          {item.key}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="py-2.5 font-medium">
                    <p
                      className="cursor-pointer hover:underline"
                      onClick={() => handleOnClick(item.key)}
                    >
                      {item.name}
                    </p>
                  </TableCell>
                  <TableCell className="py-2.5">{item.description}</TableCell>
                  <TableCell className="py-2.5">
                    <Badge
                      variant={"secondary"}
                      className="cursor-pointer py-1"
                    >
                      {item.resources}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <Badge
                      variant={"secondary"}
                      className="cursor-pointer py-1"
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  {/* <TableCell className="py-2.5 text-right">{item.balance}</TableCell> */}
                  <TableCell className="py-2.5">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete {item.name}</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Item</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <strong>{item.name}</strong>? This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteSingle(item.id)}
                            className="bg-red-700 hover:bg-red-800 text-primary"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {/* <tbody aria-hidden="true" className="table-row h-2"></tbody>
            <TableFooter className="bg-transparent">
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6}>Total</TableCell>
                <TableCell className="text-right">
                  ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            </TableFooter> */}
          </Table>
          <p className="text-muted-foreground mt-4 text-center text-sm">
            TIP: Click on a container name to view and manage its details.
          </p>
        </>
      )}
    </div>
  );
}
