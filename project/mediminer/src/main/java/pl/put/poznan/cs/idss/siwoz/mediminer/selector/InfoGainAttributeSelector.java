package pl.put.poznan.cs.idss.siwoz.mediminer.selector;

import java.util.Arrays;

import weka.attributeSelection.AttributeSelection;
import weka.attributeSelection.InfoGainAttributeEval;
import weka.attributeSelection.Ranker;
import weka.core.Instances;

public class InfoGainAttributeSelector implements IAttributeSelector {

	public double[][] selectAttributes(Instances instances, int attributesNo) throws Exception {
		AttributeSelection attSelection = new AttributeSelection();
		attSelection.setEvaluator(new InfoGainAttributeEval());
		
		Ranker rank = new Ranker();
		rank.setNumToSelect(attributesNo);
		
		attSelection.setSearch(rank);
		attSelection.SelectAttributes(instances);
		double[][] rankedAttributes = attSelection.rankedAttributes();
		double[][] result = Arrays.copyOfRange(rankedAttributes, 0, attributesNo);
		return result;
	}
	
}
