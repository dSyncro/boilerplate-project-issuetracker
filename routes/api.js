'use strict';

const IssuesService = require("../services/issues-service");

const issuesService = new IssuesService();

module.exports = function (app) {
  app
    .route("/api/issues/:project")
    .get(function (req, res) {
      const { project } = req.params;
      const { query } = req;

      const issues = issuesService.getAll(project, query);
      return res.json(issues);
    })
    .post(function (req, res) {
      const { project } = req.params;
      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;

      if (!issue_title || !issue_text || !created_by)
        return res.json({
          error: "required field(s) missing",
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
      const { _id, ...rest } = req.body;

      if (!_id)
        return res.json({
          error: "missing _id",
        });

      if (Object.keys(rest).length <= 0)
        return res.json({
          error: "no update field(s) sent",
          _id,
        });

      const updatedIssue = issuesService.update(project, _id, rest);
      if (!updatedIssue)
        return res.json({
          error: "could not update",
          _id,
        });

      return res.json({
        result: "successfully updated",
        _id,
      });
    })
    .delete(function (req, res) {
      const { project } = req.params;
      const { _id } = req.body;

      if (!_id) return res.json({ error: "missing _id" });

      const deletedIssue = issuesService.delete(project, _id);
      if (!deletedIssue) return res.json({ error: "could not delete", _id });

      return res.json({
        result: "successfully deleted",
        _id,
      });
    });
};
