function flatten (obj, prefix, current) {
	prefix = prefix || []
	current = current || {}

	// Remember kids, null is also an object!
	if (typeof (obj) === 'object' && obj !== null) {
		Object.keys(obj).forEach(key => {
			this.flatten(obj[key], prefix.concat(key), current)
		})
	} else {
		current[prefix.join('_')] = obj
	}

	return current
}

var default_cntr = 1
function loadIntoDB(obj, root) {
	if (Array.isArray(obj)) { //handle arrays add a default name for db
		let name = "default_name_" + default_cntr
		let loadedObj = {}
		loadedObj[name] = obj
		default_cntr++
		if (!tableNames.includes(name)) {
			loadIntoDB(loadedObj, root)
		}
	}
	for (key in obj) {
		let name = root === '' ? key : root + '_' + key
		if (!isNaN(name)) {
			name = 'default_index_' + name
		}
		if (!tableNames.includes(name)) { //dont want duplicates
			if (Array.isArray(obj[key])) {
				let arr = obj[key]
				try {
					let cols = []
					for (let i = 0; i < arr.length; i++) {
						let item = flatten(arr[i])
						if (i == 0) {
							for (arrkey in item) {
								cols.push(arrkey)
							}
							tableCreate(name, cols)
						}
						row = []
						for (let j = 0; j < cols.length; j++) {
							row.push( //push to db with double qoutes
								!isNaN(item[cols[j]]) ? item[cols[j]] : '"' + item[cols[j]] + '"'
							)
						}
						let success = tableInsert(name, row)
					}
					tableNames.push(name)
					tableRows.push(arr.length)
				} catch (err) {
					console.log(err)
				}
			} else if (typeof obj[key] === 'object') {
				loadIntoDB(obj[key], name)
			}
		}
	}
}

function getTableList() {
	try {
		tableList = document.getElementById('table-list')
		if (tableNames.length === 0 && tableRows.length === 0) {
			tableList.innerHTML = '<div class="pill tiny">no tables found</div>'
		} else {
			list = ''
			for (let k = 0; k < tableNames.length; k++) {
				if (tableRows[k] === 0) //something went wrong
					continue
				list += '<div class="pill tiny" onclick="preloadQuery(' + k + ')">' + tableNames[k] +
					' &nbsp( rows: ' + tableRows[k] + ' )</div>'
			}
			tableList.innerHTML = list
		}
	} catch (err) {
		console.log(err)
	}
}

function hidePreviewable() {
	let previewTable = document.getElementById('preview-table')
	previewTable.style.display = 'none'
}

function showPreviewable(marked) {
	let previewTable = document.getElementById('preview-table')
	previewTable.style.display = ''
	previewTable.innerHTML = marked
}

function generatePreviewable(csv_rows) {
	if (csv_rows.length > 1) {
		let marked = '<tr>'
		for (let i = 0; i < csv_rows[0].length; i++) {
			marked += '<th>'+csv_rows[0][i]+'</th>'
		}
		marked += '</tr>'
		if (csv_rows.length > 0) {
			for (let i = 1; i < csv_rows.length; i++) {
				marked += '<tr>'
				for (let j = 0; j < csv_rows[i].length; j++) {
					marked += '<td>'+csv_rows[i][j]+'</td>'
				}
				marked += '</tr>'
			}
		}
		showPreviewable(marked)
	} else {
		hidePreviewable()
	}
}
