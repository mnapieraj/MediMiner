$(document).ready(function() {

    console.log('Main view loaded');

    var actions = new Actions();
    var instances = new Instances('data-table');

    // menu buttons
    $('li#import-data').click(function(e) {
	e.preventDefault();
	$('input#file_to_open').trigger('click');
    });

    $('input#file_to_open').change(function() {
	$('form#open_file_form').submit();
    });

    if (!actions.handleError()) {

	actions.loadHeaders();
	actions.loadInstances();
    }

});

function Actions() {
};

Actions.prototype.showError = function(message) {
    $('div#error-box').show();
    $('div#error-box').html(message);
}

Actions.prototype.showSuccess = function(message) {
    $('div#success-box').show();
    $('div#success-box').html(message);
}

Actions.prototype.getURLParameter = function(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
	var sParameterName = sURLVariables[i].split('=');
	if (sParameterName[0] == sParam)
	    return sParameterName[1];
    }
    return null;
}

Actions.prototype.handleError = function() {
    if (this.getURLParameter('error') != null) {
	if (this.getURLParameter('error') == 'import-error') {
	    this.showError('This file format is not supported. Try to import correct CSV, XLS or ARFF file.');
	}
	return true;
    } else {
	return false;
    }
}

Actions.prototype.loadHeaders = function() {

    var actions = this;

    $.ajax({
	dataType : 'json',
	url : 'rest?action=get-attributes',
	context : document.body
    }).done(function(data) {
	$.each(data, function(i, item) {
	    $('#data-table thead').append('<th title="' + item.m_Name + '"><div>' + item.m_Name + '</div></th>');
	    $('#data-table tfoot').append('<th title="' + item.m_Name + '"><div>' + item.m_Name + '</div></th>');
	});
	instances.addOptionsToHeaders();
	
    }).error(function(err, a, b) {
	actions.showError("You have to open model or import any data file.");
	console.log(err);
    });
}

Actions.prototype.loadInstances = function() {

    var actions = this;

    $('#data-table').hide();
    $('#data-table thead').empty();
    $('#data-table tbody').empty();
    $('#data-table tfoot').empty();

    $('div#table-container').css('overflow', 'hidden');
    $('div#table-container').css('background-image', 'url(images/loading.gif)');
    $('div#table-container').css('background-position', 'center center');
    $('div#table-container').css('background-repeat', 'no-repeat');

    var keyOf = function(array, v) {
	for (var k = 0; k < array.length; k++) {
	    if (array[k] == v) {
		return k;
	    }
	}
    }

    $.ajax({
	dataType : 'json',
	url : 'rest?action=get-instances',
	context : document.body
    }).done(function(data) {
	$.each(data, function(i, item) {
	    console.log(item);
	    var row = '<tr>';
	    if (item.m_NumAttributes !== undefined) {
		for (var i = 0; i < item.m_NumAttributes; i++) {
		    if ($.inArray(i, item.m_Indices) > -1) {
			row += '<td>' + item.m_AttValues[keyOf(item.m_Indices, i)] + '</td>';

		    } else {
			row += '<td>' + '-' + '</td>';
		    }
		}
		row += '</tr>';
		$('#data-table tbody').append(row);
	    } else {
		for (var i = 0; i < item.m_AttValues.length; i++) {

		    row += '<td>' + item.m_AttValues[i] + '</td>';

		}
		row += '</tr>';
		$('#data-table tbody').append(row);
	    }
	});
	$('#data-table').show();
	$('div#table-container').css('overflow', 'scroll');
	$('div#table-container').css('background-image', 'none');
	actions.showSuccess(data.length + " instances have been loaded.");
    }).error(function(err, a, b) {
	$('div#table-container').css('background-image', 'none');
	actions.showError("You have to open model or import any data file.");
	console.log(err);
    });
}