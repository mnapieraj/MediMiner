package pl.put.poznan.cs.idss.siwoz.mediminer.handler;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.MultipartConfigElement;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.eclipse.jetty.server.Request;
import org.eclipse.jetty.server.handler.AbstractHandler;

import pl.put.poznan.cs.idss.siwoz.mediminer.converter.loader.ArffToInstancesConverter;
import pl.put.poznan.cs.idss.siwoz.mediminer.converter.loader.CSVToInstancesConverter;
import pl.put.poznan.cs.idss.siwoz.mediminer.converter.loader.IToInstancesConverter;
import pl.put.poznan.cs.idss.siwoz.mediminer.converter.loader.XlsToInstancesConverter;
import pl.put.poznan.cs.idss.siwoz.mediminer.converter.saver.IFromInstancesConverter;
import pl.put.poznan.cs.idss.siwoz.mediminer.converter.saver.InstancesToArffConverter;
import pl.put.poznan.cs.idss.siwoz.mediminer.converter.saver.InstancesToCSVConverter;
import pl.put.poznan.cs.idss.siwoz.mediminer.converter.saver.InstancesToXlsConverter;
import weka.core.Attribute;
import weka.core.Instance;
import weka.core.Instances;

import com.google.gson.ExclusionStrategy;
import com.google.gson.FieldAttributes;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Handler obsługujący żądania RESTowe z aplikacji. Zapisuje dane z przeglądarki
 * do pliku tekstowego oraz odczytuje takowe dane.
 * 
 * @author Kornel Lewandowski
 * 
 * @date 4 sty 2014 10:56:55
 * 
 */
public class RestHandler extends AbstractHandler {

	private static Logger LOGGER = Logger.getLogger(RestHandler.class
			.toString());

	public static String KEY = Double
			.toString(Math.round(Math.random() * 100000));

	private static final MultipartConfigElement MULTI_PART_CONFIG = new MultipartConfigElement(
			System.getProperty("user.dir"));

	private String currentDataFileName = null;
	private String currentModelFileName = null;
	private Instances instancesContainer = null;

	public void handle(String target, Request baseRequest,
			HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {

		Map<String, String[]> params = request.getParameterMap();

		if (request.getContentType() != null
				&& request.getContentType().startsWith("multipart/form-data")) {
			baseRequest.setAttribute(Request.__MULTIPART_CONFIG_ELEMENT,
					MULTI_PART_CONFIG);
			request.setAttribute(Request.__MULTIPART_CONFIG_ELEMENT,
					MULTI_PART_CONFIG);

		}

		if (params.containsKey("action")) {

			String action = params.get("action")[0];

			if (action.equals("import-file")) {
				importFile(request, response, params, action);
			}

			else if (action.equals("send-key")) {
				sendKey(request, response, params);

			} else if (action.equals("get-attributes")) {

				getAttributes(request, response);

			} else if (action.equals("get-instances")) {

				getInstances(request, response);

			} else if (action.equals("export-arff")) {

				exportArff(request, response);

			} else if (action.equals("export-xls")) {

				exportXls(request, response);

			} else if (action.equals("export-csv")) {

				exportCsv(request, response);

			} else {

				returnError(request, response, params, "Action not supported!");

			}

		} else {
			returnError(request, response, params, "Action not selected!");

		}

	}

	private void getInstances(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		if (instancesContainer != null) {
			response.setContentType("text/plain; charset=UTF-8");
			List<Instance> instances = new ArrayList<>();
			for (int i = 0; i < instancesContainer.numInstances(); i++) {
				instances.add(instancesContainer.instance(i));
			}
			Gson gson = new GsonBuilder().serializeSpecialFloatingPointValues()
					.addSerializationExclusionStrategy(new ExclusionStrategy() {

						@Override
						public boolean shouldSkipField(FieldAttributes field) {
							return field.getName().equals("m_Dataset");
						}

						@Override
						public boolean shouldSkipClass(Class<?> clazz) {
							return clazz == Instances.class;
						}
					}).create();
			String gsonResponse = gson.toJson(instances);
			gsonResponse = gsonResponse.replace("Infinity", "99999999.999");
			gsonResponse = gsonResponse.replace("NaN", "0.00");
			response.getWriter().println(gsonResponse);
			((Request) request).setHandled(true);
		} else {
			response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
			((Request) request).setHandled(true);
		}
	}

	private void getAttributes(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		if (instancesContainer != null) {
			response.setContentType("text/plain; charset=UTF-8");
			List<Attribute> attributes = new ArrayList<>();
			for (int i = 0; i < instancesContainer.numAttributes(); i++) {
				attributes.add(instancesContainer.attribute(i));
			}
			Gson gson = new GsonBuilder().serializeSpecialFloatingPointValues()
					.create();
			String gsonResponse = gson.toJson(attributes);
			gsonResponse = gsonResponse.replace("Infinity", "99999999.999");
			gsonResponse = gsonResponse.replace("NaN", "0.00");
			response.getWriter().println(gsonResponse);
			((Request) request).setHandled(true);
		} else {
			response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
			((Request) request).setHandled(true);
		}
	}

	private void returnError(HttpServletRequest request,
			HttpServletResponse response, Map<String, String[]> params,
			final String message) {

		LOGGER.log(Level.SEVERE, "ERROR: " + message);

		try {
			response.setContentType("text/plain");
			response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
			response.getWriter().println(message);
		} catch (Exception e) {
			response.setContentType("text/plain");
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}

		((Request) request).setHandled(true);

	}

	private void sendKey(HttpServletRequest request,
			HttpServletResponse response, Map<String, String[]> params) {
		try {
			response.getWriter().println(KEY);
		} catch (IOException e) {
			response.setContentType("text/plain");
			response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
			((Request) request).setHandled(true);
		}

		((Request) request).setHandled(true);
	}

	private void exportArff(HttpServletRequest request,
			HttpServletResponse response) {

		String filePath = "";

		try {

			if (instancesContainer == null) {
				throw new Exception("There is not file loaded");
			}

			IFromInstancesConverter arffConverter = new InstancesToArffConverter();
			Date now = new Date();
			filePath = "MediMiner_"
					+ new SimpleDateFormat("dd-MM-yyyy_HH-mm-ss").format(now)
					+ ".arff";
			arffConverter.parseFromInstances(instancesContainer, filePath);
			response.getWriter().println(filePath);
		} catch (Exception e) {
			response.setContentType("text/plain");
			response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
			((Request) request).setHandled(true);
		}

		((Request) request).setHandled(true);
	}

	private void exportCsv(HttpServletRequest request,
			HttpServletResponse response) {

		String filePath = "";

		try {

			if (instancesContainer == null) {
				throw new Exception("There is not file loaded");
			}

			IFromInstancesConverter csvConverter = new InstancesToCSVConverter();
			Date now = new Date();
			filePath = "MediMiner_"
					+ new SimpleDateFormat("dd-MM-yyyy_HH-mm-ss").format(now)
					+ ".csv";
			csvConverter.parseFromInstances(instancesContainer, filePath);
			response.getWriter().println(filePath);
		} catch (Exception e) {
			response.setContentType("text/plain");
			response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
			((Request) request).setHandled(true);
		}

		((Request) request).setHandled(true);
	}

	private void exportXls(HttpServletRequest request,
			HttpServletResponse response) {

		String filePath = "";

		try {

			if (instancesContainer == null) {
				throw new Exception("There is not file loaded");
			}

			IFromInstancesConverter xlsConverter = new InstancesToXlsConverter();
			Date now = new Date();
			filePath = "MediMiner_"
					+ new SimpleDateFormat("dd-MM-yyyy_HH-mm-ss").format(now)
					+ ".xls";
			xlsConverter.parseFromInstances(instancesContainer, filePath);
			response.getWriter().println(filePath);
		} catch (Exception e) {
			response.setContentType("text/plain");
			response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
			((Request) request).setHandled(true);
		}

		((Request) request).setHandled(true);
	}

	// private void openFile(HttpServletRequest request,
	// HttpServletResponse response, Map<String, String[]> params,
	// String action) {
	//
	// }

	private void importFile(HttpServletRequest request,
			HttpServletResponse response, Map<String, String[]> params,
			String action) throws IOException {

		try {

			for (Part part : request.getParts()) {

				String FILE_NAME = "TMP_" + KEY + "_"
						+ part.getSubmittedFileName();
				part.write(FILE_NAME);

				currentDataFileName = FILE_NAME;

			}

			if (currentDataFileName.endsWith("xls")
					|| currentDataFileName.endsWith("XLS")) {
				IToInstancesConverter xlsConverter = new XlsToInstancesConverter();
				instancesContainer = xlsConverter
						.parseToInstances(currentDataFileName);

			} else if (currentDataFileName.endsWith("csv")
					|| currentDataFileName.endsWith("CSV")) {
				IToInstancesConverter csvConverter = new CSVToInstancesConverter();
				instancesContainer = csvConverter
						.parseToInstances(currentDataFileName);

			} else if (currentDataFileName.endsWith("arff")
					|| currentDataFileName.endsWith("ARFF")) {
				IToInstancesConverter arffConverter = new ArffToInstancesConverter();
				instancesContainer = arffConverter
						.parseToInstances(currentDataFileName);

			} else {
				throw new Exception(
						"This file extension is not supported. Try to import CSV, XLS or ARFF file.");
			}

			response.setContentType("text/plain");
			response.setStatus(HttpServletResponse.SC_FOUND);
			response.sendRedirect("../");

		} catch (Exception e) {
			response.setContentType("text/plain");
			response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
			response.getWriter().println(e.getMessage());
			response.sendRedirect("../?error=import-error");
		}

		((Request) request).setHandled(true);

	}

}