package pl.put.poznan.cs.idss.siwoz.mediminer.converter.loader;

import java.io.File;
import java.io.IOException;

import weka.core.Instances;

public interface IToInstancesConverter {
	
	public Instances parseToInstances(String fileName) throws Exception;
	
}
