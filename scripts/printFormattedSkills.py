import sys
import json

skills = []

while True:
    text = input()
    if not text:
        with open("scripts/tempSkills", "w") as f:
            json.dump(skills, f, ensure_ascii=False, indent=4)
        sys.exit()
    skills.append(
        {"name": text.split(":")[0], "description": text.split(":")[1]})
