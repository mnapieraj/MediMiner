package pl.put.poznan.cs.idss.siwoz.mediminer.converter.loader;

import java.io.File;
import java.io.IOException;

import weka.core.Instances;
import weka.core.converters.ConverterUtils.DataSource;

public class ArffToInstancesConverter implements IToInstancesConverter {

	@Override
	public Instances parseToInstances(String fileName) throws Exception {
		DataSource source = new DataSource(fileName);
		 Instances instances = source.getDataSet();

		 // Make the last attribute be the class
		 instances.setClassIndex(instances.numAttributes() - 1);
		 return instances;
	}

}
