import { useState, type ChangeEvent } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, Upload } from "lucide-react";
import { Progress } from "../ui/progress";

interface FileUploadProps {
  title?: string;
  description?: string;
  onUpload?: (files: File[]) => Promise<void> | void;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface UploadItem {
  id: string;
  file: File;
  progress: number; // 0-100
  status: UploadStatus;
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(1)} ${sizes[i]}`;
};

export function FileUpload({
  title = "Upload file",
  description = "Choose a file from your computer and upload it",
  onUpload,
}: FileUploadProps) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files ?? []);
    setItems(
      selectedFiles.map((file, idx) => ({
        id: `${file.name}-${file.lastModified}-${idx}`,
        file,
        progress: 0,
        status: "idle",
      }))
    );
    setError(null);
  }

  async function handleUploadClick() {
    if (items.length === 0) {
      setError("Please select at least a file");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      setItems((prev) =>
        prev.map((item) => ({
          ...item,
          progress: 0,
          status: "uploading",
        }))
      );

      await Promise.all(
        items.map((item) => simulateFileUpload(item.id, item.file))
      );

      await onUpload?.(items.map((item) => item.file));
    } catch {
      setError("Failed to upload files.");
      setItems((prev) =>
        prev.map((item) =>
          item.status === "uploading" ? { ...item, status: "error" } : item
        )
      );
    } finally {
      setIsUploading(false);
    }
  }

  function simulateFileUpload(itemId: string, file: File) {
    return new Promise<void>((resolve) => {
      let progress = 0;

      const interval = setInterval(() => {
        progress += 10 + Math.random() * 15;

        if (progress >= 100) {
          progress = 100;
        }

        setItems((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  progress,
                  status: progress === 100 ? "success" : "uploading",
                }
              : item
          )
        );

        if (progress === 100) {
          clearInterval(interval);
          resolve();
        }
      }, 200);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Input type="file" multiple onChange={handleFileChange} />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {items.length === 0
                ? "No files selected"
                : `${items.length} files selected`}
            </span>
          </div>
          {error && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          disabled={items.length === 0 || isUploading}
          onClick={handleUploadClick}
        >
          <Upload />
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </CardFooter>

      <div className="px-6">
        {/* File list */}
        {items.length > 0 && (
          <ul className="space-y-2 rounded-md border p-2 text-sm">
            {items.map((item) => (
              <li key={item.id} className="grid grid-cols-2">
                <div className="grid grid-cols-4 gap-2">
                  <span className="truncate col-span-3">{item.file.name}</span>
                  <span className="text-xs text-muted-foreground self-center">
                    {formatFileSize(item.file.size)}
                  </span>
                </div>

                <div className="grid grid-cols-5 items-center gap-2 w-full">
                  <Progress value={item.progress} className="h-1 col-span-4" />
                  <span className="text-right text-xs text-muted-foreground">
                    {item.status === "success"
                      ? "Done"
                      : item.status === "error"
                      ? "Error"
                      : `${Math.round(item.progress)}%`}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}

// For backend code
// onUpload={async (file) => {
//   const formData = new FormData();
//   formData.append("file", file);

//   const res = await fetch("/api/upload", {
//     method: "POST",
//     body: formData,
//   });

//   if (!res.ok) {
//     throw new Error("Upload failed");
//   }
// }}
