import pandas as pd

# Read the weather.xlsx file
weather_df = pd.read_excel('weather.xlsx')

# Read the cities.xlsx file
cities_df = pd.read_excel('cities.xlsx')

# Merge the weather data with the cities data based on State and City
merged_df = pd.merge(weather_df, cities_df, how='left', left_on=['State', 'City'], right_on=['state_name', 'city'])

# Select and reorder columns to include Latitude, Longitude, and Density after State and City
final_columns = ['state_id', 'State', 'City', 'lat', 'lng', 'population', 'density', 'Total Rainfall', 'Average Daily Rainfall', 'Average Wind Speed', 'Maximum Temperature', 'Minimum Temperature']
final_df = merged_df[final_columns]

# Rename columns to match the required output
final_df.rename(columns={'state_id': 'id', 'lat': 'Latitude', 'lng': 'Longitude', 'density': 'Density', 'population': 'Population'}, inplace=True)

# Save the modified weather.xlsx
final_df.to_excel('modified_weather.xlsx', index=False)
