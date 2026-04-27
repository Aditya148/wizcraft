import os
import shutil
import glob

brain_dir = r"C:\Users\adih4\.gemini\antigravity\brain\572dd449-321f-4390-83b5-c1da65479128"
target_dir = r"c:\Users\adih4\OneDrive\Documents\Projects\Data Assistant\docs\assets"

os.makedirs(target_dir, exist_ok=True)

pngs = glob.glob(os.path.join(brain_dir, "*.png"))
print(f"Found {len(pngs)} images")

for img in pngs:
    shutil.copy(img, target_dir)
    print(f"Copied {img} to {target_dir}")
