import { util } from "@aws-appsync/utils";

export function request(ctx) {
  const { NoteId, UserArn } = ctx.stash;
  const request = {
    operation: "DeleteItem",
    key: util.dynamodb.toMapValues({ NoteId, UserArn }),
  };
  return request;
}

export function response(ctx) {
  const { error, result } = ctx;
  if (error) {
    util.appendError(error.message, error.type);
  }
  return result;
}
