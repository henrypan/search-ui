import 'styling/accessibility/_ScreenReader.scss';
import { $$ } from '../../utils/Dom';
import { QueryEvents, IQuerySuccessEventArgs, IQueryErrorEventArgs } from '../../events/QueryEvents';
import { QuerySummaryUtils } from '../../utils/QuerySummaryUtils';
import { l } from '../../strings/Strings';
import { OmniboxEvents } from '../../EventsModules';
import { IQuerySuggestSuccessArgs } from '../../events/OmniboxEvents';

export interface IAriaLive {
  updateText: (text: string) => void;
}

export class AriaLive implements IAriaLive {
  private ariaLiveEl: HTMLElement;
  private querySuggestions = 0;

  constructor(private root: HTMLElement) {
    this.initAriaLiveEl();
    this.appendToRoot();
    this.addQueryEventListeners();
  }

  public updateText(text: string) {
    const liveText = text === $$(this.ariaLiveEl).text() ? `${text}\u00A0` : text;
    $$(this.ariaLiveEl).text(liveText);
  }

  private appendToRoot() {
    this.root.appendChild(this.ariaLiveEl);
  }

  private initAriaLiveEl() {
    this.ariaLiveEl = $$('div', {
      'aria-live': 'polite',
      className: 'coveo-visible-to-screen-reader-only'
    }).el;
  }

  private addQueryEventListeners() {
    const root = $$(this.root);
    root.on(QueryEvents.duringQuery, () => this.onDuringQuery());
    root.on(QueryEvents.querySuccess, (e, args: IQuerySuccessEventArgs) => this.onQuerySuccess(args));
    root.on(QueryEvents.queryError, (e, args: IQueryErrorEventArgs) => this.onQueryError(args));
    root.on(OmniboxEvents.querySuggestSuccess, (e, args: IQuerySuggestSuccessArgs) =>
      args.completions.length ? (this.querySuggestions = args.completions.length) : this.onNoQuerySuggest()
    );
    root.on(OmniboxEvents.querySuggestRendered, () => this.onQuerySuggest());
  }

  private onDuringQuery() {
    const message = l('UpdatingResults');
    this.updateText(message);
  }

  private onQuerySuccess(args: IQuerySuccessEventArgs) {
    const message = this.messageForResultCount(args);
    this.updateText(message);
  }

  private onQuerySuggest() {
    const message = l('QuerySuggestionsAvailable', this.querySuggestions, this.querySuggestions);
    this.updateText(message);
  }

  private onNoQuerySuggest() {
    const message = l('QuerySuggestionsUnavailable');
    this.updateText(message);
  }

  private messageForResultCount(args: IQuerySuccessEventArgs) {
    const hasResults = args.results.results.length;

    if (hasResults) {
      return QuerySummaryUtils.message(this.root, args);
    }

    return this.noResultMessage(args.query.q);
  }

  private noResultMessage(query: string) {
    const noResultsMessage = l('noResultFor', '${query}');
    const sanitizedQuery = escape(query);
    return QuerySummaryUtils.replaceQueryTags(noResultsMessage, sanitizedQuery);
  }

  private onQueryError(args: IQueryErrorEventArgs) {
    const message = l('QueryException', args.error.message);
    this.updateText(message);
  }
}
