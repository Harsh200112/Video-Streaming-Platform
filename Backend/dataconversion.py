import json
import os

def combine_json_files(input_folder, output_file):
    combined_data = []

    # Loop through all files in the input folder
    for filename in os.listdir(input_folder):
        if filename.endswith(".json"):
            file_path = os.path.join(input_folder, filename)

            # Read data from each file
            with open(file_path, 'r') as file:
                data = json.load(file)
                combined_data.append(data)

    # Write the combined data to the output file
    with open(output_file, 'w') as output_file:
        json.dump(combined_data, output_file, indent=2)

# Specify the input folder containing your JSON files and the output file
input_folder = 'test'
output_file = 'combined_data.json'

# Call the function to combine JSON files
combine_json_files(input_folder, output_file)
