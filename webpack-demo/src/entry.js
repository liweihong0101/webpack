/**
 * Created by liweihong on 2018/1/18.
 */
{
  let jspangString = 'jishupang!!!';
  document.getElementById('title').innerHTML = jspangString;
}
$('#title').html('jquery');

var json = require('../config.json');
document.getElementById('json').innerHTML = json.name;
