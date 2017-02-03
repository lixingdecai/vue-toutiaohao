import Tools from '../util/tools';

exports.getDateFromNow = date => Tools.dateFromNow(new Date() - new Date(date));

exports.formatDate = (time, format) => Tools.msToDate(new Date(time).getTime(), format || 'yyyy-MM-dd hh:mm');

exports.num2mode = num => Tools.num2mode(num);
