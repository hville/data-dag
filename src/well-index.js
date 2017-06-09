export function wellIndex(wn, sn) {
	for (var i=0, wells=sn.wells; i<wells.length; ++i) if (wells[i].well === wn) return i
	return -1
}
