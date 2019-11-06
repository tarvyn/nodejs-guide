import { connect } from "mongoose";

export const connectionUrl = 'mongodb+srv://tarvyn:Gc07rUPcPfIgln9S@nodejscoursecluster-x4gtx.mongodb.net/Feed';

export const mongoConnect = async () => {
  await connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

