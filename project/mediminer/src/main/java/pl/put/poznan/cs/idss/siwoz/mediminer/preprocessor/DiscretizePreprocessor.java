
/**
 * @author mnapieraj
 */
package pl.put.poznan.cs.idss.siwoz.mediminer.preprocessor;

import weka.core.Instances;
import weka.filters.Filter;
import weka.filters.supervised.attribute.Discretize;

public class DiscretizePreprocessor implements IPreprocessor {

	private Discretize filter;
	
	@Override
	public Instances preprocessForAttrNumbers(Instances instances,
			int[] attributesNumbers) throws Exception {
		filter = new Discretize();
		filter.setAttributeIndicesArray(attributesNumbers);
		filter.setInputFormat(instances);
		instances = Filter.useFilter(instances, filter);
		return instances;
	}


}
