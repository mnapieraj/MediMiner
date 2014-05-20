var Tooltips =
		(function() {
			return {
				init : function() {
					$(document).tooltip({
						show : {
							delay : 1000,
						}
					});
					$("#selectAttr").attr('title', Hints.selectAttributesTxt);
					$("#discretize").attr('title', Hints.discretizeTxt);
					$("#normalize").attr('title', Hints.normalizeTxt);
					
					$("#naiveBayes").attr('title', Hints.naiveBayesTxt);
					$("#estimateKernel").attr('title', Hints.estimateKernelTxt);
					
					$("#j48").attr('title', Hints.j48Txt);
					$("#confidenceLevel").attr('title', Hints.confidenceLevelTxt);
					
					$("#ibk").attr('title', Hints.ibkTxt);
					$("#neighbours").attr('title', Hints.neighboursTxt);
					
					$("#dtnb").attr('title', Hints.dtnbTxt);
					$("#evaluationMeasure").attr('title', Hints.evaluationMeasureTxt);
					
				}
			}
})();

var Hints =
		(function() {
			return {
				selectAttributesTxt : "Feature selection can shorten a time needed in model construction. Also, it is possible that some attributes are irrelevant and may weaken model's generalisation. Reducing number of attributes makes data much easier to summarize.",
				discretizeTxt : "Discretization of attribute is a process of putting values into buckets so that there are limited number of possible states; it makes data easier to summarize.",
				normalizeTxt : "Normalization indicates transforming all values  in dataset so that the minimum value of given attribute is equal to 0 and the maximum value is equal to 1. It ensures that all features have the same weight (are equally important) and are easier to compare with one another.",
				
				naiveBayesTxt : "The Naive Bayes classifier is the most effective when the features are independent of one another within each class. It is particulary effective for datasets containing many features.",
				estimateKernelTxt : "Estimating kernel is appropiate for features that have continues distribution; if they have normal distribution, this option should be turned off.",
				
				j48Txt : "J48 is an algorithm used to generate a decision tree. It handles missing values and both continuous and discrete attributes.",
				confidenceLevelTxt : "Confidence factor is related to reducing the size of the decision tree. It will reduce the accuracy on the training data, but increase the accuracy on new data. The smaller the confidence factor the smaller accuracy on training data and the smaller size of the decision tree.",
				
				ibkTxt : "In IBk classification an object is assigned to the class most common among its k nearest neighbours (by majority vote), where k is an algorithm's parameter."	,
				neighboursTxt : "The best choice of neighbours depends upon the data; generally, larger values reduce the effect of noise on the classification, but make boundaries between classes less distinct.",
				
				dtnbTxt : "DTNB approach is using a decision table/naive bayes hybrid classifier. At each point in the search, the algorithm evaluates the merit of dividing the attributes into two disjoint subsets: one for the decision table, the other for naive Bayes. Thin can result in more powerful models than just naive Bayes, but also increases a time needed in model construction.",
				evaluationMeasureTxt : "Performance evaluation measures to use for selecting attributes:  RMSE (of the class probabilities fot discrete class), MAE (of the class probabilities fot discrete class), AUC (area under the ROC curve - discrete class only)."
			}
})();