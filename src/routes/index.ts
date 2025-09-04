const { Router } = require( "express");
const solarRoute = require( './solar.routes');
const router = Router();

router.use("/solar", solarRoute);

module.exports = router;