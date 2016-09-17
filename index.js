var $ = require('highland');
var R = require('ramda');
var harmony = R.compose($, require('harmonyhubjs-client'));


var invoke0 = method => R.compose($, R.invoker(0, method));
/**
 * client -> boolean
 */
var getActivities = R.compose($, invoke0('getActivities'));

console.log('starting');

var harmony = $(['192.168.0.199'])
.flatMap(harmony)
// .flatMap(invoke0('isOff'))
.doto($.log)
.resume();
return;

harmony('192.168.0.199')
  .then(function(harmonyClient) {
    harmonyClient.isOff()
      .then(function(off) {
        if(off) {
          console.log('Currently off. Turning TV on.');

          harmonyClient.getActivities()
            .then(function(activities) {
              activities.some(function(activity) {
                if(activity.label === 'Watch TV') {
                  var id = activity.id
                  harmonyClient.startActivity(id)
                  harmonyClient.end()
                  return true
                }
                return false
              })
            })
        } else {
          console.log('Currently on. Turning TV off')
          harmonyClient.turnOff();
          harmonyClient.end();
        }
      })
  });

