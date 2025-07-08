import csv
from collections import defaultdict

# Read the CSV data
data = []
with open('/mnt/c/Users/dany2/Downloads/wells-fargo-social-insights-main/public/banking-social-data.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        data.append(row)

# Organize data by bank
banks = {}
for row in data:
    bank = row['Bank']
    if bank not in banks:
        banks[bank] = []
    banks[bank].append(row)

print('=== BANKING SOCIAL DATA ANALYSIS ===\n')

bank_insights = {}

for bank, bank_data in banks.items():
    print(f'\n--- {bank} ---')
    
    # Calculate yearly totals
    yearly_totals = defaultdict(int)
    platform_totals = defaultdict(int)
    monthly_data = defaultdict(int)
    platform_by_year = defaultdict(lambda: defaultdict(int))
    
    for row in bank_data:
        year = int(row['Year'])
        dollars = int(row['dollars'])
        platform = row['Distributor']
        month = row['Month']
        
        yearly_totals[year] += dollars
        platform_totals[platform] += dollars
        monthly_data[(year, month)] += dollars
        platform_by_year[year][platform] += dollars
    
    print(f'Total spending by year: {dict(yearly_totals)}')
    
    # Sort platforms by spending
    sorted_platforms = sorted(platform_totals.items(), key=lambda x: x[1], reverse=True)
    print(f'Top platforms: {dict(sorted_platforms[:5])}')
    
    # Find peak months for each year
    peak_months = {}
    for year in [2023, 2024, 2025]:
        year_months = {k: v for k, v in monthly_data.items() if k[0] == year}
        if year_months:
            peak_month_key = max(year_months.keys(), key=lambda x: year_months[x])
            peak_months[year] = {
                'month': peak_month_key[1],
                'amount': year_months[peak_month_key]
            }
            print(f'Peak month {year}: {peak_month_key[1]} with ${year_months[peak_month_key]:,.0f}')
    
    # Calculate YoY growth
    yoy_growth = {}
    if 2023 in yearly_totals and 2024 in yearly_totals:
        growth_2023_2024 = ((yearly_totals[2024] - yearly_totals[2023]) / yearly_totals[2023]) * 100
        yoy_growth['2023_2024'] = growth_2023_2024
        print(f'YoY growth 2023-2024: {growth_2023_2024:.1f}%')
    
    # Store insights for this bank
    bank_insights[bank] = {
        'yearly_totals': dict(yearly_totals),
        'platform_totals': dict(platform_totals),
        'peak_months': peak_months,
        'yoy_growth': yoy_growth,
        'platform_by_year': dict(platform_by_year)
    }
    
    print()

# Generate specific insights for each bank
print('\n=== SPECIFIC INSIGHTS FOR EACH BANK ===\n')

for bank, data in bank_insights.items():
    print(f'\n{bank} - DATA-DRIVEN INSIGHTS:')
    
    insights = []
    
    # Insight 1: Total spending and growth
    yearly = data['yearly_totals']
    if 2024 in yearly and 2023 in yearly:
        total_2024 = yearly[2024]
        total_2023 = yearly[2023]
        growth = ((total_2024 - total_2023) / total_2023) * 100
        insights.append(f"Social media spending grew {growth:.1f}% from 2023 to 2024, reaching ${total_2024:,.0f} in total investment")
    elif 2024 in yearly:
        total_2024 = yearly[2024]
        insights.append(f"Invested ${total_2024:,.0f} in social media advertising during 2024")
    
    # Insight 2: Platform dominance
    platforms = data['platform_totals']
    if platforms:
        sorted_platforms = sorted(platforms.items(), key=lambda x: x[1], reverse=True)
        top_platform = sorted_platforms[0][0]
        top_amount = sorted_platforms[0][1]
        total_spend = sum(platforms.values())
        percentage = (top_amount / total_spend) * 100
        platform_name = top_platform.replace('.COM', '').replace('FACEBOOK', 'Facebook').replace('INSTAGRAM', 'Instagram').replace('TIKTOK', 'TikTok').replace('PINTEREST', 'Pinterest').replace('REDDIT', 'Reddit').replace('X', 'X (Twitter)')
        insights.append(f"{platform_name} dominates spending with ${top_amount:,.0f} ({percentage:.1f}% of total investment)")
    
    # Insight 3: Peak performance month
    peaks = data['peak_months']
    if 2024 in peaks:
        peak_month = peaks[2024]['month']
        peak_amount = peaks[2024]['amount']
        insights.append(f"Peak 2024 performance occurred in {peak_month} with ${peak_amount:,.0f} in social media spend")
    
    # Insight 4: Platform diversification or recent trends
    platform_by_year = data['platform_by_year']
    if 2024 in platform_by_year:
        platforms_2024 = platform_by_year[2024]
        num_platforms = len(platforms_2024)
        sorted_2024_platforms = sorted(platforms_2024.items(), key=lambda x: x[1], reverse=True)
        
        if num_platforms >= 4:
            insights.append(f"Diversified platform strategy with active presence on {num_platforms} platforms in 2024")
        elif num_platforms >= 2:
            top_platform = sorted_2024_platforms[0][0].replace('.COM', '').replace('FACEBOOK', 'Facebook').replace('INSTAGRAM', 'Instagram').replace('TIKTOK', 'TikTok').replace('PINTEREST', 'Pinterest').replace('REDDIT', 'Reddit').replace('X', 'X')
            second_platform = sorted_2024_platforms[1][0].replace('.COM', '').replace('FACEBOOK', 'Facebook').replace('INSTAGRAM', 'Instagram').replace('TIKTOK', 'TikTok').replace('PINTEREST', 'Pinterest').replace('REDDIT', 'Reddit').replace('X', 'X')
            insights.append(f"Focused platform strategy primarily leveraging {top_platform} and {second_platform} in 2024")
    
    # Add 2025 insights if available
    if 2025 in yearly:
        total_2025 = yearly[2025]
        if 2025 in peaks:
            peak_month_2025 = peaks[2025]['month']
            peak_amount_2025 = peaks[2025]['amount']
            insights.append(f"2025 performance shows ${total_2025:,.0f} invested so far, with peak month {peak_month_2025} at ${peak_amount_2025:,.0f}")
    
    # Print insights (limit to 4 main insights)
    for i, insight in enumerate(insights[:4], 1):
        print(f"{i}. {insight}")
    
    print()