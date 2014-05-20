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
	
	this.toolbox.find("#selectAttrOptions").find("#all").click(function (evt) {
		self.instances.selectAll();
		$("#selectAttrOptions").hide();
	});
	
	this.toolbox.find("#selectAttrOptions").find("#none").click(function (evt) {
		self.instances.unselectAll();
		$("#selectAttrOptions").hide();
	});
	
	this.toolbox.find("#selectAttrOptions").find("#best").click(function (evt) {
		self.selectBestAction();
		$("#selectAttrOptions").hide();
	});
	
	this.toolbox.find("#hideCheckbox").click(function (evt) {
		self.changeVisibiltyOfUnselected();
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
		self.showError("An error occured during normalization. Please try again.");
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

Actions.prototype.selectBestAction = function () {
	var self = this;
	$("#selectAttrDialog").dialog({
		modal : true,
		buttons : {
			Select : function () {
				self.selectBest();
				$( this ).dialog( "close" );
			}
		}
	});
	return;
}

Actions.prototype.selectBest = function () {
	var attrNo = $("#selectAttrDialog").find("#attrNo").val();
	var self = this;
	$.ajax({
		url : 'rest?action=select-attributes',
		context : document.body,
		data : {
			"attributesNo" : attrNo,
		}
	}).done(function(data) {
		var rankedAttributes = JSON.parse(data),
		attributes = $.map(rankedAttributes, function(el, idx){
			return el[0] + 1;
		});
		ranks = $.map(rankedAttributes, function(el, idx){
			return el[1];
		});
		self.instances.selectAttributes(attributes);
		
	}).error(function(err, a, b) {
		self.showError("An error occured during selecting attributes. Please try again.");
	});
}

Actions.prototype.changeVisibiltyOfUnselected = function () {
	var visible = !this.toolbox.find("#hideCheckbox").is(":checked");
	this.instances.changeVisibiltyOfUnselected(visible);
}