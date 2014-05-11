Actions.prototype.initToolbox = function(toolboxId) {
	var self = this;
	this.toolbox = $("#" + toolboxId);
	
	this.toolbox.find("#selectAttrOptions").hide();
	
	this.toolbox.find("#discretize").click(function(evt) {
		self.discretize();
	});
	
	this.toolbox.find("#normalize").click(function(evt) {
		self.normalize();
	});
	
	this.toolbox.find("#selectAttr").click(function(evt) {
		self.showOptions();
	});
	
	this.toolbox.find("#selectAttrOptions").find("#all").click(function (evt) {
		self.instances.selectAll();
		$("#selectAttrOptions").hide();
	});
	
	this.toolbox.find("#selectAttrOptions").find("#none").click(function (evt) {
		self.instances.unselectAll();
		$("#selectAttrOptions").hide();
	});
	
	this.toolbox.find("#selectAttrOptions").find("#best").click(function (evt) {
		self.selectBest();
		$("#selectAttrOptions").hide();
	});
	
}

Actions.prototype.discretize = function() {
	var self = this;
	var attributes = self.instances.selectedAttributes;
	$.ajax({
		url : 'rest?action=discretize',
		context : document.body,
		data : {
			"attributes" : attributes,
		}
	}).done(function(data) {
		var attrMap = JSON.parse(data);
		$.each(attrMap, function(key, values) {
			var newValue =   $.map(values, function (attr, idx) {
				return attr.substr(3,attr.length - 6);				
			});
			attrMap[key] = newValue;
		});
		self.instances.modifyAttributes(attrMap);
	}).error(function(err, a, b) {
		self.showError("You have to choose at least one attribute to discretize.")
	});
}

Actions.prototype.normalize = function () {
	var self = this;
	var attributes = self.instances.selectedAttributes;
	$.ajax({
		url : 'rest?action=normalize',
		context : document.body,

	}).done(function(data) {
		self.instances.modifyInstances(JSON.parse(data));
	}).error(function(err, a, b) {

	});
}

Actions.prototype.showOptions = function () {
	var options = this.toolbox.find("#selectAttrOptions");
	if(options.is(":visible")) {
		options.hide();
	} else {
		options.show();
	}
}

