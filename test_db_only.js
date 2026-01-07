const { MongoMemoryServer } = require('mongodb-memory-server');

(async () => {
    try {
        console.log("Starting Memory Server Test...");
        const mongod = await MongoMemoryServer.create({
            binary: {
                debug: true
            }
        });
        console.log("URI:", mongod.getUri());
        await mongod.stop();
        console.log("Stopped.");
    } catch (e) {
        console.error("ERROR:", e);
    }
})();
