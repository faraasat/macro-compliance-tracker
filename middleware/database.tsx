import { MongoClient } from "mongodb";
import nextConnect from "next-connect";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.SECRET_MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function database(req, res, next) {
  if (!client.isConnected()) await client.connect();
  req.dbClient = client;
  req.db = client.db("MCT");
  return next();
}

const middleware = nextConnect();

middleware.use(database);

export default middleware;
