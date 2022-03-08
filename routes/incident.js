var express = require('express');
var router = express.Router();


let incidentController = require('../controllers/incident');

router.get('/',incidentController.getAllIncidents);

router.get('/:username',incidentController.getIncidentsByUser);

router.get('/record/:incidentRecordNumber', incidentController.getIncidentByRecordNumber);

/* POST Route for processing the incident request - CREATE Operation */
router.post('/add', incidentController.processAddIncident);

router.post('/close/:id', incidentController.processCloseIncident);

/* POST Route for processing the update incident request - UPDATE Operation */
router.post('/update/:id', incidentController.processUpdateIncident);

/* GET to perform  Deletion of incident - DELETE Operation */
router.get('/delete/:id', incidentController.processDeleteIncident);
router.get('/audits/get/:id',incidentController.getAuditLogs);
//router.get('/audits/add/:id',incidentController.addAuditLogs);
module.exports = router;
