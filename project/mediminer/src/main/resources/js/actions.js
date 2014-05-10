Actions.prototype.initToolbox = function(toolboxId) {
	var self = this;
	this.toolbox = $("#" + toolboxId);
	this.toolbox.find("#discretize").click(function(evt) {
		self.discretize();
	});
	
	this.toolbox.find("#normalize").click(function(evt) {
		self.normalize();
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