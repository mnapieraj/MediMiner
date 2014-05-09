package pl.put.poznan.cs.idss.siwoz.mediminer;

import java.awt.Desktop;
import java.net.BindException;
import java.net.URI;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ContextHandler;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;

import pl.put.poznan.cs.idss.siwoz.mediminer.handler.MainResourceHandler;
import pl.put.poznan.cs.idss.siwoz.mediminer.handler.RestHandler;

public class MainListener {

	private static int PORT_NUMBER = 8017;
	private static Logger LOGGER = Logger.getLogger(MainListener.class
			.toString());

	public static void main(String[] args) throws Exception {

		Server server = new Server(PORT_NUMBER);
		Desktop.getDesktop().browse(new URI("http://localhost:" + PORT_NUMBER));

		try {

			ContextHandler contextPage = new ContextHandler();
			contextPage.setContextPath("/");
			contextPage.setHandler(new MainResourceHandler());

			ContextHandler contextRest = new ContextHandler();
			contextRest.setContextPath("/rest");
			contextRest.setHandler(new RestHandler());

			ContextHandlerCollection contexts = new ContextHandlerCollection();
			contexts.setHandlers(new Handler[] { contextPage, contextRest });

			server.setHandler(contexts);

			server.start();
			server.join();

			LOGGER.log(Level.INFO, "New instance of server is ready.");

		} catch (BindException e) {

			LOGGER.log(Level.INFO, "Server is already running.");

		}

	}
}