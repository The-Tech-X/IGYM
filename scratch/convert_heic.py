import os
from PIL import Image
from pillow_heif import register_heif_opener

register_heif_opener()

images_dir = "d:/cmr/backup/Code Zone/Official Projects/igym/public/Images"

for filename in os.listdir(images_dir):
    if filename.lower().endswith(".heic"):
        heic_path = os.path.join(images_dir, filename)
        jpg_filename = os.path.splitext(filename)[0] + ".jpg"
        jpg_path = os.path.join(images_dir, jpg_filename)
        
        print(f"Converting {filename} to {jpg_filename}...")
        try:
            image = Image.open(heic_path)
            image.save(jpg_path, "JPEG")
            print("Successfully converted.")
        except Exception as e:
            print(f"Failed to convert: {e}")
