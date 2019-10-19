import { Db, MongoClient } from 'mongodb';

const connectionUrl = 'mongodb+srv://tarvyn:Gc07rUPcPfIgln9S@nodejscoursecluster-x4gtx.mongodb.net/test?retryWrites=true&w=majority';
let db: Db;

export const mongoConnect = async () => {
  const client = await MongoClient.connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  db = client.db();

  return client;
};

export const getDb = () => db;