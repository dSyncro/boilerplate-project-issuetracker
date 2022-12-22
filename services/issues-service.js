"use strict";

const crypto = require("crypto");

class IssuesService {
  issuesMap = {};

  add(project, issue) {
    if (!this.issuesMap[project]) this.issuesMap[project] = {};

    const now = new Date();

    const id = crypto.randomUUID();
    const newIssue = {
      _id: id,
      open: true,
      created_on: now,
      updated_on: now,
      ...issue,
    };

    this.issuesMap[project][id] = newIssue;
    return newIssue;
  }

  get(project, id) {
    return this.issuesMap[project][id];
  }

  getAll(project, filters) {
    if (!this.issuesMap[project]) this.issuesMap[project] = {};

    const issues = Object.values(this.issuesMap[project]);
    if (!filters || Object.keys(filters).length <= 0) return issues;

    const filtered = issues.filter((issue) =>
      Object.entries(filters).some(([key, value]) => issue[key] === value)
    );

    return filtered;
  }

  update(project, id, issue) {
    const existingIssue = this.get(project, id);
    if (!existingIssue) return undefined;

    const updatedIssue = {
      ...existingIssue,
      ...issue,
      updated_on: new Date(),
    };

    this.issuesMap[project][id] = updatedIssue;
    return updatedIssue;
  }

  delete(project, id) {
    const toDelete = this.issuesMap[project][id];
    this.issuesMap[project][id] = undefined;
    return toDelete;
  }
}

module.exports = IssuesService;
