/**
 * @author mnapieraj
 */
package pl.put.poznan.cs.idss.siwoz.mediminer.converter.saver;

import java.io.File;
import java.io.IOException;

import weka.core.Instances;

public interface IFromInstancesConverter {
	
	File parseFromInstances(Instances instances, String fileName) throws IOException;
	
}
