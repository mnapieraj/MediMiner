package pl.put.poznan.cs.idss.siwoz.mediminer;

import java.util.Random;

import pl.put.poznan.cs.idss.siwoz.mediminer.converter.loader.ArffToInstancesConverter;
import pl.put.poznan.cs.idss.siwoz.mediminer.converter.loader.CSVToInstancesConverter;
import pl.put.poznan.cs.idss.siwoz.mediminer.converter.loader.IToInstancesConverter;
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

	/**
	 * Rigourous Test :-)
	 */
	public void testApp() {
		assertTrue(true);
	}

	public void testConverter() {
		try {
			String path = System.getProperty("user.dir")
					+ "/src/test/resources/test.csv";
			IToInstancesConverter converter1 = new ArffToInstancesConverter();
			Instances data1 = converter1.parseToInstances(path);
			IToInstancesConverter converter2 = new CSVToInstancesConverter();
			Instances data2 = converter2.parseToInstances(path);
			IBk c5 = new IBk(1);
			c5.buildClassifier(data1);
			int testInstanceIdx = 0;
			System.out.println(c5.classifyInstance(data1.instance(testInstanceIdx)));
			c5.buildClassifier(data2);
			System.out.println(c5.classifyInstance(data2.instance(testInstanceIdx)));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
