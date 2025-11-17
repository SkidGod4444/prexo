"use client";

import { useModelsStore } from "@prexo/store";
import type { ModelsType } from "@prexo/types";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Copy } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Frame, FramePanel } from "@/components/ui/frame";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { modelProviderSVG } from "@/lib/models.svg";

export const columns: ColumnDef<ModelsType>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-left">Model</div>,
    cell: ({ row }) => {
      const model = row.original;

      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-xs font-semibold">
              {modelProviderSVG(model.provider, {
                className: "h-5 w-5",
              }) ?? (
                <span className="uppercase">
                  {(model.name as string)?.charAt(0) ?? "A"}
                </span>
              )}
            </div>
            <div className="flex flex-row gap-0.9">
              <span className="text-sm font-medium">{model.name}</span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: () => <div className="text-left">Id</div>,
    cell: ({ row }) => {
      const model = row.original;

      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="flex flex-row gap-0.9">
              <span className="text-sm font-medium">
                {model.provider}/{model.model}
              </span>

              <Button
                variant="outline"
                size="icon"
                className="ml-5 h-7 w-7"
                onClick={() => navigator.clipboard.writeText(model.id)}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy model ID</span>
              </Button>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "context",
    header: () => <div className="text-left">Context</div>,
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.getValue("context")}K
      </div>
    ),
  },
  {
    accessorKey: "inputTokens",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="justify-start px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Input Tokens
        <ArrowUpDown className="ml-1 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        ${row.getValue("inputTokens")}/M
      </div>
    ),
  },
  {
    accessorKey: "outputTokens",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="justify-start px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Output Tokens
        <ArrowUpDown className="ml-1 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        ${row.getValue("outputTokens")}/M
      </div>
    ),
  },
  {
    accessorKey: "marketplaces",
    header: () => <div className="text-left">Marketplaces</div>,
    cell: ({ row }) => {
      const marketplaces = row.getValue("marketplaces");
      return (
        <div className="flex gap-1 flex-wrap">
          {Array.isArray(marketplaces)
            ? marketplaces.map((mp: string) => (
                <Badge key={mp} variant={"secondary"}>
                  {mp.toUpperCase()}
                </Badge>
              ))
            : ""}
        </div>
      );
    },
  },
];

export function ModelsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { models } = useModelsStore();
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  //   const [typeFilter, setTypeFilter] = React.useState<"all" | ModelsType["type"]>("all");
  const [providerFilter, setProviderFilter] = React.useState<string>("all");

  const providerOptions = React.useMemo(() => {
    const options = new Set<string>();
    models.forEach((model) => {
      options.add(model.provider);
    });
    return Array.from(options);
  }, [models]);

  const filteredData = React.useMemo(() => {
    let result = models;

    // if (typeFilter !== "all") {
    //   result = result.filter((model) => model.type === typeFilter);
    // }

    if (providerFilter !== "all") {
      result = result.filter((model) =>
        model.provider.includes(providerFilter),
      );
    }

    return result;
  }, [models, providerFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <Frame className="h-full w-full rounded-xl bg-secondary p-2">
      <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search model..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-md"
        />
        <div className="flex flex-1 items-center justify-end gap-2">
          {/* <div className="inline-flex items-center gap-1 rounded-full bg-muted p-1 text-xs">
            {[
              { label: "All", value: "all" as const },
              { label: "Chat", value: "chat" as const },
              { label: "Image", value: "image" as const },
              { label: "Embedding", value: "embedding" as const },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setTypeFilter(option.value as "all" | ModelType)
                }
                className={`rounded-full px-3 py-1 ${
                  typeFilter === option.value
                    ? "bg-background text-sm font-medium shadow-sm"
                    : "text-xs text-muted-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                {providerFilter === "all" ? "All Providers" : providerFilter}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={providerFilter}
                onValueChange={(value) => setProviderFilter(value)}
              >
                <DropdownMenuRadioItem value="all">
                  All Providers
                </DropdownMenuRadioItem>
                {providerOptions.map((provider) => (
                  <DropdownMenuRadioItem key={provider} value={provider}>
                    {provider}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                Columns
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <FramePanel className="overflow-hidden rounded-xl bg-card">
        <div className="max-h-[calc(100vh-16rem)] overflow-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No models found!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </FramePanel>
    </Frame>
  );
}
