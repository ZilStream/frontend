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
	containerId: ChartingLibraryWidgetOptions['container_id'];
	theme: string;
}

export interface ChartContainerState {
}

function getLanguageFromURL(): LanguageCode | null {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode;
}

export default class TVChartContainer extends React.PureComponent<Partial<ChartContainerProps>, ChartContainerState> {
	public static defaultProps: ChartContainerProps = {
		symbol: 'AAPL',
		interval: 'D' as ResolutionString,
		containerId: 'tv_chart_container',
		datafeedUrl: 'https://demo_feed.tradingview.com',
		libraryPath: '/charting_library/',
		chartsStorageUrl: 'https://saveload.tradingview.com',
		chartsStorageApiVersion: '1.1',
		clientId: 'tradingview.com',
		userId: 'public_user_id',
		fullscreen: false,
		autosize: true,
		studiesOverrides: {},
		theme: 'Light'
	};

	private tvWidget: IChartingLibraryWidget | null = null;

	public componentDidMount(): void {
		const saveLoadAdapter = new SaveLoadAdapter()
		const widgetOptions: ChartingLibraryWidgetOptions = {
      debug: process.env.NODE_ENV === `development` ? true : false,
			symbol: this.props.symbol as string,
			// BEWARE: no trailing slash is expected in feed URL
			// tslint:disable-next-line:no-any
			datafeed: DataFeed as IBasicDataFeed,
			timeframe: '1M',
			interval: this.props.interval as ChartingLibraryWidgetOptions['interval'],
			container: this.props.containerId ?? '',
			library_path: this.props.libraryPath as string,
			locale: getLanguageFromURL() || 'en',
			disabled_features: ['create_volume_indicator_by_default', 'header_compare', 'popup_hints', 'go_to_date', 'display_market_status', 'header_symbol_search'],
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
				button.addEventListener('click', () => {
					const symbols = tvWidget.chart(0).symbol().split('/')
					const symbol = symbols[0].split(':')[1]
					const oldCurrency = symbols[1]
					const newCurrency = symbols[1] === 'ZIL' ? 'USD' : 'ZIL'
					tvWidget.setSymbol(symbol + '/' + newCurrency, tvWidget.chart(0).resolution(), () => {})
					button.innerHTML = 'Change to ' + oldCurrency
				})
				button.innerHTML = 'Change to USD';
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
				id={ this.props.containerId }
				className={ 'h-80 md:h-144 w-full' }
			/>
		);
	}
}