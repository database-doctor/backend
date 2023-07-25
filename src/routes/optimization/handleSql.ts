import { Parser, AST, Column, ColumnRef, Dual, From, Limit, OrderBy, With } from "node-sql-parser";

export type QueryResult = {[key in OptimizationType]: string[]};

export enum OptimizationType {
  ExplicitColumns = 0, 
  ExtractNested,
  ClusteredIndex, 
  NonClusteredIndex, 
  RemoveDistinct, 
}

export interface Select {
  with: With | null;
  type: "select";
  options: any[] | null;
  distinct: "DISTINCT" | null;
  columns: any[] | Column[] | "*";
  from: Array<From | Dual | any> | null;
  where: any;
  groupby: ColumnRef[] | null;
  having: any[] | null;
  orderby: OrderBy[] | null;
  limit: Limit | null;
  _orderby?: OrderBy[] | null;
  _limit?: Limit | null;
  parentheses_symbol?: boolean;
  _parentheses?: boolean;
  _next?: AST;
}

export interface JoinPredicate {
  table: string, 
  column: string, 
}

export const handleFrom = async (fromClause: any, output: QueryResult, callback: (ast: AST, output: QueryResult) => void) => {
  for (const node of fromClause) {
    if (node.expr) {
      callback(node.expr.ast, output);
    }
  }
}

export const handleWhere = async (whereClause: any, output: QueryResult, callback: (ast: AST, output: QueryResult) => void) => {
  const leftNode = whereClause.left;
  const rightNode = whereClause.right;
  if (leftNode.type == "expr_list") {
    for (const leftClause of leftNode.value) {
      callback(leftClause.ast, output);
    }
  }
  if (rightNode.type == "expr_list") {
    for (const rightClause of rightNode.value) {
      callback(rightClause.ast, output);
    }
  }

  if (leftNode.type == "binary_expr") {
    handleWhere(leftNode, output, callback);
  }
  if (rightNode.type == "binary_expr") {
    handleWhere(rightNode, output, callback);
  }
}

export const getPredicate = async (joinNode: any): Promise<JoinPredicate | null> => {
  if (joinNode && joinNode.type == "column_ref") {
    return {
      "table": joinNode.table, 
      "column": joinNode.column, 
    };
  }
  return null;
}