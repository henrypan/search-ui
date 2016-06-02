import {IQueryFunction} from './QueryFunction';
import {IRankingFunction} from './RankingFunction';
import {IGroupByRequest} from './GroupByRequest';

/**
 * Describe a query that can be performed on the Coveo Search API.<br/>
 * For basic usage, see the {@link IQuery.q} and {@link IQuery.aq} properties.<br/>
 * In a normal scenario, a query is built using the {@link QueryBuilder}
 */
export interface IQuery {
  /**
   * The basic query expression. <br/>
   * This is typically the query expression entered by the user in a query box.<br/>
   * Since this part of the query is expected to come from user input, it is processed by the Did You Mean feature.
   */
  q: string;
  /**
   * The advanced query expression.<br/>
   * This is the part of the query expression generated by code based on various rules.<br/>
   * eg: Selecting a facet value will cause an expression to be added to the advanced query expression.
   */
  aq?: string;
  /**
   * The constant query expression.<br/>
   * This part of the expression is much alike the advanced query expression, but it is meant to hold expressions that are constant for all users of a search interface/widget.<br/>
   * The results of evaluating those expressions are kept in a special index cache, to avoid re-evaluating them on each query.<br/>
   * You must be careful to not include dynamic parts in this expression, otherwise you risk filling up the cache with useless data and this might have a negative impact on performance.<br/>
   * Expressions other than cq also benefit from caching in the index, but using cq allows to explicitly require that a part of the query be included in the cache.
   */
  cq?: string;
  /**
   * The disjunction query expression.<br/>
   * This is the disjunctive part of the query expression that is merged with the other expression parts using an OR boolean operator.<br/>
   * When specified, the final expression evaluated by the index ends up being (q aq cq) OR (dq).
   */
  dq?: string;
  /**
   * The hub value set from the {@link Analytics} component.<br/>
   * Used for analytics reporting in the Coveo platform
   */
  searchHub?: string;
  /**
   * The tab value set from the {@link Tab} component.
   */
  tab?: string;
  language?: string;
  /**
   * Name of the query pipeline to use.<br/>
   * This specifies the name of the query pipeline to use for the query. If not specified, the default value is default, which means the default query pipeline will be used.
   */
  pipeline?: string;
  /**
   * The maximum age for cached query results, in milliseconds.<br/>
   * If results for the exact same request (including user identities) are available in the in-memory cache, they will be used if they are not older than the specified value.<br/>
   * Otherwise, the query will be sent to the index.
   */
  maximumAge?: number;
  /**
   * Whether to enable wildcards on the basic expression keywords.<br/>
   * This enables the wildcard features of the index. Coveo Platform will expand keywords containing wildcard characters to the possible matching keywords to broaden the query.<br/>
   * See : https://onlinehelp.coveo.com/en/ces/7.0/user/using_wildcards_in_queries.htm<br/>
   * If not specified, this parameter defaults to false.
   */
  wildcards?: boolean;
  /**
   * Whether to enable question marks with wildcards.<br/>
   * This enables using the question mark ? character within wildcard expressions.
   */
  questionMark?: boolean;
  /**
   * Whether to enable the support for operator in lowercase (AND OR -> and or)
   */
  lowercaseOperators?: boolean;
  /**
   * Whether to enable partial matching of the basic expression keywords.<br/>
   * By activating this, when the basic expression contains at least {@link IQuery.partialMatchKeywords}, documents containing only the number of keywords specified by {@link IQuery.partialMatchThreshold} will also match the query.<br/>
   * Without this option, documents are required to contain all the keywords in order to match the query.<br/>
   * If not specified, this parameter defaults to false.
   */
  partialMatch?: boolean;
  /**
   * The minimum number of keywords needed to activate partial match.<br/>
   * This specifies the minimum number of keywords needed for the partial match feature to activate.<br/>
   * If the basic expression contains less than this number of keywords, no transformation is applied on the query.<br/>
   * If not specified, this parameter defaults to 5.
   */
  partialMatchKeywords?: number;
  /**
   * The threshold to use for matching documents when partial match is enabled.<br/>
   * This specifies the minimum number of query keywords that a document must contain when partial match is enabled. This value can either be an absolute number or a percentage value based on the total number of keywords.<br/>
   * If not specified, this parameter defaults to 50%.
   */
  partialMatchThreshold?: string;
  /**
   * This is the 0-based index of the first result to return.<br/>
   * If not specified, this parameter defaults to 0.
   */
  firstResult?: number;
  /**
   * This is the number of results to return, starting from {@link IQuery.firstResult}.<br/>
   * If not specified, this parameter defaults to 10.
   */
  numberOfResults?: number;
  /**
   * This specifies the sort criterion(s) to use to sort results. If not specified, this parameter defaults to Relevancy.<br/>
   * Possible values are : <br/>
   * -- relevancy :  This uses all the configured ranking weights as well as any specified ranking expressions to rank results.<br/>
   * -- dateascending / datedescending : Sort using the value of the @date field, which is typically the last modification date of an item in the index.<br/>
   * -- qre : Sort using only the weights applied through ranking expressions. This is much like using Relevancy except that automatic weights based on keyword proximity etc, are not computed.<br/>
   * -- nosort : Do not sort the results. The order in which items are returned is essentially random.<br/>
   * -- @field ascending / @field descending : Sort using the value of a custom field.
   */
  sortCriteria?: string;
  sortField?: string;
  /**
   * This specifies a field on which {@link Folding} should be performed.<br/>
   * Folding is a kind of duplicate filtering where only the first result with any given value of the field is included in the result set.<br/>
   * It's typically used to return only one result in a conversation, for example when forum posts in a thread are indexed as separate items.
   */
  filterField?: string;
  /**
   * Number of results that should be folded, using the {@link IQuery.filterField}
   */
  filterFieldRange?: number;
  /**
   * This specifies an array of fields that should be returned for each result.<br/>
   * eg: ['@foo','@bar']
   *
   */
  fieldsToInclude?: string[];
  /**
   * This specifies an array of fields that should be excluded from the query results.<br/>
   * eg: ['@foo','@bar']
   *
   */
  fieldsToExclude?: string[];
  /**
   * This specifies the length (in number of characters) of the excerpts generated by the indexer based on the keywords present in the query.<br/>
   * The index includes the top most interesting sentences (in the order they appear in the document) that fit in the specified number of characters.<br/>
   * When not specified, the default value is 200.
   */
  excerptLength?: number;
  /**
   * This specifies whether the first sentences of the document should be included in the results.<br/>
   * The retrieveFirstSentences option is typically used instead of excerpts when displaying email items, where the first sentence of the email might be of more interest than a contextually generated excerpt.
   */
  retrieveFirstSentences?: boolean;
  /**
   * This enables the query correction feature of the index.<br/>
   * By activating this, the index returns an array of {link IQueryCorrection} with suggested word corrections.
   */
  enableDidYouMean?: boolean;
  /**
   * This specifies an array of Query Function operation that will be executed on the results.
   */
  queryFunctions?: IQueryFunction[];
  /**
   * This specifies an array of Ranking Function operations that will be executed on the result
   */
  rankingFunctions?: IRankingFunction[];
  /**
   * This specifies an array of Group By operations that can be performed on the query results to extract facets
   */
  groupBy?: IGroupByRequest[];
  debug?: boolean;
  timezone?: string;
  /**
   * Whether to disable the special query syntax such as field references for the basic query expression (parameter q).
   * It is equivalent to a No syntax block applied to the basic query expression.
   * If not specified, the parameter defaults to false
   */
  disableQuerySyntax?: boolean;
  enableDuplicateFiltering?: boolean;
  /**
   * Whether the index should take collaborative rating in account when ranking result. See : {@link ResultRating}
   */
  enableCollaborativeRating?: boolean;
  /**
   * Specifies the childField when doing parent-child loading (See : {@link Folding})
   */
  childField?: string;
  /**
   * Specifies the parentField when doing parent-child loading (See : {@link Folding})
   */
  parentField?: string;
  /**
   * The context is a map of key_value that can be used in the Query pipeline in the Coveo platform.<br/>
   */
  context?: { [name: string]: any }
}
