import _ from '../util/tools';

exports.getDateFromNow = date => {
  if (!date) {
    return '';
  }
  return _.dateFromNow(new Date() - new Date(date * 1000));
};

exports.formatDate = (time, format) => {
  if (!time) {
    return '';
  }
  return _.msToDate(new Date(time).getTime(), format || 'yyyy-MM-dd hh:mm');
};

exports.num2mode = num => _.num2mode(num);

exports.status2str = num => _.status2str(num);

exports.https = value => _.https(value);

exports.rssNum2Status = num => _.rssNum2Status(num);

exports.noEnterReturn = val => _.noEnterReturn(val);

exports.text2html = val => _.text2html(val);
