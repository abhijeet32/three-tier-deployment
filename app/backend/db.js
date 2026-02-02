const mongoose = require("mongoose");

// module.exports = async () => {
//     try {
//         const uri = process.env.MONGO_CONN_STR;
//         if (!uri) {
//             throw new Error("MONGO_CONN_STR is not defined.");
//         }

//         const connectionParams = {};

//         // Optional DB auth if you’re not putting user/pass in the URI
//         const useDBAuth = process.env.USE_DB_AUTH === "true";
//         if (useDBAuth) {
//             connectionParams.user = process.env.MONGO_USERNAME;
//             connectionParams.pass = process.env.MONGO_PASSWORD;
//         }

//         await mongoose.connect(uri, connectionParams);
//         console.log("Connected to database.");
//     } catch (error) {
//         console.log("Could not connect to database.", error);
//     }
// };


module.exports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CONN_STR);
        console.log("Connected to database.");
    } 
    catch (error) {
        console.log("Could not connect to database.", error);
    }
};
