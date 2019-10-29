import { API, graphqlOperation } from "aws-amplify";
import { createUser } from "./graphql/mutations";
import localforage from "localforage";

export const handleAuth = data => {
  switch (data.payload.event) {
    case "signIn":
      //TODO: handle federated sign in with create
      break;
    case "signUp":
      API.graphql(
        graphqlOperation(createUser, {
          input: { name: data.payload.data.user.username }
        })
      ).then(slt => {
        localforage.setItem(
          `tidalextremist${slt.data.createUser.name}`,
          slt.data.createUser
        );
      });
      break;
    default:
      break;
  }
};
