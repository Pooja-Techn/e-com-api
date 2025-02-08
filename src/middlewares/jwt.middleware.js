// import jwt from "jsonwebtoken";
// const jwtAuth = (req, res, next) =>
// {
//     //1. Read the token
//     console.log(req.headers);
//     const token = req.headers['authorization']
//     //const token = req.headers['authorization']?.split(' ')[1];

//     //2. if no token, return the error
//     if(!token)
//     {
//         return res.status(401).send(' Token Unauthorized.');
        
//         console.log(token);
//     }
//     const payload = jwt.verify(token, "ABC") //same key we passed in usercontroller
//     console.log("payload");
//    console.log(payload);

//     //3. check if token is valid
//     try{
//    // const payload = jwt.verify(token, "A68ECD6FBB86F6CA7D21A7B2AA58F") //same key we passed in usercontroller
//    //const payload = jwt.verify(token, "ABC") //same key we passed in usercontroller
 
//    console.log(payload);
//     req.userID = payload.userID;

// }
//     //4. return error
//     catch(err)
//     {
//         return res.status(401).send('Unauthorized');
//     }

//     //5. call next middleware
//     next();
// }
// export default jwtAuth;
import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
    // 1. Read the token from headers
    console.log(req.headers);
    const token = req.headers['authorization'];  // Read the token directly

    // 2. If no token, return an error
    if (!token) {
        console.log('No token found');
        return res.status(401).send('Token Unauthorized.');
    }

    // 3. Verify the token inside try-catch
    try {
        const payload = jwt.verify(token, "ABC");  // Verify using your secret key
        console.log('Payload:', payload);

        // Attach userID from the token payload to the request object
        req.userID = payload.userID;

        // 5. Call next middleware
        next();
    } catch (err) {
        // 4. Return error if token is invalid
        console.log('Token verification failed:', err);
        return res.status(401).send('Unauthorized');
    }
};

export default jwtAuth;