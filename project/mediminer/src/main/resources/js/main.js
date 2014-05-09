$(document).ready(function() {

	function showError(message) {
		$('div#error-box').show();
		$('div#error-box').html(message);
	}

	function showSuccess(message) {
		$('div#success-box').show();
		$('div#success-box').html(message);
	}

	console.log('Main view loaded');

	// menu buttons
	$('li#import-data').click(function(e) {
		e.preventDefault();
		$('input#file_to_open').trigger('click');
	});

	$('input#file_to_open').change(function() {
		$('form#open_file_form').submit();
	});

	$.ajax({
		dataType : 'json',
		url : 'rest?action=get-attributes',
		context : document.body
	}).done(function(data) {
		console.log(data);
		$.each(data, function(i, item) {
			$('#data-table thead').append('<th>' + item.m_Name + '</th>');
		});
		$('#data-table').show();
	}).error(function(err, a, b) {
		showError("You have to open model or import any data file.");
		console.log(err);
	});

	$.ajax({
		dataType : 'json',
		url : 'rest?action=get-instances',
		context : document.body
	}).done(function(data) {
		console.log(data);
		$.each(data, function(i, item) {
			console.log(item.m_AttValues);
			var row = '<tr>';
			for (var i = 0; i < item.m_AttValues.length; i++) {
				row += '<td>' + item.m_AttValues[i] + '</td>';
			}
			row += '</tr>';
			console.log(row);
			$('#data-table tbody').append(row);
		});
		$('#data-table').show();
	}).error(function(err, a, b) {
		showError("You have to open model or import any data file.");
		console.log(err);
	});

});