export function request(ctx) {
  ctx.stash.NoteId = ctx.args.NoteID;
  ctx.stash.UserArn = ctx.args.userArn;
  return {};
}

export function response(ctx) {
  return ctx.prev.result;
}
