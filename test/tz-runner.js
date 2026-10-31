// Sets the process timezone before any Date is created, then loads the suites.
process.env.TZ = process.argv[2];
require('./calendar.test.js');
require('./plugin.test.js');
