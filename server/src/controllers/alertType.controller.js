"use strict";

const AlertTypeService = require("../services/alertType.service");
const {OK, CREATED} = require("../core/success.response");
const {BadRequestError} = require("../core/error.response");

class AlertTypeController {

    async list(request, response) {
        const limit = request.query.limit ? parseInt(request.query.limit, 10) : undefined;
        const offset = request.query.offset ? parseInt(request.query.offset, 10) : undefined;

        const data = await AlertTypeService.list({limit, offset});
        return new OK({message: "Alert types retrieved successfully", data}).send(response);
    }


    async getByType(request, response) {
        const {type} = request.params;
        const data = await AlertTypeService.getByType(type);
        if (!data) {
            throw new BadRequestError("AlertType not found");
        }
        return new OK({message: "Alert type retrieved successfully", data}).send(response);
    }


    async create(request, response) {
        const {type} = request.body || {};
        if (!type) throw new BadRequestError("type is required");

        const data = await AlertTypeService.create({type});

        return new CREATED({
            message: "Alert type created successfully",
            data,
        }).send(response);
    }


    async rename(request, response) {
        const {type} = request.params;
        const {newType} = request.body || {};
        if (!newType) throw new BadRequestError("newType is required");

        const data = await AlertTypeService.renameType(type, newType);

        return new OK({
            message: "Alert type updated successfully",
            data,
        }).send(response);
    }


    async delete(request, response) {
        const {type} = request.params;

        const result = await AlertTypeService.delete(type);
        if (!result.deleted) {
            throw new BadRequestError("AlertType not found");
        }

        return new OK({
            message: "Alert type deleted successfully",
            data: result,
        }).send(response);
    }

}

module.exports = new AlertTypeController();
