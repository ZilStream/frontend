export enum Metric {
  Price = 0,
  PriceZIL,
  // MarketCap,
  // Liquidity
}

export function labelForMetric(metric: Metric): string {
  switch (metric) {
    case Metric.Price:
      return "Price (USD)"

    case Metric.PriceZIL:
      return "Price (ZIL)"

    // case Metric.MarketCap:
    //   return "Market Cap"

    // case Metric.Liquidity:
    //   return "Liquidity"
  }
}

export enum Indicator {
  Above = 0,
  Below
}

export function labelForIndicator(indicator: Indicator): string {
  switch (indicator) {
    case Indicator.Above:
      return "Above"
    
    case Indicator.Below:
      return "Below"
  }
}