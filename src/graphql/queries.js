/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    name
    useGeolocation
    preferredTimezone
  }
}
`;
export const listUsers = `query ListUsers(
  $filter: ModeluserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      useGeolocation
      preferredTimezone
    }
    nextToken
  }
}
`;
