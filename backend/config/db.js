const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
            });
        console.log(`Connected to Mongodb ✅: ${conn.connection.host}`);
    } catch (error) {
        console.log(`There is some error while connection ❌✋:${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDb;