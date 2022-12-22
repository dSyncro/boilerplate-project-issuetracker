'use strict';

const IssuesService = require("../services/issues-service");

const issuesService = new IssuesService();

module.exports = function (app) {
  app
    .route("/api/issues/:project")
    .get(function (req, res) {
      const { project } = req.params;
      const { query } = req.query;

      const issues = issuesService.getAll(project, query);
      return res.json(issues);
    })
    .post(function (req, res) {
      const { project } = req.params;
      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;

      if (!issue_title || !issue_text || !created_by)
        return res.status(400).json({
          error: "Missing required field",
        });

      const issue = issuesService.add(project, {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      });

      return res.json(issue);
    })
    .put(function (req, res) {
      const { project } = req.params;
      const { id, ...rest } = req.body;

      if (!id)
        return res.status(400).json({
          error: "Missing id",
        });

      if (Object.keys(rest).length <= 0)
        return res.status(422).json({
          error: "Nothing to update",
        });

      const updatedIssue = issuesService.update(project, id, rest);
      if (!updatedIssue)
        return res.status(500).json({
          error: "Invalid id",
        });

      return res.json(updatedIssue);
    })
    .delete(function (req, res) {
      const { project } = req.params;
      const { id } = req.body;

      if (!id)
        return res.status(400).json({
          error: "Missing id",
        });

      const deletedIssue = issuesService.delete(project, id);

      if (!deletedIssue)
        return res.status(500).json({
          error: "Invalid id",
        });

      return res.json(deletedIssue);
    });
};
