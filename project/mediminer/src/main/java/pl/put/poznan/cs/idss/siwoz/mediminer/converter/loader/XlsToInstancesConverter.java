package pl.put.poznan.cs.idss.siwoz.mediminer.converter.loader;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Iterator;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;

import weka.core.Instances;

public class XlsToInstancesConverter implements IToInstancesConverter {

	private IToInstancesConverter converter = new CSVToInstancesConverter();

	@Override
	public Instances parseToInstances(String fileName) throws Exception {
		File csvFile = parseXlsToCsv(fileName);
		Instances instances = converter.parseToInstances(csvFile
				.getAbsolutePath());
		csvFile.delete();
		return instances;
	}

	/**
	 * source :
	 * http://www.simplecodestuffs.com/converting-xls-to-csv-files-using-java/
	 */
	private File parseXlsToCsv(String fileName) throws IOException {

		// For storing data into CSV files
		StringBuffer data = new StringBuffer();
		String path  = fileName.split("\\.")[0] +  ".csv";
	//	System.out.println(path);
		File csvFile = new File(path);
		
		if (!csvFile.exists()) {
			csvFile.createNewFile();
		}
		FileOutputStream fos = new FileOutputStream(csvFile);

		// Get the workbook object for XLS file
		HSSFWorkbook workbook = new HSSFWorkbook(new FileInputStream(fileName));
		// Get first sheet from the workbook
		HSSFSheet sheet = workbook.getSheetAt(0);
		Cell cell;
		Row row;

		// Iterate through each rows from first sheet
		Iterator<Row> rowIterator = sheet.iterator();
		while (rowIterator.hasNext()) {
			row = rowIterator.next();
			// For each row, iterate through each columns
			Iterator<Cell> cellIterator = row.cellIterator();
			String separator = "";
			while (cellIterator.hasNext()) {
				data.append(separator);
				separator = ",";
				cell = cellIterator.next();

				switch (cell.getCellType()) {
				case Cell.CELL_TYPE_BOOLEAN:
					data.append(cell.getBooleanCellValue());
					break;

				case Cell.CELL_TYPE_NUMERIC:
					data.append(cell.getNumericCellValue());
					break;

				case Cell.CELL_TYPE_STRING:
					data.append(cell.getStringCellValue());
					break;

				case Cell.CELL_TYPE_BLANK:
					data.append("");
					break;

				default:
					data.append(cell);
				}
				
			}
			data.append('\n');
		}

		fos.write(data.toString().getBytes());
		fos.close();
		return csvFile;
	}
}
