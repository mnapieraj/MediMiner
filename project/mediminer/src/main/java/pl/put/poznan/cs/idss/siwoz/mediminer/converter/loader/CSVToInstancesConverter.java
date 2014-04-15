package pl.put.poznan.cs.idss.siwoz.mediminer.converter.loader;

import java.io.File;

import weka.core.Instances;
import weka.core.converters.CSVLoader;

public class CSVToInstancesConverter implements IToInstancesConverter {

	@Override
	public Instances parseToInstances(String fileName) throws Exception {
		CSVLoader loader = new CSVLoader();
		loader.setSource(new File(fileName));
		Instances instances = loader.getDataSet();
		instances.setClassIndex(instances.numAttributes() - 1);
		return instances;
	}

}
