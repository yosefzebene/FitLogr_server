import supertest from 'supertest';
import app from '../../server.js';
import { connectDB, dropDB, dropCollections, setupTestData } from '../../db/test_db_conn.js';

const request = supertest(app);
const testEndpoint = '/workouts/';

// Values needed for tests
let token = null;
let testWorkoutId = null;
const nonExistentId = "64136649b2a56c9a4f9c4170";
const invalidId = "64136649";

const authenticateTestUser = async () => {
    const credentials = {
        email: "testperson@testemail.com",
        password: "testpassword"
    }
    const response = await request.post('/auth').send(credentials);
    token = "Bearer " + response.body.data.token;
}

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await dropDB();
});

beforeEach(async () => {
    testWorkoutId = await setupTestData();
    await authenticateTestUser();
})

afterEach(async () => {
    await dropCollections();
})

describe("POST /workouts", () => {
    describe("Given valid fields", () => {
        it("should respond with a 201 status code and document ID", async () => {
            const validWorkouts = [{
                name: "testWorkout",
                description: "test workout description."
            }];

            const expectedStatus = 201;

            const response = await request.post(testEndpoint).set('x-auth-token', token).send(validWorkouts);

            // Save a workout _id for later tests
            testWorkoutId = response.body.data[0]._id;

            expect(response.status).toBe(expectedStatus);
            expect(response.body.data[0]._id).not.toBeNull();
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
            description: "test workout description.",
            name: "testWorkout",
            __v: 0
        }];

        const response = await request.get(testEndpoint).set('x-auth-token', token);

        expect(response.status).toBe(expectedStatus);
        expect(response.body.data).toEqual(expectedData);
    })
});

describe("GET /workouts/:id", () => {
    describe("Given valid ID", () => {
        // TODO: make this test none dependant on the POST request test
        it("should respond with a 200 status code and a workout", async () => {
            const expectedStatus = 200;
            const expectedData = {
                _id: testWorkoutId,
                name: "testWorkout",
                description: "test workout description.",
                __v: 0
            };

            const response = await request.get(testEndpoint + testWorkoutId).set('x-auth-token', token);

            expect(response.status).toBe(expectedStatus);
            expect(response.body.data).toEqual(expectedData);
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
            const expectedErrorMessage = "Cast to ObjectId failed for value \"" + invalidId + "\" (type string) at path \"_id\" for model \"Workout\"";

            const response = await request.get(testEndpoint + invalidId).set('x-auth-token', token);

            expect(response.status).toBe(expectedStatus);
            expect(response.body.message).toBe(expectedErrorMessage);
        })
    })
});

describe("DELETE /workouts/:id", () => {
    describe("Given valid ID", () => {
        // TODO: make this test none dependant on the POST request test
        it("should respond with a 200 status code and delete confirmation", async () => {
            const expectedStatus = 200;
            const expectedData = {
                _id: testWorkoutId,
                name: "testWorkout",
                description: "test workout description.",
                __v: 0
            };

            const response = await request.delete(testEndpoint + testWorkoutId).set('x-auth-token', token);

            expect(response.status).toBe(expectedStatus);
            expect(response.body.data).toEqual(expectedData);
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
            const expectedErrorMessage = "Cast to ObjectId failed for value \"" + invalidId + "\" (type string) at path \"_id\" for model \"Workout\""

            const response = await request.delete(testEndpoint + invalidId).set('x-auth-token', token);

            expect(response.status).toBe(expectedStatus);
            expect(response.body.message).toBe(expectedErrorMessage);
        })
    })
});
