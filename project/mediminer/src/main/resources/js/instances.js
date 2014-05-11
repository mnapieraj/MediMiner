function Instances(tableId) {
	this.table = $("#" + tableId);
	// atrybuty indeksowane od 0
	this.selectedAttributes = [];
};

Instances.prototype.addOptionsToHeaders = function() {
	var self = this;
	var footTh = this.table.find("tfoot").find("th");
	var headTh = this.table.find("thead").find("th");
	var headers = this.table.find("th");
	
	$(footTh[footTh.length - 1]).css('padding-bottom',  '45px');
	$(headTh[headTh.length - 1]).css('padding-top',  '45px');
	
	footTh.splice(footTh.length - 1);
	headTh.splice(headTh.length - 1);
	
	footTh.append("<input type='checkbox'/>");
	headTh.prepend("<input type='checkbox'/>");

	var checkBoxes = headers.find(':checkbox');
	$.each(checkBoxes, function(idx, el) {
		$(el).attr('name', (idx) % (checkBoxes.length / 2) + 1);
		$(el).on('click', function(evt) {
			self.onSelectChange(this);
		});
	});
};

Instances.prototype.onSelectChange = function(clickedElement) {
	var self = this;
	var colNumber = $(clickedElement).attr('name'), selector = ":nth-child("
			+ colNumber + ")", column = self.table.find("th" + selector
			+ ",  td" + selector), idx = self.selectedAttributes
			.indexOf(colNumber - 1);
	if ($(clickedElement).is(":checked")) {
		if(idx == -1) {
			self.selectedAttributes.push(colNumber - 1);			
		}
		column.addClass('selected');
	} else {
		if(idx != -1) {
			self.selectedAttributes.splice(idx, 1);			
		}
		column.removeClass('selected');
	}
	self.table.find("[name=" + colNumber + "]").attr('checked',
			$(clickedElement).is(":checked"));
}

Instances.prototype.unselectAll = function() {
	var self = this;
	var checkboxes = this.table.find("thead").find("th").find(":checkbox");
	checkboxes.prop('checked', false);
	$.each(checkboxes, function(idx, el) {
		self.onSelectChange(el);
	});
}

Instances.prototype.selectAll = function() {
	var self = this;
	var checkboxes = this.table.find("thead").find("th").find(":checkbox");
	checkboxes.prop('checked', true);
	$.each(checkboxes, function(idx, el) {
		self.onSelectChange(el);
	});

}

Instances.prototype.selectAttributes = function (attributes) {
	var self = this;
	self.unselectAll();
	$.each(attributes, function(idx, el) {
		var checkbox = self.table.find("[name='" + el + "']").prop('checked', true);
		self.onSelectChange(checkbox);
	});
	
}

Instances.prototype.modifyAttributes = function(attributesMap) {
	var self = this;
	$.each(attributesMap, function(key, values) {
		self.modifyAttribute(parseInt(key), values);
	});
};

Instances.prototype.modifyAttribute = function(attrNo, values) {
	var self = this;
	$.each(values, function(idx, val) {
		var cell = self.table.find("tr").eq(idx).find("td").eq(attrNo);
		cell.text(val);
	});
};

Instances.prototype.modifyInstances = function(data) {
	var self = this;
	$.each(data, function(idx, instance) {
		for (var i = 0; i < instance.m_AttValues.length; i++) {
			var cell = self.table.find("tr").eq(idx).find("td").eq(i);
			var val = instance.m_AttValues[i];
			cell.text(val);
		}
	});
};
