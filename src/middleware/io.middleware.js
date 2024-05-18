import { Request, Response, NextFunction } from "express";

const ioMiddleware = (io) => (req, res, next) => {
  req.io = io;
  next();
};

module.exports = ioMiddleware;
