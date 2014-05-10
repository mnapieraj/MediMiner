function Instances (tableId) {
	this.table = $("#" + tableId);
	//atrybuty indeksowane od 0
	this.selectedAttributes = [];
};


Instances.prototype.addOptionsToHeaders = function () {
	var self = this;
	var footTh = this.table.find("tfoot").find("th");
	var headTh = this.table.find("thead").find("th");
	var headers = this.table.find("th");
	footTh.append("<input type='checkbox'/>");
	headTh.prepend("<input type='checkbox'/>");
	
	var onHeaderSelect = function (evt) {
		var colNumber = $(this).attr('name'), selector = ":nth-child(" + colNumber + ")";
		var column = self.table.find("th" + selector + ",  td" + selector);
		if($(this).is(":checked")) {
			self.selectedAttributes.push(colNumber - 1);
			column.addClass('selected');
		} else {
			var idx = self.selectedAttributes.indexOf(colNumber - 1);
			self.selectedAttributes.splice(idx, 1);
			column.removeClass('selected');
		}
		self.table.find("[name="+colNumber+"]").attr('checked', $(this).is(":checked"));
	};
	var checkBoxes = headers.find(':checkbox');
	$.each(checkBoxes, function(idx, el) {
		$(el).attr('name',  (idx + 1) % (checkBoxes.length / 2));
		$(el).on('click', onHeaderSelect);
	});
};


Instances.prototype.modifyAttributes = function (attributesMap) {
	var self = this;
	$.each(attributesMap, function (key, values) {
		self.modifyAttribute(parseInt(key), values);
	});
};

Instances.prototype.modifyAttribute = function (attrNo, values) {
	var self = this;
	$.each(values, function (idx, val) {
		var cell = self.table.find("tr").eq(idx).find("td").eq(attrNo);
		cell.text(val);
	});
};

Instances.prototype.modifyInstances = function (data) {
	var self = this;
	$.each(data, function (idx, instance) {
		for (var i = 0; i < instance.m_AttValues.length; i++) {
			var cell = self.table.find("tr").eq(idx).find("td").eq(i);
			var val = instance.m_AttValues[i];
			cell.text(val);
		}
	});
};


