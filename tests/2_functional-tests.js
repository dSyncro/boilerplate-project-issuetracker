const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const projName = "test-project";

const issueKeys = [
  "_id",
  "issue_title",
  "issue_text",
  "created_by",
  "assigned_to",
  "open",
  "status_text",
  "created_on",
  "updated_on",
];

suite("Functional Tests", function () {
  let issueId = "";

  test("Create an issue with every field: POST request to /api/issues/{project}", (done) => {
    chai
      .request(server)
      .post(`/api/issues/${projName}`)
      .send({
        issue_title: "test-title",
        issue_text: "test-text",
        created_by: "test",
        assigned_to: "text",
        status_text: "test-status-text",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.hasAllKeys(res.body, issueKeys);
        issueId = res.body["_id"];
        done();
      });
  });

  test("Create an issue with only required fields: POST request to /api/issues/{project}", (done) => {
    chai
      .request(server)
      .post(`/api/issues/${projName}`)
      .send({
        issue_title: "test-title",
        issue_text: "test-text",
        created_by: "test",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.hasAllKeys(res.body, issueKeys);
        done();
      });
  });

  test("Create an issue with missing required fields: POST request to /api/issues/{project}", (done) => {
    chai
      .request(server)
      .post(`/api/issues/${projName}`)
      .send({
        issue_title: "test-title",
      })
      .end((err, res) => {
        assert.hasAnyKeys(res.body, ["error"]);
        done();
      });
  });

  test("View issues on a project: GET request to /api/issues/{project}", (done) => {
    chai
      .request(server)
      .get(`/api/issues/${projName}`)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  test("View issues on a project with one filter: GET request to /api/issues/{project}", (done) => {
    chai
      .request(server)
      .get(`/api/issues/${projName}`)
      .query({
        open: true,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  test("View issues on a project with multiple filters: GET request to /api/issues/{project}", (done) => {
    chai
      .request(server)
      .get(`/api/issues/${projName}`)
      .query({
        open: true,
        issue_text: "test-text2",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  test("Update one field on an issue: PUT request to /api/issues/{project}", (done) => {
    chai
      .request(server)
      .put(`/api/issues/${projName}`)
      .send({
        _id: issueId,
        open: false,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body["_id"], issueId);
        done();
      });
  });

  test("Update multiple fields on an issue: PUT request to /api/issues/{project}", (done) => {
    chai
      .request(server)
      .put(`/api/issues/${projName}`)
      .send({
        _id: issueId,
        open: false,
        issue_text: "New issue text",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body["_id"], issueId);
        done();
      });
  });

  test("Update an issue with missing _id: PUT request to /api/issues/{project}", (done) => {
    chai
      .request(server)
      .put(`/api/issues/${projName}`)
      .send({
        open: false,
        issue_text: "New issue text",
      })
      .end((err, res) => {
        assert.hasAnyKeys(res.body, ["error"]);
        done();
      });
  });

  test("Update an issue with no fields to update: PUT request to /api/issues/{project}", (done) => {
    chai
      .request(server)
      .put(`/api/issues/${projName}`)
      .send({
        _id: issueId,
      })
      .end((err, res) => {
        assert.hasAnyKeys(res.body, ["error"]);
        done();
      });
  });

  test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", (done) => {
    chai
      .request(server)
      .put(`/api/issues/${projName}`)
      .send({
        _id: "Invalid ID",
        open: false,
        issue_text: "New issue text",
      })
      .end((err, res) => {
        assert.hasAnyKeys(res.body, ["error"]);
        done();
      });
  });

  test("Delete an issue: DELETE request to /api/issues/{project}", (done) => {
    chai
      .request(server)
      .delete(`/api/issues/${projName}`)
      .send({
        _id: issueId,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body["_id"], issueId);
        done();
      });
  });

  test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", (done) => {
    chai
      .request(server)
      .delete(`/api/issues/${projName}`)
      .send({
        _id: "Invalid ID",
      })
      .end((err, res) => {
        assert.hasAnyKeys(res.body, ["error"]);
        done();
      });
  });

  test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", (done) => {
    chai
      .request(server)
      .delete(`/api/issues/${projName}`)
      .end((err, res) => {
        assert.hasAnyKeys(res.body, ["error"]);
        done();
      });
  });
});
