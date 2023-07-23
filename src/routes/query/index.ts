import { Router } from "express";
import { processQuery } from "./process";

export const routes = Router();

//
// POST /query
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
// - The query is executed in the database, and the result is returned. Note
//   that when hasError is not set, the exact result from the database is
//   returned, which might include errors on the database side.
// - In the result, hasError indicates if there was an error on the application
//   side, e.g. invalid access token, not the database side, e.g. an error
//   thrown by the database against which the query was issued. Database errors
//   will be propagated to the result as is.
//
routes.post("/", (req, res) => {
  processQuery(req.body).then((result) => res.send(result));
});
