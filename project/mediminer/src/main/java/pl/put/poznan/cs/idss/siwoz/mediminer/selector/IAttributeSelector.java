package pl.put.poznan.cs.idss.siwoz.mediminer.selector;

import weka.core.Instances;

public interface IAttributeSelector {
	public double[][] selectAttributes(Instances instances, int attributesNo)
			throws Exception;
}
