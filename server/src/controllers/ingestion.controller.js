"use strict";

const IngestionService = require("../services/ingestion.service");
const {OK} = require("../core/success.response");
const {BadRequestError} = require("../core/error.response");

class IngestionController {

    /**
     * Ingest audio file
     * POST /api/v1/ingestion/audio
     * Body: form-data
     * - file: (binary)
     * - data: (stringified JSON) e.g. '{"carId": "...", "deviceId": "..."}'
     */
    async ingestAudio(req, res) {
        const file = req.file;
        let metadata = req.body.data;

        if (!file) {
            throw new BadRequestError("Audio file is missing");
        }

        if (typeof metadata === "string") {
            try {
                metadata = JSON.parse(metadata);
            } catch (e) {
                throw new BadRequestError("Invalid JSON format in 'data' field");
            }
        }

        metadata = metadata || {};

        const result = await IngestionService.processAudio(file, metadata);

        return new OK({
            message: "Audio ingested and processed successfully",
            data: result,
        }).send(res);
    }
}

module.exports = new IngestionController();