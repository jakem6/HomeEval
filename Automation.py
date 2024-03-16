import re

input_data = input_data['form_body']  

pattern = r'name="([^"]+)"\s*([\s\S]*?)\s*(?=-----------------------------|\Z)'

# Find all matches
matches = re.findall(pattern, input_data, re.DOTALL)

for name, value in matches:
    print(f'name="{name}" {value.strip()}')