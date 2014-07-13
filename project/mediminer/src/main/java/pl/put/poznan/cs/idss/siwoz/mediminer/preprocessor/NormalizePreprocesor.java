/**
 * @author mnapieraj
 */

package pl.put.poznan.cs.idss.siwoz.mediminer.preprocessor;

import weka.core.Instances;
import weka.filters.Filter;
import weka.filters.supervised.attribute.Discretize;
import weka.filters.unsupervised.attribute.Normalize;

public class NormalizePreprocesor  implements IPreprocessor{

	private Normalize filter;
	
	@Override
	public Instances preprocessForAttrNumbers(Instances instances,
			int[] attributesNumbers) throws Exception {
		filter = new Normalize();
		filter.setInputFormat(instances);
		instances = Filter.useFilter(instances, filter);
		return instances;
	}

}
