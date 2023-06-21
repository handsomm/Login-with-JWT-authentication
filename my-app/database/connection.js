import mongoose from "mongoose";


// async function connect(){
//     const URI = 'mongodb://localhost:27017/login_system'
//     mongoose.set('strictQuery', true)
//     const db = mongoose.connect(URI)
//     console.log('Database Connected');
//     return db
// }

mongoose.connect('mongodb://localhost:27017/login_system', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database'))
  .catch((err) => console.log('Error connecting to database', err));

// export default connect