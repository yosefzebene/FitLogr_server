import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Workout from '../models/Workout';
import User from '../models/User';

let mongo = null;

const connectDB = async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    await mongoose.connect(uri, {
        useNewUrlParser: true
    });
};

const dropDB = async () => {
    if (mongo) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongo.stop();
    }
};

const dropCollections = async () => {
    if (mongo) {
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.drop();
        }
    }
};

const setupTestData = async () => {
    const testWorkout = await Workout.create({
        name: "testWorkout",
        description: "test workout description."
    });

    const salt = await bcrypt.genSalt(15);
    const testUser = new User({
        first_name: "test",
        last_name: "person",
        email: "testperson@testemail.com",
        password: await bcrypt.hash("testpassword", salt),
        roles: [ "user", "admin" ],
        workouts: [
            {
                _id: testWorkout._id,
                day: 1
            }
        ]
    });

    await testUser.save();

    return testWorkout.id;
}

export { connectDB, dropDB, dropCollections, setupTestData };
