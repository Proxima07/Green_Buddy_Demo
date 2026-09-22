#!/usr/bin/env python3
"""Create a same-root delta ZIP by comparing SHA-256 file manifests."""
import argparse
import hashlib
import json
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile
from datetime import datetime, timezone

ROOT_NAME = "greenbuddy-demo"
MANIFEST = "release-manifest.json"


def inventory(project):
    result = {}
    for path in sorted(project.rglob("*")):
        if not path.is_file():
            continue
        relative = path.relative_to(project)
        if (relative.as_posix() == MANIFEST or path.suffix in {".zip", ".pyc"}
                or any(part in {".git", "__pycache__", ".DS_Store"} for part in relative.parts)):
            continue
        result[relative.as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--project", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--baseline", type=Path, required=True)
    parser.add_argument("--version", required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    project = args.project.resolve()
    output = args.out.resolve()
    if output.is_relative_to(project):
        parser.error("Please place the ZIP outside the project directory.")
    baseline = json.loads(args.baseline.read_text(encoding="utf-8"))
    if baseline.get("root") != ROOT_NAME:
        parser.error("The baseline is not a GreenBuddy release manifest.")
    previous = baseline["files"]
    current = inventory(project)
    changed = [name for name, digest in current.items() if previous.get(name) != digest]
    removed = sorted(set(previous) - set(current))
    if not changed and not removed:
        print("No content changes; no patch created.")
        return
    manifest = {"version": args.version, "root": ROOT_NAME,
                "created_at": datetime.now(timezone.utc).isoformat(), "files": current}
    serialized = json.dumps(manifest, ensure_ascii=False, indent=2) + "\n"
    notes = (f"# GreenBuddy {args.version} 增量更新\n\n"
             f"適用基底：{baseline.get('version', 'unknown')}\n\n"
             "請先備份原始專案，再於上一層解壓縮，合併同名 greenbuddy-demo 資料夾。\n\n"
             "## 新增或修改\n\n" + "\n".join(f"- `{name}`" for name in changed))
    if removed:
        notes += "\n\n## 需要手動刪除的舊檔\n\n" + "\n".join(f"- `{name}`" for name in removed)
        notes += "\n\nZIP 解壓縮不會自動刪除舊檔，請依上列清單處理。"
    else:
        notes += "\n\n本次不需要刪除任何舊檔。"
    output.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(output, "w", ZIP_DEFLATED) as archive:
        for name in changed:
            archive.write(project / name, f"{ROOT_NAME}/{name}")
        archive.writestr(f"{ROOT_NAME}/{MANIFEST}", serialized)
        archive.writestr("PATCH_NOTES.md", notes + "\n")
    (project / MANIFEST).write_text(serialized, encoding="utf-8")
    print(f"Created {output.name}: {len(changed)} changed/new, {len(removed)} removed.")


if __name__ == "__main__":
    main()
