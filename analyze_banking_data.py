import pandas as pd
import numpy as np

# Read the CSV data
df = pd.read_csv('/mnt/c/Users/dany2/Downloads/wells-fargo-social-insights-main/public/banking-social-data.csv')

# Convert Month to datetime for proper sorting
df['Month_Date'] = pd.to_datetime(df['Month'], format='%B %Y')

# Get unique banks
banks = df['Bank'].unique()

print('=== BANKING SOCIAL DATA ANALYSIS ===\n')

bank_insights = {}

for bank in banks:
    print(f'\n--- {bank} ---')
    bank_data = df[df['Bank'] == bank]
    
    # Total spending by year
    yearly_totals = bank_data.groupby('Year')['dollars'].sum()
    print(f'Total spending by year: {yearly_totals.to_dict()}')
    
    # Platform distribution
    platform_totals = bank_data.groupby('Distributor')['dollars'].sum().sort_values(ascending=False)
    print(f'Platform spending distribution: {platform_totals.to_dict()}')
    
    # Monthly spending for trend analysis
    monthly_totals = bank_data.groupby(['Year', 'Month'])['dollars'].sum().reset_index()
    monthly_totals['Month_Date'] = pd.to_datetime(monthly_totals['Month'], format='%B %Y')
    monthly_totals = monthly_totals.sort_values('Month_Date')
    
    # Peak months by year
    peak_months = {}
    for year in [2023, 2024, 2025]:
        year_data = monthly_totals[monthly_totals['Year'] == year]
        if not year_data.empty:
            peak_month = year_data.loc[year_data['dollars'].idxmax()]
            peak_months[year] = {'month': peak_month['Month'], 'amount': peak_month['dollars']}
            print(f'Peak month {year}: {peak_month["Month"]} with ${peak_month["dollars"]:,.0f}')
    
    # Year-over-year growth
    yoy_growth = {}
    if 2023 in yearly_totals.index and 2024 in yearly_totals.index:
        growth_2023_2024 = ((yearly_totals[2024] - yearly_totals[2023]) / yearly_totals[2023]) * 100
        yoy_growth['2023_2024'] = growth_2023_2024
        print(f'YoY growth 2023-2024: {growth_2023_2024:.1f}%')
    
    if 2024 in yearly_totals.index and 2025 in yearly_totals.index:
        # For 2025, we need to adjust for partial year data
        months_2025 = bank_data[bank_data['Year'] == 2025]['Month'].nunique()
        months_2024 = bank_data[bank_data['Year'] == 2024]['Month'].nunique()
        
        if months_2025 > 0:
            # Calculate average monthly spend for comparison
            avg_monthly_2024 = yearly_totals[2024] / months_2024
            avg_monthly_2025 = yearly_totals[2025] / months_2025
            growth_2024_2025 = ((avg_monthly_2025 - avg_monthly_2024) / avg_monthly_2024) * 100
            yoy_growth['2024_2025'] = growth_2024_2025
            print(f'YoY growth 2024-2025 (monthly avg): {growth_2024_2025:.1f}%')
    
    # Platform analysis by year
    platform_by_year = {}
    for year in [2023, 2024, 2025]:
        year_data = bank_data[bank_data['Year'] == year]
        if not year_data.empty:
            platform_year = year_data.groupby('Distributor')['dollars'].sum().sort_values(ascending=False)
            platform_by_year[year] = platform_year.to_dict()
    
    # Store insights for this bank
    bank_insights[bank] = {
        'yearly_totals': yearly_totals.to_dict(),
        'platform_totals': platform_totals.to_dict(),
        'peak_months': peak_months,
        'yoy_growth': yoy_growth,
        'platform_by_year': platform_by_year
    }
    
    print()

# Now generate specific insights for each bank
print('\n=== SPECIFIC INSIGHTS FOR EACH BANK ===\n')

for bank, data in bank_insights.items():
    print(f'\n{bank} - DATA-DRIVEN INSIGHTS:')
    
    # Generate 4 specific insights per bank
    insights = []
    
    # Insight 1: Total spending and growth
    yearly = data['yearly_totals']
    if 2024 in yearly and 2023 in yearly:
        total_2024 = yearly[2024]
        total_2023 = yearly[2023]
        growth = ((total_2024 - total_2023) / total_2023) * 100
        insights.append(f"Social media spending grew {growth:.1f}% from 2023 to 2024, reaching ${total_2024:,.0f} in total investment")
    
    # Insight 2: Platform dominance
    platforms = data['platform_totals']
    if platforms:
        top_platform = list(platforms.keys())[0]
        top_amount = platforms[top_platform]
        total_spend = sum(platforms.values())
        percentage = (top_amount / total_spend) * 100
        insights.append(f"{top_platform.replace('.COM', '').title()} dominates spending with ${top_amount:,.0f} ({percentage:.1f}% of total investment)")
    
    # Insight 3: Peak performance month
    peaks = data['peak_months']
    if 2024 in peaks:
        peak_month = peaks[2024]['month']
        peak_amount = peaks[2024]['amount']
        insights.append(f"Peak 2024 performance occurred in {peak_month} with ${peak_amount:,.0f} in social media spend")
    
    # Insight 4: Platform diversification or focus
    platform_by_year = data['platform_by_year']
    if 2024 in platform_by_year:
        platforms_2024 = platform_by_year[2024]
        num_platforms = len(platforms_2024)
        if num_platforms >= 4:
            insights.append(f"Diversified platform strategy with active presence on {num_platforms} platforms in 2024")
        else:
            top_2_platforms = list(platforms_2024.keys())[:2]
            insights.append(f"Focused platform strategy primarily leveraging {top_2_platforms[0].replace('.COM', '').title()} and {top_2_platforms[1].replace('.COM', '').title()} in 2024")
    
    # Print insights
    for i, insight in enumerate(insights, 1):
        print(f"{i}. {insight}")
    
    print()