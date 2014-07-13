/**
 * @author mnapieraj
 */

package pl.put.poznan.cs.idss.siwoz.mediminer.converter.loader;

import weka.core.Instances;

public interface IToInstancesConverter {
	
	public Instances parseToInstances(String fileName) throws Exception;
	
}
