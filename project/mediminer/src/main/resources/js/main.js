$(document).ready(function() {

    console.log('Main view loaded');

    var actions = new Actions();

    $('#error-box').click(function(e) {
	e.preventDefault();
	$(this).fadeOut();
    });

    $('#success-box').click(function(e) {
	e.preventDefault();
	$(this).fadeOut();
    });

    // menu buttons
    $('li#import-data').click(function(e) {
	e.preventDefault();
	$('input#file_to_open').trigger('click');
    });

    $('li#export-data-arff').click(function(e) {
	e.preventDefault();
	actions.downloadArff();
    });

    $('li#export-data-csv').click(function(e) {
	e.preventDefault();
	actions.downloadCsv();
    });

    $('li#export-data-xls').click(function(e) {
	e.preventDefault();
	actions.downloadXls();
    });

    $('input#file_to_open').change(function() {
	$('form#open_file_form').submit();
    });

    $('.build').click(function(e) {
	e.preventDefault();
	actions.buildClassifier($(this).attr('classifier'));
    });

    $('.classify').click(function(e) {
	e.preventDefault();
	actions.classify($(this).attr('classifier'));
    });

    if (!actions.handleError()) {

	actions.loadHeaders();
	actions.loadInstances();

    }

});

function Actions() {
};

Actions.prototype.showError = function(message) {
    if ($('div#error-box').is(':visible')) {
	$('div#error-box').hide();
    }
    $('div#error-box').html(message);
    $('div#error-box').fadeIn();
}

Actions.prototype.showSuccess = function(message) {
    if ($('div#success-box').is(':visible')) {
	$('div#success-box').hide();
    }
    $('div#success-box').html(message);
    $('div#success-box').fadeIn();
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
	actions.showSuccess(data.length + " instances has been loaded.");
    }).error(function(err, a, b) {
	$('div#table-container').css('background-image', 'none');
	actions.showError("You have to open model or import any data file.");
	console.log(err);
    });
}

Actions.prototype.downloadArff = function() {

    var actions = this;

    $.ajax({
	url : 'rest?action=export-arff',
	context : document.body
    }).done(function(data) {
	$('a#download-arff').attr('href', './files/' + data);
	$('a#download-arff').get(0).click();
	actions.showSuccess("Arff file generated.");
    }).error(function(err, a, b) {
	actions.showError("You can't save empty data to file.");
	console.log(err);
	console.log(a);
	console.log(b);
    });

}

Actions.prototype.downloadCsv = function() {

    var actions = this;

    $.ajax({
	url : 'rest?action=export-csv',
	context : document.body
    }).done(function(data) {
	$('a#download-csv').attr('href', './files/' + data);
	$('a#download-csv').get(0).click();
	actions.showSuccess("CSV file generated.");
    }).error(function(err, a, b) {
	actions.showError("You can't save empty data to file.");
	console.log(err);
	console.log(a);
	console.log(b);
    });

}

Actions.prototype.downloadXls = function() {

    var actions = this;

    $.ajax({
	url : 'rest?action=export-xls',
	context : document.body
    }).done(function(data) {
	$('a#download-xls').attr('href', './files/' + data);
	$('a#download-xls').get(0).click();
	actions.showSuccess("XLS file generated.");
    }).error(function(err, a, b) {
	actions.showError("You can't save empty data to file.");
	console.log(err);
	console.log(a);
	console.log(b);
    });

}

Actions.prototype.buildClassifier = function(classifier) {

    var actions = this;

    var option = $('#option-' + classifier).val();

    $('#classify-' + classifier).hide();

    $.ajax({
	url : 'rest?action=build&classifier=' + classifier + '&option=' + option,
	context : document.body
    }).done(function(data) {
	actions.showSuccess("Classifier is ready.");
	$('#build-' + classifier).text('Rebuild');
	$('#classify-' + classifier).fadeIn();
    }).error(function(err, a, b) {
	actions.showError("Classifier building failed");
	console.log(err);
	console.log(a);
	console.log(b);
    });
}

Actions.prototype.classify = function(classifier) {

    var actions = this;

    actions.showError("Classification for " + classifier + " is not suported yet!");

}