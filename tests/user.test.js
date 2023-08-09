const request = require("supertest");
const app = require("../src/app");
const User = require('../src/models/user')

const userOne = {
    username: "aqiman",
    email: "pak@gmail.com",
    password: "12345",
}

beforeEach(async () => {
    await User.deleteMany()
    const user = new User(userOne)
    await user.save()
})

test("Should signup a new user", async () => {
  await request(app).post("/users/signup").send({
    username: "aqiman",
    email: "fffssff@gmail.com",
    password: "12345",
  }).expect(201);
});

test("Should login existing user", async () => {
    await request(app).post("/users/login").send({
        email: userOne.email,
        password:userOne.password
    }).expect(200)
})

test("Should not login invalid credential user", async () => {
    await request(app).post("/users/login").send({
        email: userOne.email,
        password:"mypass"
    }).expect(400)
})