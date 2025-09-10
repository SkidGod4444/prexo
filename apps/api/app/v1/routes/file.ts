import { Hono } from "hono";
import { UTApi } from "uploadthing/server";
import { checkUser } from "@/middleware/check.user";
import { prisma } from "@prexo/db";
import { auditLogs } from "@/middleware/audit.logs";

const file = new Hono();

file.use(checkUser);
file.use(auditLogs);

export const utapi = new UTApi();

file.post("/:containerId/upload", async (c) => {
  const containerId = c.req.param("containerId");
  if (!containerId) {
    return c.json({ message: "Container ID is required" }, 400);
  }
  const formData = await c.req.formData();
  const filesData = formData.getAll("files");

  if (!filesData || filesData.length === 0) {
    return c.json({ message: "No file uploaded", status: 400 }, 400);
  }

  const files = Array.isArray(filesData) ? filesData : [filesData];

  try {
    const fileEsques = files.filter((f: any) => f instanceof File);

    const responses = await utapi.uploadFiles(fileEsques, {
      acl: "public-read",
      concurrency: 5,
    });

    const success = responses.filter((r) => r.data);
    const errors = responses.filter((r) => r.error);

    console.log("==>>", success);

    if (errors.length > 0) {
      console.error("Some files failed to upload:", errors);
      return c.json({ message: "Some files failed", errors }, 500);
    }

    if (success.length > 0) {
      const uploadedFiles = success.map((s) => s.data);
      if (uploadedFiles.length > 0) {
        await prisma.$transaction(
          uploadedFiles.map((fileData: any) =>
            prisma.files.create({
              data: {
                key: fileData.key,
                containerId,
                name: fileData.name,
                url: fileData.url,
                downloadUrl: fileData.ufsUrl,
                type: fileData.type,
                size: fileData.size,
              },
            }),
          ),
        );
        console.log("Files stored in DB!");
      }
    }

    return c.json(
      {
        message: "File(s) uploaded successfully",
      },
      200,
    );
  } catch (err: any) {
    console.error("Error uploading file:", err);
    return c.json({ message: "Error uploading file", error: err.message }, 500);
  }
});

file.delete("/delete", async (c) => {
  const { ids } = await c.req.json();
  if (Array.isArray(ids) && ids.length == 0) {
    return c.json({ message: "File Id is required" }, 400);
  }
  try {
    // Delete from UploadThing
    const res = await utapi.deleteFiles(ids);
    console.log("UploadThing deletion result:", res);

    // Delete from database
    await prisma.files.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    console.log("Files deleted from database");

    return c.json(
      {
        message: "File(s) deleted successfully",
      },
      200,
    );
  } catch (error: any) {
    console.error("Error deleting file:", error);
    return c.json(
      { message: "Error deleting file", error: error.message },
      500,
    );
  }
});

file.get("/:containerId/all", async (c) => {
  const containerId = c.req.param("containerId");
  if (!containerId) {
    return c.json({ message: "Container ID is required" }, 400);
  }
  try {
    const files = await prisma.files.findMany({
      where: { containerId },
      orderBy: { createdAt: "desc" },
      cacheStrategy: {
        ttl: 30,
        swr: 30,
        tags: ["findMany_files"],
      },
    });
    console.log(files);
    return c.json(
      {
        files: files,
      },
      200,
    );
  } catch (error: any) {
    console.error("Error fetching file:", error);
    return c.json(
      { message: "Error fetching file", error: error.message },
      500,
    );
  }
});

file.get("/all", async (c) => {
  try {
    const files = await utapi.listFiles();
    console.log(files);
    return c.json(
      {
        files: files,
      },
      200,
    );
  } catch (error: any) {
    console.error("Error fetching file:", error);
    return c.json(
      { message: "Error fetching file", error: error.message },
      500,
    );
  }
});

export default file;
