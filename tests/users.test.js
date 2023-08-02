import supertest from "supertest";
import app from '../server.js';
import { connectDB, dropDB, dropCollections } from '../db/test_db_conn.js';

const request = supertest(app);

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await dropDB();
});

afterEach(async () => {
    await dropCollections();
});

describe("POST /users/create", () => {
    describe("Given valid fields", () => {
        it("should respond with a 201 status code and document ID", async () => {
            // Test data
            const testEndpoint = '/users/create';
            const testUser = {
                first_name: "test",
                last_name: "person",
                email: "testperson@testemail.com",
                password: "testpassword",
            };
            // Expectation
            const expectedStatus = 201;

            const response = await request.post(testEndpoint).send(testUser);

            // Assertions
            expect(response.status).toBe(expectedStatus);
            expect(response.body.data._id).not.toBeNull();
        })
    })

    describe("Given invalid fields", () => {
        it("should respond with a 400 status code and error message", async () => {
            // Test data
            const testEndpoint = '/users/create';
            const testUser = {
                first_name: "",
                last_name: "person",
                email: "testperson@testemail.com",
                password: "testpassword",
            };
            // Expectation
            const expectedStatus = 400;
            const expectedErrorMessage = "User validation failed: first_name: Path `first_name` is required."

            const response = await request.post(testEndpoint).send(testUser);

            // Assertions
            expect(response.status).toBe(expectedStatus);
            expect(response.body.message).toBe(expectedErrorMessage);
        })
    })
})
