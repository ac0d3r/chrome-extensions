"""
for video
简单的 typing 效果
run: 
    python3 styping.py
"""
import os
import time


def typing(file, content, speed=0.1):
    for word in content:
        if not word in [" ", "\n"]:
            time.sleep(speed)
        if os.path.exists(file):
            f = open(file, "a")
        else:
            f = open(file, "w")
        f.write(word)
        f.close()


def main(dest, src="./BiliFans", speed=1):
    project_name = "BiliFans"
    for dirpath, dirnames, filenames in os.walk(src):
        for dir_ in dirnames:
            _path = os.path.join(dest, dir_)
            if os.path.exists(_path):
                continue
            time.sleep(speed)
            os.mkdir(_path)

        for filename in filenames:
            src_filename = os.path.join(dirpath, filename)
            dest_filename = os.path.join(
                dest, src_filename.split(project_name + "/")[1])

            print(src_filename, dest_filename)
            if filename.endswith('.png') or filename.endswith('.gif'):
                time.sleep(speed)
                with open(src_filename, "rb") as f1, open(dest_filename, 'ab') as f2:
                    f2.write(f1.read())
                continue

            print("[*] Read Srouce file content - %s" % src_filename)
            with open(src_filename, "r") as f:
                content = f.read()

            print("[*] Typing Dest file content - %s" % dest_filename)
            typing(dest_filename, content)


if __name__ == "__main__":
    main("./BiliFans2")
