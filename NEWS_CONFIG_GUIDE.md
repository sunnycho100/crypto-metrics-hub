# Crypto News Configuration

This file (`crypto-news-terms.json`) allows you to customize which news articles appear in the Market Pulse card.

## How It Works

The news service searches for articles matching your configured terms and filters out unwanted content.

## Customizing Search Terms

### Adding Terms
Add any crypto-related keywords to the `searchTerms` array:

```json
{
  "searchTerms": [
    "Bitcoin",
    "BTC",
    "cryptocurrency",
    "Bitcoin ETF",        // ← Add new terms here
    "Bitcoin mining",
    "your custom term"
  ]
}
```

**Search Logic:** Terms are combined with OR logic, so articles matching ANY term will be included.

### Excluding Terms
Add keywords to `excludeTerms` to filter out unwanted articles:

```json
{
  "excludeTerms": [
    "altcoin",
    "Ethereum only",
    "NFT"              // ← Add terms to exclude
  ]
}
```

**Examples of what to exclude:**
- Other cryptocurrencies if you only want Bitcoin news
- Specific topics you're not interested in
- Spam or promotional keywords

## Changes Take Effect Automatically

The configuration is reloaded every time news is fetched (every 5 minutes or when you click refresh), so changes take effect without restarting the app.

## Tips

1. **Be Specific**: Use precise terms like "Bitcoin halving" instead of just "halving"
2. **Include Variations**: Add both "Bitcoin" and "BTC" to catch all articles
3. **Monitor Results**: Check the news feed and adjust terms based on relevance
4. **Case Insensitive**: Terms are matched case-insensitively, so "bitcoin" = "Bitcoin"

## Example Configurations

### Bitcoin Only (Strict)
```json
{
  "searchTerms": ["Bitcoin", "BTC"],
  "excludeTerms": ["Ethereum", "altcoin", "shitcoin", "memecoin"]
}
```

### Broad Crypto News
```json
{
  "searchTerms": [
    "Bitcoin", "BTC", "cryptocurrency", "crypto", "blockchain",
    "digital currency", "decentralized", "Web3"
  ],
  "excludeTerms": []
}
```

### Institutional/Regulatory Focus
```json
{
  "searchTerms": [
    "Bitcoin ETF", "Bitcoin regulation", "institutional Bitcoin",
    "Bitcoin SEC", "Bitcoin adoption", "Bitcoin legal"
  ],
  "excludeTerms": ["meme", "shitcoin"]
}
```
