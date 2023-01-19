export function request(ctx) {
  // do nothing
  return {};
}

export function response(ctx) {
  return ctx.prev.result;
}
