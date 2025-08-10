import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { KeyType } from "@prexo/types";

const renderSkeletonRows = () => (
  <>
    {Array.from({ length: 7 }).map((_, index) => (
      <TableRow
        key={index}
        className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r"
      >
        <TableCell className="bg-muted/50 py-2 font-medium">
          <Skeleton className="h-4 w-20" />
        </TableCell>
        <TableCell className="py-2">
          <Skeleton className="h-4 w-32" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

export default function ApiKeyTable({ keyData }: { keyData: KeyType }) {
  const key = keyData;
  if (!key) {
    return;
  }

  return (
    <div className="flex h-full w-full min-w-0">
      <div className="overflow-hidden rounded-md border w-full">
        <Table className="w-full">
          <TableBody>
            {!key.id ? (
              renderSkeletonRows()
            ) : (
              <>
                <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                  <TableCell className="bg-muted/50 py-2 font-medium">
                    Name
                  </TableCell>
                  <TableCell className="py-2">{key.name}</TableCell>
                </TableRow>
                <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                  <TableCell className="bg-muted/50 py-2 font-medium">
                    Key
                  </TableCell>
                  <TableCell className="py-2">
                    {key.start + "********"}
                  </TableCell>
                </TableRow>
                <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                  <TableCell className="bg-muted/50 py-2 font-medium">
                    Created At
                  </TableCell>
                  <TableCell className="py-2">
                    {new Date(key.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>

                <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                  <TableCell className="bg-muted/50 py-2 font-medium">
                    Status
                  </TableCell>
                  <TableCell className="py-2">
                    {key.enabled ? "Active" : "InActive"}
                  </TableCell>
                </TableRow>
                <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                  <TableCell className="bg-muted/50 py-2 font-medium">
                    Credits
                  </TableCell>
                  <TableCell className="py-2">{key.remaining}</TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
