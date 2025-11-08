"use strict"

const AlertService = require("../services/alert.service");
const {OK, CREATED} = require("../core/success.response");
const {BadRequestError} = require("../core/error.response");

class AlertController {
    async create(request, response) {
        const {carId, classifiedResults, metadata, audioEventId} = request.body;
        if (!carId) {
            throw new BadRequestError("Missing carId");
        }

        const data = await AlertService.createAlert({carId, classifiedResults, metadata, audioEventId});
        return new CREATED({
            message: "Alert created successfully",
            data,
        }).send(response);
    }

    // async list(request, response) {
    //
    // }
}

module.exports = new AlertController();