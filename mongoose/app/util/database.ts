import { connect } from "mongoose";

export const connectionUrl = 'mongodb+srv://tarvyn:Gc07rUPcPfIgln9S@nodejscoursecluster-x4gtx.mongodb.net/test?retryWrites=true&w=majority';

export const mongoConnect = async () => {
  await connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

