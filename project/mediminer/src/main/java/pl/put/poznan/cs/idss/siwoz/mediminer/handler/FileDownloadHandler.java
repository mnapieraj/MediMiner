package pl.put.poznan.cs.idss.siwoz.mediminer.handler;

import org.eclipse.jetty.server.handler.ResourceHandler;

public class FileDownloadHandler extends ResourceHandler {

	public FileDownloadHandler() {
		super();
		String path = ".";
		this.setDirectoriesListed(true);
		this.setWelcomeFiles(new String[] { "" });
		this.setResourceBase(path);
	}

}