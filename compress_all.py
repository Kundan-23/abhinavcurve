import os
from PIL import Image
import sys

def compress_images_in_dir(directory):
    for root, _, files in os.walk(directory):
        for filename in files:
            if filename.lower().endswith((".png", ".jpg", ".jpeg")):
                filepath = os.path.join(root, filename)
                
                # Skip if file is already small (e.g. under 3MB)
                if os.path.getsize(filepath) < 3 * 1024 * 1024:
                    continue
                    
                print(f"Compressing {filepath}...")
                try:
                    with Image.open(filepath) as img:
                        # Convert to RGB if PNG with alpha
                        if img.mode in ("RGBA", "P"):
                            img = img.convert("RGB")
                        
                        # Resize if excessively large (e.g. over 2560 width)
                        max_width = 2560
                        if img.width > max_width:
                            ratio = max_width / img.width
                            new_size = (max_width, int(img.height * ratio))
                            img = img.resize(new_size, Image.Resampling.LANCZOS)
                        
                        # Save as high quality JPG
                        outpath = os.path.splitext(filepath)[0] + "_compressed.jpg"
                        img.save(outpath, "JPEG", quality=80, optimize=True)
                        
                    # Delete original massive file
                    os.remove(filepath)
                    
                    # Rename new file to old filename (but with jpg extension)
                    final_path = os.path.splitext(filepath)[0] + ".jpg"
                    if outpath != final_path:
                        os.rename(outpath, final_path)
                    print(f"Successfully compressed {filename}")
                except Exception as e:
                    print(f"Error compressing {filename}: {e}")

if __name__ == "__main__":
    assets_dir = os.path.join(os.getcwd(), "assets", "images")
    compress_images_in_dir(assets_dir)
