"use client";

import { useState } from "react";
import {
  AlertCircleIcon,
  DownloadIcon,
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  Trash2Icon,
  UploadCloudIcon,
  UploadIcon,
  VideoIcon,
  XIcon,
} from "lucide-react";

import {
  formatBytes,
  useFileUpload,
  type FileWithPreview,
} from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Create some dummy initial files
const initialFiles = [
  {
    name: "intro.zip",
    size: 252873,
    type: "application/zip",
    url: "https://example.com/intro.zip",
    id: "intro.zip-1744638436563-8u5xuls",
  },
  {
    name: "image-01.jpg",
    size: 1528737,
    type: "image/jpeg",
    url: "https://picsum.photos/1000/800?grayscale&random=1",
    id: "image-01-123456789",
  },
  {
    name: "audio.mp3",
    size: 1528737,
    type: "audio/mpeg",
    url: "https://example.com/audio.mp3",
    id: "audio-123456789",
  },
];

// Type for tracking upload progress
type UploadProgress = {
  fileId: string;
  progress: number;
  completed: boolean;
};

// Function to simulate file upload with more realistic timing and progress
const simulateUpload = (
  totalBytes: number,
  onProgress: (progress: number) => void,
  onComplete: () => void,
) => {
  let timeoutId: NodeJS.Timeout;
  let uploadedBytes = 0;
  let lastProgressReport = 0;

  const simulateChunk = () => {
    // Simulate variable network conditions with random chunk sizes
    const chunkSize = Math.floor(Math.random() * 300000) + 2000;
    uploadedBytes = Math.min(totalBytes, uploadedBytes + chunkSize);

    // Calculate progress percentage (0-100)
    const progressPercent = Math.floor((uploadedBytes / totalBytes) * 100);

    // Only report progress if it's changed by at least 1%
    if (progressPercent > lastProgressReport) {
      lastProgressReport = progressPercent;
      onProgress(progressPercent);
    }

    // Continue simulation if not complete
    if (uploadedBytes < totalBytes) {
      // Variable delay between 50ms and 500ms to simulate network fluctuations (reduced for faster uploads)
      const delay = Math.floor(Math.random() * 450) + 50;

      // Occasionally add a longer pause to simulate network congestion (5% chance, shorter duration)
      const extraDelay = Math.random() < 0.05 ? 500 : 0;

      timeoutId = setTimeout(simulateChunk, delay + extraDelay);
    } else {
      // Upload complete
      onComplete();
    }
  };

  // Start the simulation
  timeoutId = setTimeout(simulateChunk, 100);

  // Return a cleanup function to cancel the simulation
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
};

const getFileIcon = (file: { file: File | { type: string; name: string } }) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type;
  const fileName = file.file instanceof File ? file.file.name : file.file.name;

  const iconMap = {
    pdf: {
      icon: FileTextIcon,
      conditions: (type: string, name: string) =>
        type.includes("pdf") ||
        name.endsWith(".pdf") ||
        type.includes("word") ||
        name.endsWith(".doc") ||
        name.endsWith(".docx"),
    },
    archive: {
      icon: FileArchiveIcon,
      conditions: (type: string, name: string) =>
        type.includes("zip") ||
        type.includes("archive") ||
        name.endsWith(".zip") ||
        name.endsWith(".rar"),
    },
    excel: {
      icon: FileSpreadsheetIcon,
      conditions: (type: string, name: string) =>
        type.includes("excel") ||
        name.endsWith(".xls") ||
        name.endsWith(".xlsx"),
    },
    video: {
      icon: VideoIcon,
      conditions: (type: string) => type.includes("video/"),
    },
    audio: {
      icon: HeadphonesIcon,
      conditions: (type: string) => type.includes("audio/"),
    },
    image: {
      icon: ImageIcon,
      conditions: (type: string) => type.startsWith("image/"),
    },
  };

  for (const { icon: Icon, conditions } of Object.values(iconMap)) {
    if (conditions(fileType, fileName)) {
      return <Icon className="size-5 opacity-60" />;
    }
  }

  return <FileIcon className="size-5 opacity-60" />;
};

export default function CtxFileUploader() {
  // State to track upload progress for each file
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);

  const maxSize = 10 * 1024 * 1024; // 10MB default
  const maxFiles = 2;

  // Function to handle newly added files
  const handleFilesAdded = (addedFiles: FileWithPreview[]) => {
    // Initialize progress tracking for each new file
    const newProgressItems = addedFiles.map((file) => ({
      fileId: file.id,
      progress: 0,
      completed: false,
    }));

    // Add new progress items to state
    setUploadProgress((prev) => [...prev, ...newProgressItems]);

    // Store cleanup functions
    const cleanupFunctions: Array<() => void> = [];

    // Start simulated upload for each file
    addedFiles.forEach((file) => {
      const fileSize =
        file.file instanceof File ? file.file.size : file.file.size;

      // Start the upload simulation and store the cleanup function
      const cleanup = simulateUpload(
        fileSize,
        // Progress callback
        (progress) => {
          setUploadProgress((prev) =>
            prev.map((item) =>
              item.fileId === file.id ? { ...item, progress } : item,
            ),
          );
        },
        // Complete callback
        () => {
          setUploadProgress((prev) =>
            prev.map((item) =>
              item.fileId === file.id ? { ...item, completed: true } : item,
            ),
          );
        },
      );

      cleanupFunctions.push(cleanup);
    });

    // Return a cleanup function that cancels all animations
    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  };

  // Remove the progress tracking for the file
  const handleFileRemoved = (fileId: string) => {
    setUploadProgress((prev) => prev.filter((item) => item.fileId !== fileId));
  };

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize,
    initialFiles,
    onFilesAdded: handleFilesAdded,
  });

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-56 flex-col items-center rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px] data-[files]:hidden"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload files"
        />
        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <FileIcon className="size-4 opacity-60" />
          </div>
          <p className="mb-1.5 text-sm font-medium">Upload files</p>
          <p className="text-muted-foreground text-xs">
            Max {maxFiles} files ∙ Up to {formatBytes(maxSize)}
          </p>
          <Button variant="outline" className="mt-4" onClick={openFileDialog}>
            <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
            Select files
          </Button>
        </div>
      </div>
      {files.length > 0 && (
        <>
          {/* Table with files */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium">Files ({files.length})</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={openFileDialog}>
                <UploadCloudIcon
                  className="-ms-0.5 size-3.5 opacity-60"
                  aria-hidden="true"
                />
                Add files
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUploadProgress([]);
                  clearFiles();
                }}
              >
                <Trash2Icon
                  className="-ms-0.5 size-3.5 opacity-60"
                  aria-hidden="true"
                />
                Remove all
              </Button>
            </div>
          </div>
          <div className="bg-background overflow-hidden rounded-md border">
            <Table>
              <TableHeader className="text-xs">
                <TableRow className="bg-muted/50">
                  <TableHead className="h-9 py-2">Name</TableHead>
                  <TableHead className="h-9 py-2">Type</TableHead>
                  <TableHead className="h-9 py-2">Size</TableHead>
                  <TableHead className="h-9 w-0 py-2 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-[13px]">
                {files.map((file) => {
                  const fileProgress = uploadProgress.find(
                    (p) => p.fileId === file.id,
                  );
                  const isUploading = fileProgress && !fileProgress.completed;
                  return (
                    <TableRow
                      key={file.id}
                      data-uploading={isUploading || undefined}
                    >
                      <TableCell className="max-w-48 py-2 font-medium">
                        <span className="flex items-center gap-2">
                          <span className="shrink-0">{getFileIcon(file)}</span>{" "}
                          <span className="truncate">{file.file.name}</span>
                        </span>
                        {/* Upload progress bar */}
                        {fileProgress &&
                          (() => {
                            const progress = fileProgress.progress || 0;
                            const completed = fileProgress.completed || false;

                            if (completed) return null;

                            return (
                              <div className="mt-1 flex items-center gap-2">
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                                  <div
                                    className="bg-primary h-full transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                                <span className="text-muted-foreground w-10 text-xs tabular-nums">
                                  {progress}%
                                </span>
                              </div>
                            );
                          })()}
                      </TableCell>
                      <TableCell className="text-muted-foreground py-2">
                        {file.file.type.split("/")[1]?.toUpperCase() ||
                          "UNKNOWN"}
                      </TableCell>
                      <TableCell className="text-muted-foreground py-2">
                        {formatBytes(file.file.size)}
                      </TableCell>
                      <TableCell className="py-2 text-right whitespace-nowrap">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-muted-foreground/80 hover:text-foreground size-8 hover:bg-transparent"
                          aria-label={`Download ${file.file.name}`}
                          onClick={() => window.open(file.preview, "_blank")}
                          disabled={isUploading}
                        >
                          <DownloadIcon className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-muted-foreground/80 hover:text-foreground size-8 hover:bg-transparent"
                          aria-label={`Remove ${file.file.name}`}
                          onClick={() => {
                            handleFileRemoved(file.id);
                            removeFile(file.id);
                          }}
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}
