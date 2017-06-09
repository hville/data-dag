export function addRow(ctx, col, name) {
	col.push(ctx.rInit.get(name).call(ctx, name, col.length))
	return ctx
}

export function delRow(r, col) {
	col.splice(r, 1)
	return r
}
