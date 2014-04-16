package pl.put.poznan.cs.idss.siwoz.mediminer.converter.saver;

import java.io.BufferedWriter;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.ArrayList;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;

import weka.core.Instances;

public class InstancesToXlsConverter implements IFromInstancesConverter {

	private IFromInstancesConverter converter = new InstancesToCSVConverter();

	@Override
	public File parseFromInstances(Instances instances, String fileName)
			throws IOException {
		String csvFileName = fileName.split("\\.")[0] + ".csv";
		File csvFile = converter.parseFromInstances(instances, csvFileName);
		File xlsFile = parseCsvToXls(csvFile.getAbsolutePath());
		// csvFile.deleteOnExit();
		return xlsFile;
	}

	/**
	 * source: http://forgetcode.com/Java/1410-CSV-to-XLS-converter-Java
	 */
	private File parseCsvToXls(String fileName) throws IOException {
		ArrayList<ArrayList<String>> allRowAndColData = null;
		ArrayList<String> oneRowData = null;
		String currentLine;
		String path = fileName.split("\\.")[0] + ".xls";
		File file = new File(path);
		if (!file.exists()) {
			file.createNewFile();
		}
		FileInputStream fis = new FileInputStream(fileName);
		DataInputStream myInput = new DataInputStream(fis);
		int i = 0;
		allRowAndColData = new ArrayList<ArrayList<String>>();
		while ((currentLine = myInput.readLine()) != null) {
			oneRowData = new ArrayList<String>();
			String oneRowArray[] = currentLine.split(";");
			for (int j = 0; j < oneRowArray.length; j++) {
				oneRowData.add(oneRowArray[j]);
			}
			allRowAndColData.add(oneRowData);
			i++;
		}

		try {
			HSSFWorkbook workBook = new HSSFWorkbook();
			HSSFSheet sheet = workBook.createSheet("sheet");
			for (i = 0; i < allRowAndColData.size(); i++) {
				ArrayList<?> ardata = (ArrayList<?>) allRowAndColData.get(i);
				HSSFRow row = sheet.createRow((short) 0 + i);
				for (int k = 0; k < ardata.size(); k++) {
					HSSFCell cell = row.createCell((short) k);
					cell.setCellValue(ardata.get(k).toString());
				}
			}
			FileOutputStream fileOutputStream = new FileOutputStream(file);
			workBook.write(fileOutputStream);
			fileOutputStream.close();
		} catch (Exception ex) {
		}
		return file;
	}

}
