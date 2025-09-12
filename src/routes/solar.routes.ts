const { Router } = require( 'express');
// const { solarInsert, solarUpdate } = require( '../controllers/solar.controller');
const { solarUpsert } = require( '../controllers/solar.controller');

const solarRouter = Router();

solarRouter.post('/', solarUpsert);
// solarRouter.post('/', solarInsert);
// solarRouter.patch('/',solarUpdate);

module.exports = solarRouter;