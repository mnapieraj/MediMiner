package pl.put.poznan.cs.idss.siwoz.mediminer.preprocessor;


import weka.core.Instances;

public interface IPreprocessor {

	Instances preprocessForAttrNumbers(Instances instances, int[] attributesNumbers) throws Exception;	
	
}
