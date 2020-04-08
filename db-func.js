config = {
	locateFile: filename => 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.2.2/dist/sql-wasm.js'
}

var db = null
var tableNames = []
var tableRows = []
var currentPreviewState = null

const success = 'success'
const failed = 'failed'

initSqlJs(config).then(function(SQL){
	db = new SQL.Database();
});

function generateSQLlist(list) {
	let ret = '('
	try {
		for (let i = 0; i < list.length; i++) {
			let item = list[i]
			ret += item + ''
			if (i < list.length - 1) {
				ret += ', '
			}
		}
		ret += ')'
	} catch (err) {
		return failed
	}
	return ret
}

function log(msg) {
	console.log('%c' + msg, 'color: #0ff')
}

function warn(msg) {
	console.log('%c' + msg, 'color: #fa0')
}

function tableCreate(tableName, columns) {
	try {
		let cols = generateSQLlist(columns)
		log('CREATE TABLE ' + tableName + ' ' + cols + ';')
		db.run('CREATE TABLE ' + tableName + ' ' + cols + ';')
	} catch (err) {
		return failed
	}
	return success
}

function tableInsert(tableName, values) {
	try {
		let vals = generateSQLlist(values)
		log('INSERT INTO ' + tableName + ' VALUES ' + vals + ';')
		db.run('INSERT INTO ' + tableName + ' VALUES ' + vals + ';')
	} catch (err) {
		return failed
	}
	return success
}

function tableSelect(query) {
	try {
		let cols = []
		let ret = []
		log(query)
		if (query.includes('insert') || query.includes('INSERT') ||
				query.includes('drop') || query.includes('DROP')) {
			throw 'User is not allowed to insert or drop tables'
		}
		res = db.prepare(query)
		// get the 2d array
		let i = 0
		while (res.step()) {
			let row = res.getAsObject()
			let rowBuilder = []
			if (i == 0) {
				for (key in row) {
					cols.push(key)
				}
				ret.push(cols)
			}
			for (let j = 0; j < cols.length; j++) {
				let key = cols[j]
				let item = row[key]
				rowBuilder.push(item)
			}
			ret.push(rowBuilder)
			i++
		}
		return ret
	} catch (err) {
		return failed
	}
	return success
}

function tableDropAll() {
	if (tableNames.length > 0) {
		for (let i = 0; i < tableNames.length; i++) {
			try {
				log('DROP TABLE '+tableNames[i])
				db.run('DROP TABLE '+tableNames[i])
			} catch (err) {
				console.log(err)
			}
		}
		warn(tableNames.length)
		warn(tableRows.length)
		tableNames = _.drop(tableNames, n = tableNames.length)
		tableRows = _.drop(tableRows, n = tableRows.length)
		warn(tableNames.length)
		warn(tableRows.length)
		getTableList()
		resetView()
		sqlEditorClear()
	} else {
		alert('No tables')
	}
}
