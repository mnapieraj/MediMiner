$(document).ready(function() {

    console.log('Main view loaded');

    var actions = new Actions();

    Tooltips.init();

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
	actions.classifyAction($(this).attr('classifier'));
    });

    if (!actions.handleError()) {

	actions.loadHeaders();
	actions.loadInstances();
    }

});
