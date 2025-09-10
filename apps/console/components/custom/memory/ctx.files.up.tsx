"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  AlertCircleIcon,
  DownloadIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  Trash2Icon,
  UploadCloudIcon,
  UploadIcon,
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
import { useReadLocalStorage } from "usehooks-ts";
import { useFilesStore } from "@prexo/store";

// API endpoint with environment detection
const FILE_API_ENDPOINT = process.env.NODE_ENV === "production" 
  ? "https://api.prexoai.xyz/v1/file" 
  : "http://localhost:3001/v1/file";

// Type for tracking upload progress
type UploadProgress = {
  fileId: string;
  progress: number;
  completed: boolean;
  error?: string;
};

// Type for pending files (files waiting to be uploaded)
type PendingFile = {
  id: string;
  file: File;
  preview: string | undefined;
};

const getFileIcon = (file: { file: File | { type: string; name: string } } | PendingFile) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type;
  const fileName = file.file instanceof File ? file.file.name : file.file.name;

  const iconMap = {
    pdf: {
      icon: FileTextIcon,
      conditions: (type: string, name: string) =>
        type.includes("pdf") || name.endsWith(".pdf"),
    },
    csv: {
      icon: FileSpreadsheetIcon,
      conditions: (type: string, name: string) =>
        type.includes("csv") || name.endsWith(".csv"),
    },
    mdx: {
      icon: FileTextIcon,
      conditions: (type: string, name: string) =>
        type.includes("markdown") || name.endsWith(".mdx"),
    },
    json: {
      icon: FileTextIcon,
      conditions: (type: string, name: string) =>
        type.includes("json") || name.endsWith(".json"),
    },
    txt: {
      icon: FileTextIcon,
      conditions: (type: string, name: string) =>
        type.includes("plain") || name.endsWith(".txt"),
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
  const consoleId = useReadLocalStorage("@prexo-#consoleId");
  const containerId = useReadLocalStorage("@prexo-#containerId");
  const { files: storeFiles, setFiles, removeFile: removeFileFromStore } = useFilesStore();
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const uploadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const maxSize = 10 * 1024 * 1024; // 10MB default
  const maxFiles = 2;

  const fetchFiles = useCallback(async () => {
    if (!containerId) return;
    
    try {
      const response = await fetch(`${FILE_API_ENDPOINT}/${containerId}/all`, {
        credentials: "include",
        headers: {
          "x-project-id": typeof consoleId === "string" ? consoleId : "",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files || []);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  }, [containerId, setFiles, consoleId]);

  const uploadPendingFiles = useCallback(async () => {
    if (pendingFiles.length === 0 || !containerId || isUploading) return;

    setIsUploading(true);
    const formData = new FormData();
    
    // Add all pending files to FormData
    pendingFiles.forEach((pendingFile) => {
      formData.append("files", pendingFile.file);
    });

    try {
      const response = await fetch(`${FILE_API_ENDPOINT}/${containerId}/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          "x-project-id": typeof consoleId === "string" ? consoleId : "",
        },
      });

      if (response.ok) {
        // Upload successful, fetch updated files
        await fetchFiles();
        setPendingFiles([]);
        setUploadProgress([]);
      } else {
        const errorData = await response.json();
        console.error("Upload failed:", errorData);
        // Mark all files as failed
        setUploadProgress(prev => 
          prev.map(item => ({ ...item, completed: true, error: errorData.message }))
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      // Mark all files as failed
      setUploadProgress(prev => 
        prev.map(item => ({ ...item, completed: true, error: "Upload failed" }))
      );
    } finally {
      setIsUploading(false);
    }
  }, [pendingFiles, containerId, isUploading, fetchFiles, consoleId]);

  // Fetch files from API on component mount
  useEffect(() => {
    if (containerId) {
      fetchFiles();
    }
  }, [containerId, fetchFiles]);

  // Auto-upload timer effect
  useEffect(() => {
    if (pendingFiles.length > 0) {
      // Clear existing timeout
      if (uploadTimeoutRef.current) {
        clearTimeout(uploadTimeoutRef.current);
      }

      // Set new timeout for 8 seconds
      uploadTimeoutRef.current = setTimeout(() => {
        uploadPendingFiles();
      }, 8000);

      return () => {
        if (uploadTimeoutRef.current) {
          clearTimeout(uploadTimeoutRef.current);
        }
      };
    }
  }, [pendingFiles, uploadPendingFiles]);

  // Function to handle newly added files
  const handleFilesAdded = (addedFiles: FileWithPreview[]) => {
    // Convert to pending files
    const newPendingFiles: PendingFile[] = addedFiles.map((file) => ({
      id: file.id,
      file: file.file as File,
      preview: file.preview,
    }));

    setPendingFiles(prev => [...prev, ...newPendingFiles]);

    // Initialize progress tracking for each new file
    const newProgressItems = addedFiles.map((file) => ({
      fileId: file.id,
      progress: 0,
      completed: false,
    }));

    setUploadProgress((prev) => [...prev, ...newProgressItems]);

    // Simulate progress for better UX (since we can't track real progress with FormData)
    addedFiles.forEach((file) => {
      const fileSize = file.file instanceof File ? file.file.size : file.file.size;
      simulateProgress(file.id, fileSize);
    });
  };

  // Simulate upload progress for better UX
  const simulateProgress = (fileId: string, totalBytes: number) => {
    let uploadedBytes = 0;
    const chunkSize = Math.floor(totalBytes / 20); // 20 steps
    let step = 0;

    const updateProgress = () => {
      step++;
      uploadedBytes = Math.min(totalBytes, step * chunkSize);
      const progress = Math.floor((uploadedBytes / totalBytes) * 100);

      setUploadProgress((prev) =>
        prev.map((item) =>
          item.fileId === fileId ? { ...item, progress } : item,
        ),
      );

      if (step < 20) {
        setTimeout(updateProgress, 200 + Math.random() * 300);
      } else {
        setUploadProgress((prev) =>
          prev.map((item) =>
            item.fileId === fileId ? { ...item, progress: 100, completed: true } : item,
          ),
        );
      }
    };

    setTimeout(updateProgress, 500);
  };

  // Remove the progress tracking for the file
  const handleFileRemoved = (fileId: string) => {
    setUploadProgress((prev) => prev.filter((item) => item.fileId !== fileId));
    setPendingFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  // Remove file from store and API
  const handleRemoveFile = async (fileId: string) => {
    try {
      const response = await fetch(`${FILE_API_ENDPOINT}/delete`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "x-project-id": typeof consoleId === "string" ? consoleId : "",
        },
        body: JSON.stringify({ ids: [fileId] }),
      });

      if (response.ok) {
        // Remove from store immediately for better UX
        removeFileFromStore(fileId);
        // Refresh the list to ensure consistency
        await fetchFiles();
      } else {
        console.error("Failed to delete file:", await response.text());
      }
    } catch (error) {
      console.error("Error removing file:", error);
    }
  };

  // Remove all files
  const handleRemoveAllFiles = async () => {
    if (storeFiles.length === 0) return;

    try {
      const fileIds = storeFiles.map(file => file.id);
      const response = await fetch(`${FILE_API_ENDPOINT}/delete`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "x-project-id": typeof consoleId === "string" ? consoleId : "",
        },
        body: JSON.stringify({ ids: fileIds }),
      });

      if (response.ok) {
        // Clear all files from store immediately
        setFiles([]);
        // Also clear pending files and progress
        setPendingFiles([]);
        setUploadProgress([]);
        clearFiles();
        // Refresh to ensure consistency
        await fetchFiles();
      } else {
        console.error("Failed to delete all files:", await response.text());
      }
    } catch (error) {
      console.error("Error removing all files:", error);
    }
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
    accept: ".pdf,.txt,.csv,.mdx,.json,.html",
    initialFiles: [], // No initial files, we'll use store files
    onFilesAdded: handleFilesAdded,
  });


  return (
    <div className="flex flex-col gap-2">
      {/* Hidden input for file dialog - always available */}
      <input
        {...getInputProps()}
        className="sr-only"
        aria-label="Upload files"
      />
      
      {/* Drop area - only show if no files exist */}
      {(storeFiles.length === 0 && pendingFiles.length === 0) && (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          data-files={files.length > 0 || undefined}
          className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-56 flex-col items-center rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px] data-[files]:hidden"
        >
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
            <p className="text-muted-foreground text-sm mt-1">
              Supported: pdf, txt, csv, mdx, json, html only
            </p>
            <p className="text-xs text-muted-foreground mt-2">
                <span className="font-medium">Tip:</span> You can also{" "}
                <span className="font-semibold">drag & drop</span> to add
                them automatically.
              </p>
            <Button variant="outline" className="mt-4" onClick={openFileDialog}>
              <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
              Select files
            </Button>
          </div>
        </div>
      )}
      {(storeFiles.length > 0 || pendingFiles.length > 0) && (
        <>
          {/* Table with files */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium">
              Files ({storeFiles.length})
              {pendingFiles.length > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Syncing...
              </span>
              )}
            </h3>
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
                onClick={handleRemoveAllFiles}
                disabled={storeFiles.length === 0}
              >
                <Trash2Icon
                  className="-ms-0.5 size-3.5 opacity-60"
                  aria-hidden="true"
                />
                Remove all
              </Button>
            </div>
          </div>
          <div className="bg-background overflow-hidden rounded-2xl border">
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
                {/* Render pending files first */}
                {pendingFiles.map((file) => {
                  const fileProgress = uploadProgress.find(
                    (p) => p.fileId === file.id,
                  );
                  const isUploadingFile = fileProgress && !fileProgress.completed;
                  return (
                    <TableRow
                      key={file.id}
                      data-uploading={isUploadingFile || undefined}
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
                            const error = fileProgress.error;

                            if (completed && !error) return null;

                            return (
                              <div className="mt-1 flex items-center gap-2">
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                                  <div
                                    className={`h-full transition-all duration-300 ease-out ${
                                      error ? "bg-red-500" : "bg-primary"
                                    }`}
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                                <span className="text-muted-foreground w-10 text-xs tabular-nums">
                                  {error ? "Error" : `${progress}%`}
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
                
                {/* Render uploaded files from store */}
                {storeFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="max-w-48 py-2 font-medium">
                      <span className="flex items-center gap-2">
                        <span className="shrink-0">{getFileIcon({ file })}</span>{" "}
                        <span className="truncate">{file.name}</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground py-2">
                      {file.type.split("/")[1]?.toUpperCase() || "UNKNOWN"}
                    </TableCell>
                    <TableCell className="text-muted-foreground py-2">
                      {formatBytes(file.size)}
                    </TableCell>
                    <TableCell className="py-2 text-right whitespace-nowrap">
                      {file.downloadUrl && (
                        <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground/80 hover:text-foreground size-8 hover:bg-transparent"
                        aria-label={`Download ${file.name}`}
                        onClick={() => window.open(file.downloadUrl!, "_blank")}
                      >
                        <DownloadIcon className="size-4" />
                      </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground/80 hover:text-foreground size-8 hover:bg-transparent"
                        aria-label={`Remove ${file.name}`}
                        onClick={() => handleRemoveFile(file.id)}
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
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
