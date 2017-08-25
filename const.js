var reqHost = 'http://dev.im-cc.com:38880';

var APIS = {
  GET_NAV_TYPE: '/nav/type',
  GET_NAV_CAMPUS: '/nav/campus',
  GET_NAV_SPOT_LIST: '/nav/spot',
  GET_NAV_SPOT_DETAIL: '/nav/spot/${id}'
}

for (var i in APIS) {
  if (Object.prototype.hasOwnProperty.call(APIS, i)) { //过滤
    APIS[i] = reqHost + APIS[i];
  }
}

module.exports = {
  APIS: APIS
}