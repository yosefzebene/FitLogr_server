import supertest from 'supertest';
import app from '../server.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { connectDB, dropDB } from '../db/test_db_conn.js';

const request = supertest(app);
const testEndpoint = '/workouts/';

// Values needed for tests
let token = "Bearer ";
let testWorkoutId = null;
const nonExistentId = "64136649b2a56c9a4f9c4170";
const invalidId = "64136649";

const addTestUser = async () => {
    const salt = await bcrypt.genSalt(15);
    const testUser = new User({
        first_name: "test",
        last_name: "person",
        email: "testperson@testemail.com",
        password: await bcrypt.hash("testpassword", salt),
        roles: [ "user", "admin" ]
    });

    await testUser.save();
}

const authenticateTestUser = async () => {
    const credentials = {
        email: "testperson@testemail.com",
        password: "testpassword"
    }
    const response = await request.post('/auth').send(credentials);
    token += response.body.data.token;
}

beforeAll(async () => {
    await connectDB();
    await addTestUser();
    await authenticateTestUser();
});

afterAll(async () => {
    await dropDB();
});

describe("POST /workouts", () => {
    describe("Given valid fields", () => {
        it("should respond with a 201 status code and document ID", async () => {
            const validWorkout = {
                name: "testWorkout",
                description: "test workout description."
            }

            const expectedStatus = 201;

            const response = await request.post(testEndpoint).set('x-auth-token', token).send(validWorkout);

            // Save workout _id for later tests
            testWorkoutId = response.body.data._id;

            expect(response.status).toBe(expectedStatus);
            expect(response.body.data._id).not.toBeNull();
        })
    })

    describe("Given invalid fields", () => {
        it("should respond with a 400 status code and error message", async () => {
            const invalidWorkout = {
                name: "",
                description: ""
            }

            const expectedStatus = 400;
            const expectedErrorMessage = "Workout validation failed: name: Path `name` is required., description: Path `description` is required.";

            const response = await request.post(testEndpoint).set('x-auth-token', token).send(invalidWorkout);

            expect(response.status).toBe(expectedStatus);
            expect(response.body.message).toBe(expectedErrorMessage);
        })
    })
});

describe("GET /workouts", () => {
    it("should respond with 200 status code and an array of workouts", async () => {
        const expectedStatus = 200;
        const expectedData = [{
            _id: testWorkoutId,
            name: "testWorkout",
            description: "test workout description."
        }];

        const response = await request.get(testEndpoint).set('x-auth-token', token);

        expect(response.status).toBe(expectedStatus);
        expect(response.body.data).toBe(expectedData);
    })
});

describe("GET /workouts/:id", () => {
    describe("Given valid ID", () => {
        it("should respond with a 200 status code and a workout", async () => {
            const expectedStatus = 200;
            const expectedData = {
                _id: testWorkoutId,
                name: "testWorkout",
                description: "test workout description."
            };

            const response = await request.get(testEndpoint + testWorkoutId).set('x-auth-token', token);

            expect(response.status).toBe(expectedStatus);
            expect(response.body.data).toBe(expectedData);
        })
    })

    describe("Given an ID that doesn't exist", () => {
        it("should respond with a 404 status code and an error message", async () => {
            const expectedStatus = 404;
            const expectedErrorMessage = "Resource does not exist.";

            const response = await request.get(testEndpoint + nonExistentId).set('x-auth-token', token);

            expect(response.status).toBe(expectedStatus);
            expect(response.body.message).toBe(expectedErrorMessage);
        })
    })

    describe("Given an invalid ID", () => {
        it("should respond with a 400 status code and an error message", async () => {
            const expectedStatus = 400;
            const expectedErrorMessage = "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer";

            const response = await request.get(testEndpoint + invalidId).set('x-auth-token', token);

            expect(response.status).toBe(expectedStatus);
            expect(response.body.message).toBe(expectedErrorMessage);
        })
    })
});

describe("DELETE /workouts/:id", () => {
    describe("Given valid ID", () => {
        it("should respond with a 200 status code and delete confirmation", async () => {
            const expectedStatus = 200;

            const response = await request.delete(testEndpoint + testWorkoutId).set('x-auth-token', token);

            expect(response.status).toBe(expectedStatus);
            expect(response.body.data.n).toBe(1);
            expect(response.body.data.ok).toBe(1);
            expect(response.body.data.deletedCount).toBe(1);
        })
    })

    describe("Given an ID that doesn't exist", () => {
        it("should respond with a 404 status code and an error message", async () => {
            const expectedStatus = 404;
            const expectedErrorMessage = "Resource does not exist."

            const response = await request.delete(testEndpoint + nonExistentId).set('x-auth-token', token);

            expect(response.status).toBe(expectedStatus);
            expect(response.body.message).toBe(expectedErrorMessage);
        })
    })

    describe("Given an invalid ID", () => {
        it("should respond with a 400 status code and an error message", async () => {
            const expectedStatus = 400;
            const expectedErrorMessage = "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer"

            const response = await request.delete(testEndpoint + invalidId).set('x-auth-token', token);

            expect(response.status).toBe(expectedStatus);
            expect(response.body.message).toBe(expectedErrorMessage);
        })
    })
});
