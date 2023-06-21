import UserModel from '../model/User.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../config.js';

/** middleware for verify user */
export async function verifyUser(req, res, next) {
    try {
        const { username } = req.method == 'GET' ? req.query : req.body;

        // Check the user existance
        let exist = await UserModel.findOne({ username });
        if (!exist) return res.status(404).send({ error: "Can't find user" });
        next();
    } catch (error) {
        return res.status(404).send({ error: 'Authentication error' });
    }
}

/** POST: http://localhost:8080/api/register
 *@param: {
    "username":"shibu",
    "password":"Shibu@123",
    "email":"shibuhandsomm@gmail.com",
    "firstname":"Shibu",
    "lastname":"Behera",
    "mobile":8917571207,
    "address":"Bagdia",
    "profile":""
 } 
*/
// export async function register(req, res) {
//     try {
//         const { username, password, profile, email } = req.body;

//         // Check existing user
//         const existUsername = new Promise((resolve, reject) => {
//             UserModel.findOne({ username }, function (err, user) {
//                 if (err) reject(new Error(err));
//                 if (user) reject({ error: 'Please use unique username' });

//                 resolve();
//             });
//         });
//         // Check existing email
//         const existEmail = new Promise((resolve, reject) => {
//             UserModel.findOne({ email }, function (err, email) {
//                 if (err) reject(new Error(err));
//                 if (email) reject({ error: 'Please use unique Email' });

//                 resolve();
//             });
//         });

//         Promise.all([existUsername, existEmail])
//             .then(() => {
//                 if (password) {
//                     bcrypt
//                         .hash(password, 10)
//                         .then((hashPassword) => {
//                             const user = new UserModel({
//                                 username,
//                                 password: hashPassword,
//                                 profile: profile || '',
//                                 email,
//                             });

//                             // Return save result as a resolve
//                             user.save()
//                                 .then((result) =>
//                                     res.status(201).send({
//                                         msg: 'User register successfully',
//                                     })
//                                 )
//                                 .catch((error) =>
//                                     res.status(500).send({ error })
//                                 );
//                         })
//                         .catch((error) => {
//                             return res
//                                 .status(500)
//                                 .send({ error: 'Enable to hash password' });
//                         });
//                 }
//             })
//             .catch((error) => {
//                 return res.status(500).send({ error });
//             });
//     } catch (error) {
//         return res.status(500).send(error);
//     }
// }
export async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body;

        // check the existing user
        const existUsername = await UserModel.findOne({ username });
        if (existUsername) {
            res.status(400).send({ error: 'Username already exists' });
        } else {
            const existEmail = await UserModel.findOne({ email });
            if (existEmail) {
                res.status(400).send({ error: 'Email already exists' });
            } else {
                if (password) {
                    bcrypt
                        .hash(password, 10)
                        .then((hashedPassword) => {
                            const user = new UserModel({
                                username,
                                password: hashedPassword,
                                profile: profile || '',
                                email,
                            });

                            // return save result as a response
                            user.save()
                                .then((result) =>
                                    res.status(201).send({
                                        msg: 'User Register Successfully',
                                    })
                                )
                                .catch((error) =>
                                    res.status(500).send({ error })
                                );
                        })
                        .catch((error) => {
                            return res.status(500).send({
                                error: 'Enable to hashed password',
                            });
                        });
                }
            }
        }

        // check for existing email
        // const existEmail =

        // Promise.all([existUsername, existEmail])
        //     .then(() => {
        //         if (password) {
        //             bcrypt
        //                 .hash(password, 10)
        //                 .then((hashedPassword) => {
        //                     const user = new UserModel({
        //                         username,
        //                         password: hashedPassword,
        //                         profile: profile || '',
        //                         email,
        //                     });

        //                     // return save result as a response
        //                     user.save()
        //                         .then((result) =>
        //                             res.status(201).send({
        //                                 msg: 'User Register Successfully',
        //                             })
        //                         )
        //                         .catch((error) =>
        //                             res.status(500).send({ error })
        //                         );
        //                 })
        //                 .catch((error) => {
        //                     return res.status(500).send({
        //                         error: 'Enable to hashed password',
        //                     });
        //                 });
        //         }
        //     })
        //     .catch((error) => {
        //         return res.status(500).send({ error });
        //     });
    } catch (error) {
        return res.status(500).send({ error });
    }
}

/** POST: http://localhost:8080/api/login
 *@param: {
    "username":"shibu",
    "password":"Shibu@123",
 } 
*/
export async function login(req, res) {
    const { username, password } = req.body;
    try {
        UserModel.findOne({ username })
            .then((user) => {
                bcrypt
                    .compare(password, user.password)
                    .then((passwordCheck) => {
                        if (!passwordCheck)
                            return res
                                .status(400)
                                .send({ error: "Don't have password" });
                        // Let create JWT token
                        const token = jwt.sign(
                            {
                                userId: user._id,
                                username: user.username,
                            },
                            env.JWT_SECRET,
                            { expiresIn: '24h' }
                        );
                        return res.status(200).send({
                            msg: 'Login successful',
                            username: user.username,
                            token,
                        });
                    })
                    .catch((error) => {
                        return res
                            .status(400)
                            .send({ error: 'Password does not match' });
                    });
            })
            .catch((error) => {
                return res.status(404).send({ error: 'Username not found' });
            });
    } catch (error) {
        return res.status(500).send({ error });
    }
}

/** GET: http://localhost:8080/api/user/shibu */
export async function getUser(req, res) {
    const { username } = req.params;
    try {
        if (!username)
            return res.status(501).send({ error: 'Invalid username' });
        const user = await UserModel.findOne({ username });
        if (!user)
            return res.status(501).send({ error: "Can't find the user" });
        // Remove password to JSON
        /** mongoose return unnecessary data with object so we convert it into json */
        const { password, ...rest } = Object.assign({}, user.toJSON());
        return res.status(201).send(rest);
    } catch (error) {
        return res.status(404).send({ error: "Can't find User data" });
    }
}

/** PUT: http://localhost:8080/api/updateUser 
 * @param:{
    "id":"<userId>"
}
body: {
    firstname:"Soumya",
    lastname: "Behera",
    profile:""
}
*/
export async function updateUser(req, res) {
    try {
        const { userId } = req.user;
        // const id = req.query.id;
        // console.log(id);
        if (userId) {
            const body = req.body;
            // Update the data
            const result = await UserModel.updateOne({ _id: userId }, body);
            // console.log(result);
            if (result.modifiedCount > 0) {
                return res.status(201).send({ msg: 'Record updated...!' });
            } else if (result.matchedCount === 0) {
                return res.status(401).send({ error: 'Record not found...!' });
            } else {
                return res.status(401).send({ error: 'Record updated...!' });
            }
        } else {
            return res
                .status(401)
                .send({ error: `User not found with userId: ${userId}` });
        }
    } catch (error) {
        return res.status(401).send({ error });
    }
}

/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
    res.json('generateOTP route');
}

/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
    res.json('verifyOTP route');
}

// Successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
    res.json('createResetSession route');
}

/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
    res.json('resetPassword route');
}
