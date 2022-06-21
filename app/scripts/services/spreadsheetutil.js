/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS201: Simplify complex destructure assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
'use strict';

/**
 * @ngdoc service
 * @name swarmApp.spreadsheetutil
 * @description
 * # spreadsheetutil
 * Factory in the swarmApp.
*/
angular.module('swarmApp').factory('spreadsheetUtil', function(util) { let SpreadsheetUtil;
return new (SpreadsheetUtil = class SpreadsheetUtil {
  defaultFilter(val) {
    // zero, or any truthy value
    return !!val || _.isNumber(val);
  }

  setNested(object, props, val) {
    let adjustedLength, lastprop;
    adjustedLength = Math.max(props.length, 1),
      props = props.slice(0, adjustedLength - 1),
      lastprop = props[adjustedLength - 1];
    let cur = object;
    for (let prop of Array.from(props)) {
      if (cur[prop] == null) { cur[prop] = {}; }
      cur = cur[prop];
    }
    cur[lastprop] = val;
    return object;
  }

  getNested(object, props) {
    let cur = object;
    for (let prop of Array.from(props)) {
      cur = cur[prop];
    }
    return cur;
  }
  
  normalizeRow(row, filterFn) {
    if (filterFn == null) { filterFn = this.defaultFilter; }
    const ret = {};
    for (let col in row) {
      const val = row[col];
      if (filterFn(val)) {
        const props = col.split('.');
        this.setNested(ret, props, val);
      }
    }
    return ret;
  }

  normalizeRows(rows, filterFn) {
    if (filterFn == null) { filterFn = this.defaultFilter; }
    return (Array.from(rows).map((row) => this.normalizeRow(row, filterFn)));
  }

  // Group row properties as lists, given a spec saying how to group them.
  // {a:['list']}, [{a:'bob',list:1},{a:'bob',list:2}] -> [{a:'bob',list:[1,2]}]
  // In the example above, 'a' is the primary key. Different primary keys aren't
  // grouped. See the unittest for more examples.
  // Empty values filtered by default.
  groupRows(groupSpec, rows, filterFn) {
    if (filterFn == null) { filterFn = this.defaultFilter; }
    const ret = [];
    for (let key in groupSpec) {
      let listProps = groupSpec[key];
      const groups = _.groupBy(rows, key);
      const orderedKeyvals = _.uniq(_.map(rows, key));
      if (_.isString(listProps)) {
        listProps = [listProps];
      }
      if (!_.isArray(listProps)) {
        // TODO nested groupings
        throw new Error("groupRows: nested groupings not supported yet");
      }
      for (let keyval of Array.from(orderedKeyvals)) {
        var mainrow;
        const group = groups[keyval];
        ret.push(mainrow = _.clone(group[0]));
        for (let listProp of Array.from(listProps)) {
          const listvals = _.map(group, listProp);
          mainrow[listProp] = _.filter(listvals, filterFn);
        }
      }
    }
    return ret;
  }

  parseRows(groupSpec, rows, filterFn) {
    if (filterFn == null) { filterFn = this.defaultFilter; }
    const normalized = this.normalizeRows(rows, filterFn);
    return this.groupRows(groupSpec, normalized, filterFn);
  }

  resolveList(objects, field, targets, opts) {
    if (opts == null) { opts = {}; }
    if (opts.required == null) { opts.required = true; }
    return (() => {
      const result = [];
      for (let obj of Array.from(objects)) {
        const name = obj[field];
        obj[field] = targets[name];
        result.push(util.assert((obj[field] || !opts.required), `couldn't resolve ref: ${obj}.${field}=${name}`, obj, field, name, targets[name], objects));
      }
      return result;
    })();
  }
});
 });
