package pl.put.poznan.cs.idss.siwoz.mediminer.converter.saver;

import java.io.File;
import java.io.IOException;

import weka.core.Instance;
import weka.core.Instances;
import weka.core.converters.*;

;

public class InstancesToCSVConverter implements IFromInstancesConverter {

	@Override
	public File parseFromInstances(Instances instances, String fileName)
			throws IOException {
		File file = new File(fileName);

		if (!file.exists()) {
			file.createNewFile();
		}
		CSVSaver saver = new CSVSaver();
		saver.setInstances(instances);
		saver.setFile(file);
		saver.writeBatch();
		return file;
	}

}
