import supertest from "supertest";
import app from '../server.js';
import { connectDB, dropDB } from '../db/test_db_conn.js';

const request = supertest(app);
const testEndpoint = '/auth';

const addTestUser = async () => {
    await request.post('/users/create').send({
        first_name: "test",
        last_name: "person",
        email: "testperson@testemail.com",
        password: "testpassword",
    });
}

beforeAll(async () => {
    await connectDB();
    await addTestUser();
});

afterAll(async () => {
    await dropDB();
});

describe("POST /auth", () => {
    describe("Given valid credentials", () => {
        it("Should respond with 200 status code and a token", async () => {
            // Test Data
            const validCreds = {
                email: "testperson@testemail.com",
                password: "testpassword",
            };
            // Expectation
            const expectedStatus = 200;

            const response = await request.post(testEndpoint).send(validCreds);

            // Assertions
            expect(response.status).toBe(expectedStatus);
            expect(response.body.data.token).not.toBeNull();
        })
    })

    describe("Given invalid email", () => {
        it("Should respond with 401 status code and error message", async () => {
            const invalidCreds = {
                email: "doesnotexist@testemail.com",
                password: "testpassword",
            }
            const expectedStatus = 401;
            const expectedErrorMessage = "Invalid email or password"

            const response = await request.post(testEndpoint).send(invalidCreds);

            expect(response.status).toBe(expectedStatus);
            expect(response.body.message).toBe(expectedErrorMessage);
        })
    })

    describe("Given invalid password", () => {
        it("Should respond with 401 status code and error message", async () => {
            const invalidCreds = {
                email: "testperson@testemail.com",
                password: "badtestpassword",
            }
            const expectedStatus = 401;
            const expectedErrorMessage = "Invalid email or password"

            const response = await request.post(testEndpoint).send(invalidCreds);

            expect(response.status).toBe(expectedStatus);
            expect(response.body.message).toBe(expectedErrorMessage);
        })
    })
})