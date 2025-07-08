import csv
from collections import defaultdict
import json

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

# Generate comprehensive insights
all_insights = {}

month_order = ['January', 'February', 'March', 'April', 'May', 'June', 
               'July', 'August', 'September', 'October', 'November', 'December']

for bank, bank_data in banks.items():
    # Calculate comprehensive metrics
    yearly_totals = defaultdict(int)
    platform_totals = defaultdict(int)
    monthly_data = defaultdict(int)
    platform_by_year = defaultdict(lambda: defaultdict(int))
    quarterly_data = defaultdict(int)
    
    for row in bank_data:
        year = int(row['Year'])
        dollars = int(row['dollars'])
        platform = row['Distributor']
        month = row['Month']
        
        yearly_totals[year] += dollars
        platform_totals[platform] += dollars
        monthly_data[(year, month)] += dollars
        platform_by_year[year][platform] += dollars
        
        # Calculate quarters
        month_name = month.split(' ')[0]
        if month_name in ['January', 'February', 'March']:
            quarter = 'Q1'
        elif month_name in ['April', 'May', 'June']:
            quarter = 'Q2'
        elif month_name in ['July', 'August', 'September']:
            quarter = 'Q3'
        else:
            quarter = 'Q4'
        quarterly_data[(year, quarter)] += dollars
    
    # Generate insights
    insights = []
    
    # 1. Year-over-year growth insight
    if 2024 in yearly_totals and 2023 in yearly_totals:
        growth = ((yearly_totals[2024] - yearly_totals[2023]) / yearly_totals[2023]) * 100
        if growth > 100:
            insights.append(f"Achieved exceptional {growth:.0f}% year-over-year growth in social media investment, increasing from ${yearly_totals[2023]:,.0f} in 2023 to ${yearly_totals[2024]:,.0f} in 2024")
        elif growth > 50:
            insights.append(f"Demonstrated strong {growth:.0f}% year-over-year growth in social media spending, reaching ${yearly_totals[2024]:,.0f} in 2024")
        elif growth > 0:
            insights.append(f"Maintained positive {growth:.0f}% growth in social media investment, with ${yearly_totals[2024]:,.0f} total spend in 2024")
        else:
            insights.append(f"Social media spending decreased by {abs(growth):.0f}% from 2023 to 2024, totaling ${yearly_totals[2024]:,.0f} in 2024")
    
    # 2. Platform dominance and strategy
    sorted_platforms = sorted(platform_totals.items(), key=lambda x: x[1], reverse=True)
    if len(sorted_platforms) >= 2:
        top_platform = sorted_platforms[0][0].replace('.COM', '').title().replace('Facebook', 'Facebook').replace('Instagram', 'Instagram').replace('X', 'X (Twitter)')
        top_amount = sorted_platforms[0][1]
        total_spend = sum(platform_totals.values())
        percentage = (top_amount / total_spend) * 100
        
        second_platform = sorted_platforms[1][0].replace('.COM', '').title().replace('Facebook', 'Facebook').replace('Instagram', 'Instagram').replace('X', 'X (Twitter)')
        second_amount = sorted_platforms[1][1]
        second_percentage = (second_amount / total_spend) * 100
        
        if percentage > 70:
            insights.append(f"Heavily concentrated on {top_platform} with {percentage:.0f}% of total investment (${top_amount:,.0f}), indicating a focused platform strategy")
        elif percentage > 50:
            insights.append(f"{top_platform} leads platform investment with {percentage:.0f}% share (${top_amount:,.0f}), followed by {second_platform} at {second_percentage:.0f}% (${second_amount:,.0f})")
        else:
            insights.append(f"Balanced platform approach with {top_platform} at {percentage:.0f}% (${top_amount:,.0f}) and {second_platform} at {second_percentage:.0f}% (${second_amount:,.0f}) of total spend")
    
    # 3. Peak performance analysis
    if 2024 in yearly_totals:
        year_2024_months = {k: v for k, v in monthly_data.items() if k[0] == 2024}
        if year_2024_months:
            peak_month_key = max(year_2024_months.keys(), key=lambda x: year_2024_months[x])
            peak_month = peak_month_key[1]
            peak_amount = year_2024_months[peak_month_key]
            
            # Calculate what percentage of yearly spend this represents
            yearly_2024 = yearly_totals[2024]
            peak_percentage = (peak_amount / yearly_2024) * 100
            
            insights.append(f"Peak 2024 performance in {peak_month} with ${peak_amount:,.0f} spend, representing {peak_percentage:.0f}% of annual social media investment")
    
    # 4. 2025 performance or platform diversification
    if 2025 in yearly_totals:
        total_2025 = yearly_totals[2025]
        
        # Find months with data in 2025
        year_2025_months = {k: v for k, v in monthly_data.items() if k[0] == 2025}
        months_with_data = len(year_2025_months)
        
        if months_with_data > 0:
            avg_monthly_2025 = total_2025 / months_with_data
            
            # Compare with 2024 average if available
            if 2024 in yearly_totals:
                year_2024_months = {k: v for k, v in monthly_data.items() if k[0] == 2024}
                months_2024 = len(year_2024_months)
                avg_monthly_2024 = yearly_totals[2024] / months_2024
                
                monthly_change = ((avg_monthly_2025 - avg_monthly_2024) / avg_monthly_2024) * 100
                
                if monthly_change > 0:
                    insights.append(f"2025 shows accelerated momentum with ${avg_monthly_2025:,.0f} average monthly spend, {monthly_change:.0f}% higher than 2024's ${avg_monthly_2024:,.0f} monthly average")
                else:
                    insights.append(f"2025 investment pace at ${avg_monthly_2025:,.0f} average monthly spend, {abs(monthly_change):.0f}% below 2024's ${avg_monthly_2024:,.0f} monthly average")
            else:
                insights.append(f"2025 performance shows ${total_2025:,.0f} invested across {months_with_data} months, averaging ${avg_monthly_2025:,.0f} monthly")
    else:
        # If no 2025 data, focus on platform diversification
        if 2024 in platform_by_year:
            platforms_2024 = platform_by_year[2024]
            num_platforms = len(platforms_2024)
            
            if num_platforms >= 5:
                insights.append(f"Diversified multi-platform strategy across {num_platforms} channels in 2024, demonstrating comprehensive social media market coverage")
            elif num_platforms >= 3:
                top_3_platforms = sorted(platforms_2024.items(), key=lambda x: x[1], reverse=True)[:3]
                platform_names = [p[0].replace('.COM', '').title() for p in top_3_platforms]
                insights.append(f"Strategic focus on {num_platforms} primary platforms in 2024: {', '.join(platform_names)}")
    
    # Store insights for this bank
    all_insights[bank] = insights

# Print formatted insights
print("=== BANK SOCIAL MEDIA INSIGHTS FOR SLIDE CONTENT ===\\n")

for bank, insights in all_insights.items():
    print(f"## {bank}")
    print("### 2024 Performance Insights:")
    for i, insight in enumerate(insights, 1):
        print(f"{i}. {insight}")
    print()

# Also create a JSON output for easy integration
output_data = {}
for bank, insights in all_insights.items():
    output_data[bank] = {
        "insights_2024": insights[:2],  # First 2 for 2024 slides
        "insights_2025": insights[2:4]   # Next 2 for 2025 slides
    }

# Save to JSON file
with open('/mnt/c/Users/dany2/Downloads/wells-fargo-social-insights-main/bank_insights.json', 'w') as f:
    json.dump(output_data, f, indent=2)

print("\\n=== INSIGHTS SAVED TO bank_insights.json ===")
print("Structure: Each bank has 'insights_2024' and 'insights_2025' arrays")