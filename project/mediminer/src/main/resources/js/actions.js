function Actions() {
    this.instances = new Instances('data-table');
    this.initToolbox("preprocessToolbox");
    this.SPLITTER = ":MediMinerData:"
};

Actions.prototype.initToolbox = function(toolboxId) {
    var self = this;
    this.toolbox = $("#" + toolboxId);

    this.toolbox.find("#selectAttrOptions").hide();
    this.toolbox.find("#selectAttrDialog").hide();

    this.toolbox.find("#discretize").click(function(evt) {
	self.discretize();
    });

    this.toolbox.find("#normalize").click(function(evt) {
	self.normalize();
    });

    this.toolbox.find("#selectAttr").click(function(evt) {
	self.showOptions();
    });

    this.toolbox.find("#selectAttrOptions").find("#all").click(function(evt) {
	self.instances.selectAll();
	$("#selectAttrOptions").hide();
    });

    this.toolbox.find("#selectAttrOptions").find("#none").click(function(evt) {
	self.instances.unselectAll();
	$("#selectAttrOptions").hide();
    });

    this.toolbox.find("#selectAttrOptions").find("#best").click(function(evt) {
	self.selectBestAction();
	$("#selectAttrOptions").hide();
    });

    this.toolbox.find("#hideCheckbox").click(function(evt) {
	self.changeVisibiltyOfUnselected();
    });

}

Actions.prototype.hideClassifyButtons = function() {
    $('button.classify').hide();
}

Actions.prototype.discretize = function() {
    var self = this;
    var attributes = self.instances.selectedAttributes;
    self.hideClassifyButtons();
    $.ajax({
	url : 'rest?action=discretize',
	context : document.body,
	data : {
	    "attributes" : attributes,
	}
    }).done(function(data) {
	var attrMap = JSON.parse(data);
	$.each(attrMap, function(key, values) {
	    var newValue = $.map(values, function(attr, idx) {
		return attr.substr(3, attr.length - 6);
	    });
	    attrMap[key] = newValue;
	});
	self.instances.modifyAttributes(attrMap);
    }).error(function(err, a, b) {
	self.showError("You have to choose at least one attribute to discretize.")
    });
}

Actions.prototype.normalize = function() {
    var self = this;
    var attributes = self.instances.selectedAttributes;
    self.hideClassifyButtons();
    $.ajax({
	url : 'rest?action=normalize',
	context : document.body,

    }).done(function(data) {
	self.instances.modifyInstances(JSON.parse(data));
	self.instances.setClassLabels(self.instances.labels);
    }).error(function(err, a, b) {
	self.showError("An error occured during normalization. Please try again.");
    });
}

Actions.prototype.showOptions = function() {
    var options = this.toolbox.find("#selectAttrOptions");
    if (options.is(":visible")) {
	options.hide();
    } else {
	options.show();
    }
}

Actions.prototype.selectBestAction = function() {
    var self = this;
    self.hideClassifyButtons();
    $("#selectAttrDialog").dialog({
	modal : true,
	buttons : {
	    Select : function() {
		self.selectBest();
		$(this).dialog("close");
	    }
	}
    });
    return;
}

Actions.prototype.selectBest = function() {
    var attrNo = $("#selectAttrDialog").find("#attrNo").val();
    var self = this;
    self.hideClassifyButtons();
    $.ajax({
	url : 'rest?action=select-attributes',
	context : document.body,
	data : {
	    "attributesNo" : attrNo,
	}
    }).done(function(data) {
	var rankedAttributes = JSON.parse(data), attributes = $.map(rankedAttributes, function(el, idx) {
	    return el[0] + 1;
	});
	ranks = $.map(rankedAttributes, function(el, idx) {
	    return el[1];
	});
	self.instances.selectAttributes(attributes);

    }).error(function(err, a, b) {
	self.showError("An error occured during selecting attributes. Please try again.");
    });
}

Actions.prototype.changeVisibiltyOfUnselected = function() {
    var visible = !this.toolbox.find("#hideCheckbox").is(":checked");
    this.instances.changeVisibiltyOfUnselected(visible);
}

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
	actions.instances.addOptionsToHeaders();
	var headersNo = actions.instances.table.find("thead").find("th").length;
	$("#selectAttrDialog").find("#attrNo").attr("max", headersNo - 1).val(headersNo - 1);

    }).error(function(err, a, b) {
	actions.showError("You have to open model or import any data file.");
	console.log(err);
    });
}

Actions.prototype.loadClassLabels = function() {
    var actions = this;
    $.ajax({
	dataType : 'json',
	url : 'rest?action=get-class-labels',
	context : document.body
    }).done(function(data) {
	actions.instances.setClassLabels(data);
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

    var keyOf = function(data, v) {
	var array;
	if (data.length !== undefined) {
	    array = data;
	} else {
	    array = $.map(data, function(value, index) {
		return [ value ];
	    });
	}
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
    }).done(
	    function(data) {
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

			    if (item.m_Dataset.m_Attributes.m_Objects[i].m_Hashtable !== undefined) {
				var valuesArray = $.map(item.m_Dataset.m_Attributes.m_Objects[i].m_Hashtable, function(value, index) {
				    return [index];
				});
				row += '<td>'
					+ valuesArray[keyOf(item.m_Dataset.m_Attributes.m_Objects[i].m_Hashtable,
						item.m_AttValues[i])] + '</td>';
			    } else {
				row += '<td>' + item.m_AttValues[i] + '</td>';
			    }

			}
			row += '</tr>';
			$('#data-table tbody').append(row);
		    }
		});
		$('#data-table').show();
		$('div#table-container').css('overflow', 'scroll');
		$('div#table-container').css('background-image', 'none');
		actions.showSuccess(data.length + " instances have been loaded.");
		actions.loadClassLabels();
		actions.instances.table.find("td:last-child").addClass('selected');
	    }).error(function(err, a, b) {
	$('div#table-container').css('background-image', 'none');
	actions.showError("You have to open model or import any data file.");
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

    if ($('#data-table thead th input:checked').length < 1) {
	actions.showError("You have to choose at least one attribute. If you don't know which should be selected, use option: Select attributes - The best.")
    } else {

	var option = $('#option-' + classifier).val();
	var attributes = actions.instances.selectedAttributes;

	$('#classify-' + classifier).hide();

	$.ajax({
	    url : 'rest?action=build&classifier=' + classifier + '&option=' + option,
	    context : document.body,
	    data : {
		"attributes" : attributes,
	    }
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

}

Actions.prototype.classifyAction = function(classifier) {

    var self = this;
    $('#classifyDialog table').empty();

    if ($('#data-table thead th input:checked').length < 1) {

	self.showError("You have to choose at least one attribute. If you don't know which should be selected, use option: Select attributes - The best.")
    } else {

	$.ajax({
	    dataType : 'json',
	    url : 'rest?action=get-attributes',
	    context : document.body
	}).done(
		function(data) {
		    var row = '<tr title="This row contains your past classification. Click to remove." class="to-classify">';
		    $.each(data, function(i, item) {
			if ($('input[name="' + (i + 1) + '"]').is(':checked')) {
			    $('#classifyDialog table').append(
				    '<tr title="' + item.m_Name + '"><td>' + item.m_Name + '</td><td><input type="text" class="classify-data"></td></tr>');
			    row += '<td class="fill-after">-</td>';
			} else {
			    row += '<td>-</td>';
			}
		    });
		    row += '</tr>';

		    $('#data-table tbody tr:first').before(row);
		    $('#data-table tbody tr:first').click(function(e) {
			e.preventDefault();
			$(this).remove();
		    });

		}).error(function(err, a, b) {
	    actions.showError("You have to open model or import any data file.");
	    console.log(err);
	});

	self.hideClassifyButtons();
	$("#classifyDialog").dialog({
	    modal : true,
	    buttons : {
		Classify : function() {
		    self.classifyNew(classifier);
		    $(this).dialog("close");
		}
	    }
	});
	return;

    }

}

Actions.prototype.classifyNew = function(classifier) {

    var dataString = '';
    var self = this;

    $('#classifyDialog table input').each(function() {
	$('#data-table tbody tr:first td.fill-after:first').html($(this).val());
	$('#data-table tbody tr:first td.fill-after:first').removeClass('fill-after');
	dataString += $(this).val() + self.SPLITTER;
    });

    $.ajax({
	url : 'rest?action=classify&classifier=' + classifier + '&data=' + dataString,
	context : document.body
    }).done(function(decision) {

	self.showSuccess("Classification result: " + self.instances.labels[Math.round(decision)]);
	$('#data-table tbody tr:first td:last').html(self.instances.labels[Math.round(decision)]);

    }).error(function(err, a, b) {
	self.showError("Classification incorrect. Did you set all parameters?");
	$('#data-table tbody tr:first td:last').html('FAILED');
	$('#data-table tbody tr:first').addClass('failed-classify');
	console.log(err);
    });
}

Actions.prototype.close = function() {

    var self = this;

    self.showSuccess("Application closed, now you can close the window.");
    $.ajax({
	url : 'close',
	context : document.body
    }).done(function(decision) {
	self.showSuccess("Application closed, now you can close the window.");
    }).error(function(err, a, b) {
	console.log(err);
    });
}
