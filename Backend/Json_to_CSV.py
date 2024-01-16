import csv
import os
import json

def convert_json_to_csv(json_directory, output_csv_file):
    with open(output_csv_file, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = [
            'video_id', 'channelId'
        ]

        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()

        for filename in os.listdir(json_directory):
            if filename.endswith(".json"):

                json_file_path = os.path.join(json_directory, filename)

                with open(json_file_path, 'r') as file:
                    data = json.load(file)

                video_id = filename[:-5]
                # title = data['videoInfo']['snippet'].get('title', None)
                # description = data['videoInfo']['snippet']['localized'].get('description', None)
                channel_id = data['videoInfo']['snippet'].get('channelId', None)
                # category = data['videoInfo']['snippet'].get('categoryId', None)

                writer.writerow({
                    'video_id': video_id,
                    'channelId': channel_id 
                })

    print("Conversion completed.")

if __name__ == "__main__":
    input_directory = "test"
    output_csv_file = "videos/video_channel.csv"

    convert_json_to_csv(input_directory, output_csv_file)
