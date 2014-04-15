package pl.put.poznan.cs.idss.siwoz.mediminer.converter.saver;

import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
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
		File csvFile = converter.parseFromInstances(instances, fileName);
		File xlsFile = parseCsvToXls(csvFile.getAbsolutePath());
		return xlsFile;
	}

	/**
	 * source: http://forgetcode.com/Java/1410-CSV-to-XLS-converter-Java
	 */
	private File parseCsvToXls(String fileName) throws IOException {
		ArrayList arList = null;
		ArrayList al = null;
		String thisLine;
		int count = 0;
		
		File file = new File(fileName);

		if (!file.exists()) {
			file.createNewFile();
		}
		
		FileInputStream fis = new FileInputStream(file);
		DataInputStream myInput = new DataInputStream(fis);
		int i = 0;
		arList = new ArrayList();
		while ((thisLine = myInput.readLine()) != null) {
			al = new ArrayList();
			String strar[] = thisLine.split(",");
			for (int j = 0; j < strar.length; j++) {
				al.add(strar[j]);
			}
			arList.add(al);
			i++;
		}

		try {
			HSSFWorkbook hwb = new HSSFWorkbook();
			HSSFSheet sheet = hwb.createSheet("new sheet");
			for (int k = 0; k < arList.size(); k++) {
				ArrayList ardata = (ArrayList) arList.get(k);
				HSSFRow row = sheet.createRow((short) 0 + k);
				for (int p = 0; p < ardata.size(); p++) {
					HSSFCell cell = row.createCell((short) p);
					String data = ardata.get(p).toString();
					if (data.startsWith("=")) {
						cell.setCellType(Cell.CELL_TYPE_STRING);
						data = data.replaceAll("\"", "");
						data = data.replaceAll("=", "");
						cell.setCellValue(data);
					} else if (data.startsWith("\"")) {
						data = data.replaceAll("\"", "");
						cell.setCellType(Cell.CELL_TYPE_STRING);
						cell.setCellValue(data);
					} else {
						data = data.replaceAll("\"", "");
						cell.setCellType(Cell.CELL_TYPE_NUMERIC);
						cell.setCellValue(data);
					}
					// */
					// cell.setCellValue(ardata.get(p).toString());
				}
			}
			FileOutputStream fileOut = new FileOutputStream("test.xls");
			hwb.write(fileOut);
			fileOut.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return file;
	}

}
