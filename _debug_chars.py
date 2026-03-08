import sys

with open('lib/projects.ts', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('Provider-independent AI layer')
if idx < 0:
    print("NOT FOUND")
    sys.exit(1)

snippet = content[idx:idx+400]
for i, ch in enumerate(snippet):
    if ord(ch) > 127:
        print(f"  pos {i}: U+{ord(ch):04X} ({ch!r})")
