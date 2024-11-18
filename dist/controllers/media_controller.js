import { media } from "../models/media_schema";
import { ensureDirectoryLocated } from "../uitls/ensureDirectory";
import { join, basename } from "path";
import { randomUUID } from "node:crypto";
//* upload dir path
const uploadDir = join(process.cwd(), "static", "uploads");
console.log(process.env.HOST_URL);
//* if upload dir not created then create it
ensureDirectoryLocated(uploadDir);
const allMedia = async (c) => {
    try {
        const allMedias = await media.find();
        if (allMedias.length > 0) {
            return c.json({ success: true, data: allMedias }, 200);
        }
        else {
            return c.json({ success: false, message: "No media found" }, 400);
        }
    }
    catch (error) {
        return c.json({ error: error.message }, 500);
    }
};
const uploadMedia = async (c) => {
    try {
        // Parse multipart/form-data
        const forms = await c.req.parseBody({ all: true });
        console.log(forms);
        // Access the uploaded files
        let files = forms["files"];
        console.log('Files:', files);
        // Ensure files is an array of File objects
        if (!files) {
            return c.json({ message: "No files selected" }, 404);
        }
        if (!Array.isArray(files)) {
            files = [files];
        }
        const uploadedFiles = [];
        // Loop through each file and process it
        for (const file of files) {
            // Check if file is of type `File`
            if (file instanceof File) {
                // Sanitize file path to prevent collisions 
                const sanitizedFilename = basename(file.name);
                const randomChar = randomUUID();
                const secureFilename = `${randomChar}-${sanitizedFilename}`;
                console.log("filename get secured", secureFilename);
                // Define the path to save the uploaded file
                const fileTypePath = file.type ? `${file.type.split("/")[0]}` : "unknown";
                const filePath = join(uploadDir, fileTypePath, secureFilename);
                // Read the file data as an ArrayBuffer and convert it to Uint8Array
                const arrayBuffer = await file.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);
                // Write the file to the uploads directory using Bun's write method
                await Bun.write(filePath, uint8Array);
                console.log(`✅ File saved: ${filePath}`);
                // Store media info in the database
                await media.create({
                    name: secureFilename,
                    videoUrl: `http://${process.env.HOST_URL}/static/uploads/${fileTypePath}/${secureFilename}`,
                    fileType: file.type.split("/")[0]
                });
                // Collect uploaded file info
                uploadedFiles.push({
                    fileName: secureFilename,
                    filePath: `http://${process.env.HOST_URL}/static/uploads/${fileTypePath}/${secureFilename}`,
                    fileType: file.type.split("/")[0]
                });
            }
            else {
                console.log("Invalid file type, skipping...");
            }
        }
        // Send the JSON response with details of uploaded files
        return c.json({
            message: 'Files uploaded successfully!',
            uploadedFiles,
        });
    }
    catch (error) {
        console.error("Failed to upload files:", error);
        return c.json({ error: 'File upload failed' }, 500);
    }
};
//* exporting every controller functions here
export { allMedia, uploadMedia, };
