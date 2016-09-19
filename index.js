const IP = process.env.IP; // IP of harmony device

const R = require('ramda');
const Future = require('ramda-fantasy').Future;
const harmony = require('harmonyhubjs-client');

/**
 * Promise -> Future
 */
const futurify = promise => Future((reject, resolve) => promise.then(resolve, reject));

/**
 * method -> obj -> args -> *
 */
const invoke = R.curry((method, obj, args) => obj[method].apply(obj, args));

const log = invoke('log', console);

/**
 * IP -> Future client
 */
const getClient = R.memoize(R.compose(futurify, harmony));

/**
 * client -> Future activities
 */
const getActivities = R.compose(futurify, x => x.getActivities());

/**
 * name -> client -> Future activity
 */
const findActivityByName = name => R.compose(Future.of, R.find(R.propEq('label', name)));

/**
 * Future client -> id -> Future
 */
const startActivity = R.curry((client, id) => client.map(client => futurify(client.startActivity(id))));

/**
 * method -> obj -> args -> Future
 */
const invokeF = R.compose(futurify, invoke);

/**
 * ======================================================================================================
 */


/**
 * The program
 * Turn on an activity by the name 'Bedroom Lights'
 */
var client = getClient(IP);

client
.chain(getActivities)
.chain(findActivityByName('Bedroom Lights'))
.map(R.prop('id'))
.chain(startActivity(client))
.fork(log, log)
;