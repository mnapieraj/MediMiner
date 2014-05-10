package pl.put.poznan.cs.idss.siwoz.mediminer.utils;

public class Utils {

	public static int[] parseToIntList(String[] strList) {
		int[] intList = new int[strList.length];
		for (int i = 0; i < strList.length; i++) {
			intList[i] = Integer.parseInt(strList[i]);
		}
		return intList;
	}
	
}
