"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");
const { Forum } = require("../forums");
const { User } = require("../users");
const { TEST_DATABASE_URL } = require("../config");

const faker = require("faker");
const mongoose = require("mongoose");

const expect = chai.expect;
chai.use(chaiHttp);

describe("Forum endpoints", function() {
  /**
   * Seeding users data
   */
  function seedUsersData() {
    const seedData = [];
    for (let i = 0; i <= 1; i++) {
      seedData.push({
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: faker.internet.password(),
        _id: mongoose.Types.ObjectId()
      });
    }
    // this will return a promise
    User.insertMany(seedData);
    return seedData;
  }

  /**
   * Seeding forums data
   */
  function seedForumsData() {
    // first create fake users data
    const userSeedData = seedUsersData();
    const seedData = [];
    for (let i = 0; i <= 1; i++) {
      seedData.push({
        _id: mongoose.Types.ObjectId(),
        title: faker.lorem.sentence(),
        content: faker.lorem.text(),
        // using the user seed data's _id value
        user: userSeedData[i]._id
      });
    }
    return Forum.insertMany(seedData);
  }

  function tearDownDb() {
    console.warn("Deleting database");
    return mongoose.connection.dropDatabase();
  }

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedForumsData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe("GET endpoint", function() {
    it("should return all existing forums", function() {
      let post;
      return chai
        .request(app)
        .get("/api/forums")
        .then(function(_post) {
          // so subsequent .then blocks can access response object
          post = _post;
          expect(post).to.have.status(200);
          // otherwise our db seeding didn't work
          expect(post.body.forums).to.have.lengthOf.at.least(1);
          return Forum.count();
        })
        .then(function(count) {
          expect(post.body.forums).to.have.lengthOf(count);
        });
    });

    it("should return only one forum", function() {
      let oneForumId;
      return chai
        .request(app)
        .get("/api/forums")
        .then(function(_post) {
          // so subsequent .then blocks can access response object
          const post = _post;
          expect(post).to.have.status(200);
          expect(post).to.be.json;
          expect(post.body.forums).to.be.a("array");
          // otherwise our db seeding didn't work
          expect(post.body.forums).to.have.lengthOf.at.least(1);
          oneForumId = post.body.forums[0].id;
          return chai.request(app).get(`/api/forums/${oneForumId}`);
        })
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.id).equal(oneForumId);
        });
    });

    it("should return forums with right fields", function() {
      // Strategy: Get back all forums, and ensure they have expected keys

      let forumPost;
      return chai
        .request(app)
        .get("/api/forums")
        .then(function(post) {
          expect(post).to.have.status(200);
          expect(post).to.be.json;
          expect(post.body.forums).to.be.a("array");
          expect(post.body.forums).to.have.lengthOf.at.least(1);

          post.body.forums.forEach(function(forum) {
            expect(forum).to.be.a("object");
            expect(forum).to.include.keys("id", "title", "user", "content");
          });
          forumPost = post.body.forums[0];
          return Forum.findById(forumPost.id);
        })
        .then(function(forum) {
          expect(forumPost.id).to.equal(forum.id);
          expect(forumPost.title).to.equal(forum.title);
          expect(forumPost.user).to.equal(
            forum.user.firstName + " " + forum.user.lastName
          );
          expect(forumPost.content).to.equal(forum.content);
        });
    });
  });

  describe("POST endpoint", function() {
    it("should add a new post in forum", function() {
      const newUser = {
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: faker.internet.password()
      };

      User.insertMany(newUser);

      const newForum = {
        title: faker.lorem.sentence(),
        content: faker.lorem.text(),
        // using the user seed data's _id value
        user: newUser.email
      };

      return chai
        .request(app)
        .post("/api/forums")
        .send(newForum)
        .then(function(post) {
          expect(post).to.have.status(201);
          expect(post).to.be.json;
          expect(post.body).to.be.a("object");
          expect(post.body).to.include.keys("id", "title", "user", "content");
          // cause Mongo should have created id on insertion
          expect(post.body.id).to.not.be.null;
          expect(post.body.title).to.equal(newForum.title);
          expect(post.body.user).to.equal(
            `${newUser.firstName} ${newUser.lastName}`
          );
          expect(post.body.content).to.equal(newForum.content);
          return Forum.findById(post.body.id);
        })
        .then(function(forum) {
          expect(newForum.title).to.equal(forum.title);
          expect(newForum.content).to.equal(forum.content);
          expect(newForum.user).to.equal(forum.user.email);
        });
    });
  });

  describe("PUT endpoint", function() {
    it("should update fields in forum", function() {
      const updateData = {
        title: "ExampleTitle",
        content: "Example of a bunch of awords"
      };

      return Forum.findOne()
        .then(function(forum) {
          updateData.id = forum.id;

          // make request then inspect it to make sure it reflects
          // data we sent
          return chai
            .request(app)
            .put(`/api/forums/${forum.id}`)
            .send(updateData);
        })
        .then(function(post) {
          expect(post).to.have.status(200);

          return Forum.findById(updateData.id);
        })
        .then(function(forum) {
          expect(forum.title).to.equal(updateData.title);
          expect(forum.content).to.equal(updateData.content);
        });
    });
  });

  describe("DELETE endpoint", function() {
    it("delete a forum post by id", function() {
      let forum;

      return Forum.findOne()
        .then(function(_forum) {
          forum = _forum;
          return chai.request(app).delete(`/api/forums/${forum.id}`);
        })
        .then(function(post) {
          expect(post).to.have.status(204);
          return Forum.findById(post.id);
        })
        .then(function(_post) {
          expect(_post).to.be.null;
        });
    });
  });
});
