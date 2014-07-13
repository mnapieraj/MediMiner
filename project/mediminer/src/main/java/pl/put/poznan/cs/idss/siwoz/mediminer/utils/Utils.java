/**
 * @author mnapieraj
 */
package pl.put.poznan.cs.idss.siwoz.mediminer.utils;

public class Utils {

	public static int[] parseToIntList(String[] strList, int size) {
		int[] intList = new int[size];
		for (int i = 0; i < size && i < strList.length; i++) {
			intList[i] = Integer.parseInt(strList[i]);
		}
		return intList;
	}
	
}
