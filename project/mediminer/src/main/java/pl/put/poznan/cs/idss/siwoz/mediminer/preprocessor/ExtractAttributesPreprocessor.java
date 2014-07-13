/**
 * @author mnapieraj
 */
package pl.put.poznan.cs.idss.siwoz.mediminer.preprocessor;

import weka.core.Instances;
import weka.filters.Filter;
import weka.filters.unsupervised.attribute.Remove;

public class ExtractAttributesPreprocessor implements IPreprocessor {

	private Remove filter;
	
	@Override
	public Instances preprocessForAttrNumbers(Instances instances,
			int[] attributesNumbers) throws Exception {
		filter = new Remove();
		filter.setAttributeIndicesArray(attributesNumbers);
		filter.setInvertSelection(true);
		filter.setInputFormat(instances);
		instances = Filter.useFilter(instances, filter);
		return instances;
	}

}
