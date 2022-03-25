import * as React from 'react';
import {
	widget,
	ChartingLibraryWidgetOptions,
	LanguageCode,
	IChartingLibraryWidget,
	ResolutionString,
  IBasicDataFeed,
} from '../../../public/charting_library';
import DataFeed from './api'
import { SaveLoadAdapter } from './saveLoadAdapter';

export interface ChartContainerProps {
	symbol: ChartingLibraryWidgetOptions['symbol'];
	interval: ChartingLibraryWidgetOptions['interval'];

	// BEWARE: no trailing slash is expected in feed URL
	datafeedUrl: string;
	libraryPath: ChartingLibraryWidgetOptions['library_path'];
	chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'];
	chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'];
	clientId: ChartingLibraryWidgetOptions['client_id'];
	userId: ChartingLibraryWidgetOptions['user_id'];
	fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
	autosize: ChartingLibraryWidgetOptions['autosize'];
	studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides'];
	theme: string;
}

export interface ChartContainerState {
}

export default class TVChartContainer extends React.PureComponent<Partial<ChartContainerProps>, ChartContainerState> {
	public static defaultProps: Omit<ChartContainerProps, 'container'> = {
		symbol: 'ZIL',
		interval: 'D' as ResolutionString,
		datafeedUrl: '',
		libraryPath: '/charting_library/',
		chartsStorageUrl: '',
		chartsStorageApiVersion: '1.1',
		clientId: '',
		userId: 'public_user_id',
		fullscreen: false,
		autosize: true,
		studiesOverrides: {},
		theme: 'Light'
	};

	private tvWidget: IChartingLibraryWidget | null = null;
	private ref: React.RefObject<HTMLDivElement> = React.createRef();

	public componentDidMount(): void {
		const saveLoadAdapter = new SaveLoadAdapter()
		const widgetOptions: ChartingLibraryWidgetOptions = {
      // debug: true,
			symbol: this.props.symbol as string,
			// BEWARE: no trailing slash is expected in feed URL
			// tslint:disable-next-line:no-any
			datafeed: DataFeed as IBasicDataFeed,
			interval: this.props.interval as ChartingLibraryWidgetOptions['interval'],
			container: this.ref.current ?? '',
			library_path: this.props.libraryPath as string,
			locale: 'en',
			disabled_features: ['header_compare', 'popup_hints', 'go_to_date', 'display_market_status', 'header_symbol_search'],
			enabled_features: ['side_toolbar_in_fullscreen_mode', 'header_in_fullscreen_mode', 'use_localstorage_for_settings'],
			save_load_adapter: saveLoadAdapter,
			auto_save_delay: 3,
			load_last_chart: true,
			client_id: this.props.clientId,
			user_id: this.props.userId,
			fullscreen: this.props.fullscreen,
			autosize: true,
			studies_overrides: this.props.studiesOverrides,
			theme: this.props.theme === 'dark' ? 'Dark' : 'Light',
		};

		const tvWidget = new widget(widgetOptions);
		this.tvWidget = tvWidget;

		tvWidget.onChartReady(() => {
			tvWidget.headerReady().then(() => {
				const button = tvWidget.createButton();
				button.setAttribute('title', 'Click to switch between ZIL and USD');
				button.classList.add('apply-common-tooltip');
				button.innerHTML = 'Change to price in ZIL';
				button.addEventListener('click', () => {
					let symbol = tvWidget.chart(0).symbolExt().full_name
					let current = symbol.substr(symbol.length - 3)

					if(current === 'USD') {
						tvWidget.setSymbol(symbol.slice(0,-3) + 'ZIL', tvWidget.chart(0).resolution(), () => {})
						button.innerHTML = 'Change to price in USD';
					} else {
						tvWidget.setSymbol(symbol.slice(0,-3) + 'USD', tvWidget.chart(0).resolution(), () => {})
						button.innerHTML = 'Change to price in ZIL';
					}
				})
			})

			tvWidget.subscribe('onAutoSaveNeeded', function() {
				tvWidget.saveChartToServer()
			})
		})
	}

	public componentWillUnmount(): void {
		if (this.tvWidget !== null) {
			this.tvWidget.remove();
			this.tvWidget = null;
		}
	}

	public componentDidUpdate(): void {
		this.tvWidget?.changeTheme(this.props.theme === 'dark' ? 'Dark' : 'Light')
	}

	public render(): JSX.Element {
		return (
			<div
				ref={this.ref}
				className={ 'h-80 md:h-144 w-full' }
			/>
		);
	}
}