import supertest from "supertest";
import app from '../../server.js';
import { connectDB, dropDB, dropCollections, setupTestData } from '../../db/test_db_conn.js';

const request = supertest(app);
const testEndpoint = '/users/create';

let token = null;
let testWorkout = null;
let testUser = null;
let testUserWorkout = null;

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
    ({ testWorkout, testUser, testUserWorkout } = await setupTestData());
    await authenticateTestUser();
})

afterEach(async () => {
    await dropCollections();
})

describe("POST /users/create", () => {
    describe("Given valid fields", () => {
        it("should respond with a 201 status code and document ID", async () => {
            // Test data
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

describe("GET /users/me/workouts", () => {
    it("should respond with 200 status code and an array of workouts", async () => {
        const expectedStatus = 200;
        const expectedData = [
            {
                workout_id: {
                    _id: testWorkout.id,
                    name: testWorkout.name,
                    description: testWorkout.description
                },
                day: 1
            }
        ];

        const response = await request.get('/users/me/workouts').set('x-auth-token', token);

        expect(response.status).toBe(expectedStatus);
        expect(response.body.data).toMatchObject(expectedData);
    })
})

describe("POST /users/me/workouts", () => {
    it("Given valid fields - should respond with a 201 status code and the created array of the workouts", async () => {
        const validWorkouts = [{
            workout_id: testWorkout.id,
            day: 2
        }];

        const expectedStatus = 201;
        const expectedData = [
            {
                user_id: testUser.id,
                workout_id: {
                    _id: testWorkout.id,
                    name: testWorkout.name,
                    description: testWorkout.description,
                },
                day: 2,
            }
        ];

        const response = await request.post('/users/me/workouts').set('x-auth-token', token).send(validWorkouts);

        expect(response.status).toBe(expectedStatus);
        expect(response.body.data).toMatchObject(expectedData);
    })

    it("Given invalid \"workout_id\" field - should respond with a 400 status code and error message", async () => {
        const invalidWorkouts = [{
            workout_id: "",
            day: 0
        }];

        const expectedStatus = 400;
        const expectedErrorMessage = "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer";

        const response = await request.post('/users/me/workouts').set('x-auth-token', token).send(invalidWorkouts);

        expect(response.status).toBe(expectedStatus);
        expect(response.body.message).toBe(expectedErrorMessage);
    })

    it("Given invalid \"day\" field - should respond with a 400 status code and error message", async () => {
        const invalidWorkouts = [{
            workout_id: testWorkout.id,
            day: ""
        }];

        const expectedStatus = 400;
        const expectedErrorMessage = "UserWorkout validation failed: day: Path `day` is required.";
        
        const response = await request.post('/users/me/workouts').set('x-auth-token', token).send(invalidWorkouts);

        expect(response.status).toBe(expectedStatus);
        expect(response.body.message).toBe(expectedErrorMessage);
    })
})

describe("PATCH /users/me/workouts", () => {
    it("Given valid fields - should respond with a 200 status code and the updated workout", async () => {
        const validUpdate  = {
            workout_id: testUserWorkout.workout_id.toString(),
            old_day: testUserWorkout.day,
            new_day: 5
        }

        const expectedStatus = 200;
        const expectedData = {
            workout_id: testUserWorkout.workout_id.toString(),
            user_id: testUser.id,
            day: 5
        }

        const response = await request.patch('/users/me/workouts').set('x-auth-token', token).send(validUpdate);

        expect(response.status).toBe(expectedStatus);
        expect(response.body.data).toMatchObject(expectedData);
    })

    it("Given a non existing user workout - should respond with a 404 status code and error message", async () => {
        const invalidUpdate = {
            workout_id: testUserWorkout.workout_id.toString(),
            old_day: testUserWorkout.day + 3,
            new_day: 5
        }

        const expectedStatus = 404;
        const expectedErrorMessage = "Specified workout is not part of the users list - no updates were made";

        const response = await request.patch('/users/me/workouts').set('x-auth-token', token).send(invalidUpdate);

        expect(response.status).toBe(expectedStatus);
        expect(response.body.message).toBe(expectedErrorMessage);
    })

    it("Given invalid \"workout_id\" - should respond with a 400 status code and error message", async () => {
        const invalidUpdate = {
            workout_id: "",
            old_day: testUserWorkout.day,
            new_day: 5
        }

        const expectedStatus = 400;
        const expectedErrorMessage = "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer";

        const response = await request.patch('/users/me/workouts').set('x-auth-token', token).send(invalidUpdate);

        expect(response.status).toBe(expectedStatus);
        expect(response.body.message).toBe(expectedErrorMessage);
    })

    it("Given invalid \"new_day\" - should respond with a 400 status code and error message", async () => {
        const invalidUpdate  = {
            workout_id: testUserWorkout.workout_id.toString(),
            old_day: testUserWorkout.day,
            new_day: ""
        }

        const expectedStatus = 400;
        const expectedErrorMessage = "UserWorkout validation failed: day: Path `day` is required.";

        const response = await request.patch('/users/me/workouts').set('x-auth-token', token).send(invalidUpdate);

        expect(response.status).toBe(expectedStatus);
        expect(response.body.message).toBe(expectedErrorMessage);
    })
})

// describe("DELETE /users/me/workouts", () => {

// })
