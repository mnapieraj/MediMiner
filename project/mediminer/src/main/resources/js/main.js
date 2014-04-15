$(document).ready(function() {

	console.log('Main view loaded');
	
	//menu buttons
	$('li#b_load_file').click(function(e) {
		e.preventDefault();
		$('input#file_to_open').trigger('click');
	});
	
	$('input#file_to_open').change(function() {
		$('form#open_file_form').submit();
	});

});