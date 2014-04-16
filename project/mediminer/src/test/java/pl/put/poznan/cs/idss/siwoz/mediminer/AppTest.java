package pl.put.poznan.cs.idss.siwoz.mediminer;

import java.io.File;
import java.util.Random;

import pl.put.poznan.cs.idss.siwoz.mediminer.converter.loader.ArffToInstancesConverter;
import pl.put.poznan.cs.idss.siwoz.mediminer.converter.loader.CSVToInstancesConverter;
import pl.put.poznan.cs.idss.siwoz.mediminer.converter.loader.IToInstancesConverter;
import pl.put.poznan.cs.idss.siwoz.mediminer.converter.loader.XlsToInstancesConverter;
import pl.put.poznan.cs.idss.siwoz.mediminer.converter.saver.IFromInstancesConverter;
import pl.put.poznan.cs.idss.siwoz.mediminer.converter.saver.InstancesToArffConverter;
import pl.put.poznan.cs.idss.siwoz.mediminer.converter.saver.InstancesToCSVConverter;
import pl.put.poznan.cs.idss.siwoz.mediminer.converter.saver.InstancesToXlsConverter;
import weka.classifiers.lazy.IBk;
import weka.core.Instances;
import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

/**
 * Unit test for simple App.
 */
public class AppTest extends TestCase {
	/**
	 * Create the test case
	 * 
	 * @param testName
	 *            name of the test case
	 */
	public AppTest(String testName) {
		super(testName);
	}

	/**
	 * @return the suite of tests being tested
	 */
	public static Test suite() {
		return new TestSuite(AppTest.class);
	}

	private void testFromInstancesConverter(
			IFromInstancesConverter fromConverter,
			IToInstancesConverter toConverter, String extension) {
		try {
			String path1 = System.getProperty("user.dir")
					+ "/src/test/resources/test" + extension;
			Instances data1 = toConverter.parseToInstances(path1);

			String path2 = System.getProperty("user.dir")
					+ "/src/test/resources/test-converted" + extension;
			fromConverter.parseFromInstances(data1, path2);
			Instances data2 = toConverter.parseToInstances(path2);
			for (int i = 0; i < data1.numInstances(); i++) {
				assertEquals(data1.instance(i).toString(), data2.instance(i)
						.toString());
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void testFromInstancesConverter() {
		testFromInstancesConverter(new InstancesToCSVConverter(),
			new CSVToInstancesConverter(), ".csv");
		testFromInstancesConverter(new InstancesToArffConverter(),
				new ArffToInstancesConverter(), ".arff");
		testFromInstancesConverter(new InstancesToXlsConverter(),
				new XlsToInstancesConverter(), ".xls");
	}

	public void testToInstancesConverter() {
		try {
			String path1 = System.getProperty("user.dir")
					+ "/src/test/resources/test.arff";
			String path2 = System.getProperty("user.dir")
					+ "/src/test/resources/test.csv";
			String path3 = System.getProperty("user.dir")
					+ "/src/test/resources/test1.xls";
			IToInstancesConverter converter1 = new ArffToInstancesConverter();
			Instances data1 = converter1.parseToInstances(path1);
			IToInstancesConverter converter2 = new CSVToInstancesConverter();
			Instances data2 = converter2.parseToInstances(path2);
			IToInstancesConverter converter3 = new XlsToInstancesConverter();
			Instances data3 = converter3.parseToInstances(path3);
			IBk c1 = new IBk(1);
			IBk c2 = new IBk(1);
			IBk c3 = new IBk(1);
			c1.buildClassifier(data1);
			c2.buildClassifier(data2);
			c3.buildClassifier(data3);
			for (int i = 0; i < data1.numInstances(); i++) {
				double result1 = c1.classifyInstance(data1.instance(i));
				double result2 = c2.classifyInstance(data2.instance(i));
				double result3 = c3.classifyInstance(data3.instance(i));
				String sAttr1 = data1.classAttribute().value((int) result1);
				String sAttr2 = data2.classAttribute().value((int) result2);
				String sAttr3 = data3.classAttribute().value((int) result3);
				// System.out.println(sAttr1 + " " + sAttr2+ " " + sAttr3);
				assertEquals(sAttr1, sAttr2);
				assertEquals(sAttr1, sAttr3);
				assertEquals(sAttr2, sAttr3);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
