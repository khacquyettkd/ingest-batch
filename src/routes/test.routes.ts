const { Router } = require( 'express');
import type { Request, Response } from "express";

const testRouter = Router();

testRouter.get('/', (req: Request, res:Response) => {
    return res.status(200).json({ 
      success: true,
      message: "Service is alive"
    });
});

module.exports = testRouter;