"use strict";

const fs = require("fs");
const path = require("path");
const {AudioMetadata, AudioEvent} = require("../models/mongo");
const AlertService = require("./alert.service");
const MLService = require("./ml.service");
const {BadRequestError} = require("../core/error.response");
const logger = require("../utils/logger");

class IngestionService {
    constructor() {
        this.uploadDir = path.join(process.cwd(), "uploads");

        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, {recursive: true});
        }
    }

    async processAudio(file, metadata) {
        if (!file) throw new BadRequestError("Audio file is required");
        if (!metadata) {
            throw new BadRequestError("Metadata is required");
        }

        logger.info(`Received audio file: ${file.originalname} with metadata: ${JSON.stringify(metadata)}`);

        const fileInfo = await this.storeAudioFile(file);

        const audioMeta = await AudioMetadata.create({
            fileUrl: fileInfo.path,
            fileSize: file.size,
            format: file.mimetype,
        });

        const audioEvent = await AudioEvent.create({
            carId: metadata.carId,
            deviceId: metadata.deviceId,
            eventType: "AUDIO_INGESTED",
            location: metadata.location,
            audioMetadataId: audioMeta._id,
            timestamp: metadata.timestamp || new Date(),
            processed: false,
        });

        let classifiedResult;
        try {
            classifiedResult = await MLService.classifyWithSageMaker({
                buffer: file.buffer,
                contentType: file.mimetype || "audio/wav",
                filename: file.originalname,
            });
            logger.info(`ML Classification results for:`, classifiedResult);

            audioEvent.processed = true;
            await audioEvent.save();

        } catch (error) {
            logger.error("ML Classification failed, proceeding without results:", error.message);
            // We still proceed to alert service? Or stop?
            // Usually, if ML fails, we might create a system alert or just log it.
            // Here we assume we pass empty results or handle error.
        }

        if (classifiedResult) {
            const alert = await AlertService.createAlert({
                carId: metadata.carId,
                classifiedResult,
                metadata: {
                    ...metadata,
                    ingestionId: audioEvent.id
                },
                audioEventId: audioEvent._id,
            });

            if (alert) {
                audioEvent.alertGenerated = true;
                await audioEvent.save();
            }
        }

        return {
            eventId: audioEvent.id,
            storagePath: fileInfo.path,
            classification: classifiedResult,
            metadata: metadata,
        };
    }

    async storeAudioFile(file) {
        const env = (process.env.NODE_ENV || "dev").toLowerCase();

        if (env === "production" || env === "prod") {
            // PROD: Placeholder for S3
            // In a real app, use @aws-sdk/client-s3 here
            const s3Key = `audio/${new Date().toISOString()}_${file.originalname}`;
            logger.info(`[PROD] Uploading ${file.originalname} to S3 bucket at ${s3Key}`);

            // Simulating S3 upload delay
            await new Promise(resolve => setTimeout(resolve, 100));

            return {path: `s3://my-bucket/${s3Key}`, location: "s3"};
        } else {
            // DEV: Store Locally
            const targetPath = path.join(this.uploadDir, `${Date.now()}_${file.originalname}`);

            if (fs.existsSync(file.path)) {
                fs.copyFileSync(file.path, targetPath);
                // Optional: unlink old path if temp
                fs.unlinkSync(file.path);
            } else if (file.buffer) {
                fs.writeFileSync(targetPath, file.buffer);
            }

            return {path: targetPath, location: "local"};
        }
    }

}

module.exports = new IngestionService();