package pl.put.poznan.cs.idss.siwoz.mediminer.handler;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.server.Request;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.AbstractHandler;

/**
 * Po wywołaniu zabija proces serwera i usuwa pliki tymczasowe
 * 
 * @author Kornel Lewandowski
 * 
 * @date 4 sty 2014 10:56:55
 * 
 */
public class CloseHandler extends AbstractHandler {

	private Server server;

	public CloseHandler(Server server) {
		this.server = server;
	}

	public void handle(String target, Request baseRequest,
			HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {

		try {
			this.deleteFiles();
			response.getWriter().println("Application closed");
			System.exit(0);
		} catch (Exception e) {
			response.setContentType("text/plain");
			response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
			((Request) request).setHandled(true);
		}

		((Request) request).setHandled(true);

	}

	public void deleteFiles() {

		ExtensionFilter filter = new ExtensionFilter();
		File dir = new File(".");

		String[] list = dir.list(filter);

		if (list.length == 0)
			return;

		File fileDelete;

		for (String file : list) {
			String temp = (file.toString());
			fileDelete = new File(temp);
			boolean isdeleted = fileDelete.delete();
			System.out.println("file : " + temp + " is deleted : " + isdeleted);
		}
	}

	public class ExtensionFilter implements FilenameFilter {

		public boolean accept(File dir, String name) {
			return (name.endsWith("csv") || name.endsWith("CSV")
					|| name.endsWith("xls") || name.endsWith("XLS")
					|| name.endsWith("arff") || name.endsWith("ARFF"));
		}
	}

}