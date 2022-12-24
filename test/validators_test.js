const {
  validateName,
  validateEmail,
  validatePassword,
} = require("../utils/validators");

var expect = require("chai").expect;
describe("Testing Validators", function () {
  it("should return true for a valid name", function () {
    expect(validateName("Radhika")).to.equal(true);
  });

  it("should return false for an invalid name", function () {
    expect(validateName("Radhika10")).to.equal(false);
  });
  it("should return true for a valid email", function () {
    expect(validateEmail("radhika@gmail.com")).to.equal(true);
  });

  it("should return false for an invalid email", function () {
    expect(validateEmail("Radhika10.gmail.com")).to.equal(false);
  });
  it("should return false for an invalid email", function () {
    expect(validateEmail("Radhika10@gmail@com")).to.equal(false);
  });
  it("should return true for a valid password", function () {
    expect(validatePassword("radhika@F123")).to.equal(true);
  });

  it("should return false for an invalid password", function () {
    expect(validatePassword("Radh")).to.equal(false);
  });
  it("should return false for an invalid password", function () {
    expect(validatePassword("Radh@DFFFFF")).to.equal(false);
  });

  it("should return false for an invalid password", function () {
    expect(validatePassword("dwdqwdwdwdwdwdwdwd12")).to.equal(false);
  });
  it("should return false for an invalid password", function () {
    expect(validatePassword("dwdqwdwdwdwdwdwdwd@")).to.equal(false);
  });
});
