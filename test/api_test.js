const chai = require("chai");
const chaiHttp = require("chai-http");

const server = require("../index");
const should = chai.should();
require("dotenv").config();
const API = process.env.BASE_URL;

chai.use(chaiHttp);

// describe("/POST testing user signup", function () {
//   it("creates a new user", (done) => {
//     chai
//       .request(API)
//       .post("/api/v1/user/signup")
//       .set("content-type", "application/json")
//       .send({
//         name: "Jamesd",
//         email: "jamesd@gmail.com",
//         password: "Jamesd@123",
//       })
//       .end((err, res) => {
//         console.log("ada", err);
//         res.should.have.status(200);
//         res.body.should.be.a("object");
//         res.body.should.have.property("message");
//         res.body.message.should.contain("User successfully signed up!");
//         done();
//       });
//   });
// });

describe("/GET testing user signout", function () {
  it("signs out a user", (done) => {
    chai
      .request(API)
      .get("/api/v1/user/signout")
      .end((err, res) => {
        // console.log("ada", err);
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.message.should.contain("cookie deleted");
        done();
      });
  });
});
