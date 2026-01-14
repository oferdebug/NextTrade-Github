import TradingViewWidget from "@/components/TradingViewWidget";
import {
    HEATMAP_WIDGET_CONFIG,
    MARKET_DATA_WIDGET_CONFIG,
    MARKET_OVERVIEW_WIDGET_CONFIG,
    TOP_STORIES_WIDGET_CONFIG
} from "@/lib/constants";

const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`

/**
 * Render the home page composed of TradingView widgets arranged in two responsive grid sections.
 *
 * Renders Market Overview and Stock Heatmap in the first row, and Top Stories (timeline) and Market Quotes in the second row, each inside a configurable TradingViewWidget.
 *
 * @returns The React element for the Home page containing the configured TradingView widgets.
 */
function Home() {
    return (
        <div className='flex flex-col gap-8 w-full'>
            <section className='grid w-full gap-8 home-section'>
                <div className='h-full md:col-span-1 xl:col-span-1'>
                    <TradingViewWidget
                        title={'Market Overview'}
                        scriptUrl={`${scriptUrl}market-overview.js`}
                        config={MARKET_OVERVIEW_WIDGET_CONFIG}
                        className={'custom-chart'}
                        height={600}
                    />
                </div>
                <div className={'h-full md:col-span-1 xl:col-span-2'}>
                    <TradingViewWidget
                        title={'Stock Heatmap'}
                        scriptUrl={`${scriptUrl}stock-heatmap.js`}
                        config={HEATMAP_WIDGET_CONFIG}
                        className={'custom-chart'}
                        height={600}
                    />
                </div>
            </section>
            <section className='grid w-full gap-8 home-section'>
                <div className='h-full md:col-span-1 xl:col-span-1'>
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}timeline.js`}
                        config={TOP_STORIES_WIDGET_CONFIG}
                        className={'custom-chart'}
                        height={600}
                    />
                </div>
                <div className={'h-full md:col-span-1 xl:col-span-2'}>
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}market-quotes.js`}
                        config={MARKET_DATA_WIDGET_CONFIG}
                        className={'custom-chart'}
                        height={600}
                    />
                </div>
            </section>
        </div>
    );
}

export default Home