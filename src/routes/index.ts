const { Router } = require( "express");
const solarRoute = require( './solar.routes');
const testRouter = require('./test.routes');
const router = Router();

router.use("/solar", solarRoute);
router.use("/test", testRouter);

module.exports = router;