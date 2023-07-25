import { Router } from "express";

export const routes = Router();

//
// POST /optimization
//
// Request body:
// {
//   "accessToken": {access token string},
//   "query": {sql query string}
// }
//
// Response body:
// {
//   "hasError": {boolean},
//   "errors": {array of error message strings},
//   "result": {query result data}
// }
//
// Comments:
// - The access token is sufficient in authenticating the request, and the
//   look up is performed in the UserProjectToken table. The access token will
//   return the user ID who issued the query, and the project ID to which the
//   query is issued.
// - [ADD DETAILS ABOUT EXECUTION]
// - In the result, hasError indicates if there was an error on the application
//   side, e.g. invalid access token, not the database side, e.g. an error
//   thrown by the database against which the query was issued. Database errors
//   will be propagated to the result as is.
//
routes.post("/", (req, res) => {
  // processQuery(req.body).then((result) => res.send(result));
});

routes.post("/change_freq", (req, res) => {

});