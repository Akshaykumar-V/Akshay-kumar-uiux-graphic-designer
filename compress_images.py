import os
from PIL import Image

img_dir = r'c:\Users\AKSHAY KUMAR\OneDrive\Documents\my portfolioooooo\images'

for filename in os.listdir(img_dir):
    if filename.lower().endswith('.png'):
        filepath = os.path.join(img_dir, filename)
        original_size = os.path.getsize(filepath) / (1024*1024)
        
        img = Image.open(filepath)
        w, h = img.size
        
        # Resize if wider than 1400px
        max_width = 1400
        if w > max_width:
            ratio = max_width / w
            new_size = (max_width, int(h * ratio))
            img = img.resize(new_size, Image.LANCZOS)
        
        # Convert to RGB and save as optimized JPEG
        rgb_img = img.convert('RGB')
        new_filename = os.path.splitext(filename)[0] + '.jpg'
        new_filepath = os.path.join(img_dir, new_filename)
        rgb_img.save(new_filepath, 'JPEG', quality=80, optimize=True)
        
        new_size_mb = os.path.getsize(new_filepath) / (1024*1024)
        print(f'{filename}: {original_size:.2f}MB -> {new_size_mb:.2f}MB ({new_filename})')

print('\nDone! All images compressed.')
