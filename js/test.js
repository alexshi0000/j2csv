function tableTest() {
	warn('TEST #1')
	// Run a query without reading the results
	tableCreate('test', ['col1', 'col2'])
	// Insert two rows: (1,111) and (2,222)
	tableInsert('test', [111111, 222222])
	tableInsert('test', [11111, 22222])
	tableInsert('test', [1111, 2222])
	// Prepare a statement
	let arr1 = tableSelect('SELECT * FROM test');

	warn('TEST #2')
	tableCreate('test_two', ['c1', 'c2', 'c3'])
	tableInsert('test_two', [1, null, "1"])
	tableInsert('test_two', [2, null, "2"])
	tableInsert('test_two', [3, null, "3"])
	let arr2 = tableSelect('SELECT * FROM test_two')
}
