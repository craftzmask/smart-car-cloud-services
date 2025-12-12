"use strict";

const AlertTypeService = require("../services/alertType.service");
const { OK, CREATED } = require("../core/success.response");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { parseIntParam } = require("../helpers/queryParser");

class AlertTypeController {
  async list(request, response) {
    const limitRaw = parseIntParam(request.query.limit, undefined);
    const offsetRaw = parseIntParam(request.query.offset, undefined);
    const limit = limitRaw >= 0 ? limitRaw : undefined;
    const offset = offsetRaw >= 0 ? offsetRaw : undefined;

    const data = await AlertTypeService.list({ limit, offset });
    return new OK({ message: "Alert types retrieved successfully", data }).send(response);
  }

  async getByType(request, response) {
    const { type } = request.params;
    const data = await AlertTypeService.getByType(type);
    if (!data) throw new NotFoundError("AlertType not found");
    return new OK({ message: "Alert type retrieved successfully", data }).send(response);
  }

  async create(request, response) {
    const { type, name, description, defaultSeverity, category, enabled } =
      request.body || {};
    if (!type) throw new BadRequestError("type is required");

    const data = await AlertTypeService.create({
      type,
      name,
      description,
      defaultSeverity,
      category,
      enabled,
    });

    return new CREATED({ message: "Alert type created successfully", data }).send(response);
  }

  async rename(request, response) {
    const { type } = request.params;
    const {
      newType,
      name,
      description,
      defaultSeverity,
      category,
      enabled,
    } = request.body || {};

    const data = await AlertTypeService.renameType(type, {
      newType,
      name,
      description,
      defaultSeverity,
      category,
      enabled,
    });

    return new OK({ message: "Alert type updated successfully", data }).send(response);
  }

  async delete(request, response) {
    const { type } = request.params;

    const result = await AlertTypeService.delete(type);
    if (!result.deleted) throw new NotFoundError("AlertType not found");

    return new OK({ message: "Alert type deleted successfully", data: result }).send(response);
  }
}

module.exports = new AlertTypeController();
