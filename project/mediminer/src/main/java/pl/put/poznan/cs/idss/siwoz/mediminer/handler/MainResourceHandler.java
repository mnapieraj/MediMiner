package pl.put.poznan.cs.idss.siwoz.mediminer.handler;

import org.eclipse.jetty.server.handler.ResourceHandler;

public class MainResourceHandler extends ResourceHandler {

	public MainResourceHandler() {
		super();
		String path = "./src/main/resources";// for debug and development
		// purposes
		// String path = "jar:"
		// + new File(MainResourceHandler.class.getProtectionDomain()
		// .getCodeSource().getLocation().toString()) + "!/";
		this.setDirectoriesListed(true);
		this.setWelcomeFiles(new String[] { "main.html" });
		this.setResourceBase(path);
		System.err.println("Resource Base: " + this.getResourceBase());
	}

}