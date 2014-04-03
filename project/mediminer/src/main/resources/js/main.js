$(document).ready(function() {

	utils.getKey();

	utils.reload();

	$("button#show-add").click(function(e) {
		e.preventDefault();
		utils.showAddNew();
		$("#title-section").trigger("click");
		$("#title-section").trigger("click");
	});

	$("button#store-all").click(function(e) {
		e.preventDefault();
		$("#title-section").trigger("click");
		$("#title-section").trigger("click");
		$('#loading-overlay').fadeIn();
		$('#loading-message').fadeIn();
		utils.store();
		$("#title-section").trigger("click");
		$("#title-section").trigger("click");
		setTimeout(function() {
			$('#loading-overlay').fadeOut();
			$('#loading-message').fadeOut();
			utils.reload();
		}, 1500);
		$("#title-section").trigger("click");
	});

	$("#add-overlay .overlay-close").click(function(e) {
		e.preventDefault();
		$("#add-overlay").slideUp();
		$("#title-section").trigger("click");
		$("#title-section").trigger("click");
	});

	$("button#end-work").click(function(e) {
		e.preventDefault();
		utils.endWork();
		$("#title-section").trigger("click");
		$("#title-section").trigger("click");
	});

	$("ul#filters li.show-all").click(function(e) {
		e.preventDefault();
		$("ul#filters li").each(function() {
			$(this).removeClass('clicked');
		});
		$(this).addClass('clicked');
		if ($(this).hasClass('show-all')) {
			utils.filter('*');
		}
		$("#title-section").trigger("click");
	});

	$("ul#activeFilters li.hideActive").click(function(e) {
		e.preventDefault();
		utils.hideActive();
		$("#title-section").trigger("click");
	});

	$("ul#activeFilters li.hideInactive").click(function(e) {
		e.preventDefault();
		utils.hideInactive();
		$("#title-section").trigger("click");
	});

	$("ul#activeFilters li.removeFilters").click(function(e) {
		e.preventDefault();
		$('ul#filters li.show-all').trigger('click');
		$("#title-section").trigger("click");
	});

	$(function() {
		$(".has-datepicker").datepicker();
	});

});