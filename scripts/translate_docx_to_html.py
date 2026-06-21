from __future__ import annotations

import argparse
import html
import json
import re
import sys
import time
from pathlib import Path

from docx import Document
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P
from docx.table import Table
from docx.text.paragraph import Paragraph


ROOT = Path(__file__).resolve().parents[1]
CACHE_PATH = ROOT / "technical-proposal-zh-cache.json"


def iter_blocks(document: Document):
    for child in document.element.body.iterchildren():
        if isinstance(child, CT_P):
            yield Paragraph(child, document)
        elif isinstance(child, CT_Tbl):
            yield Table(child, document)


def normalized_text(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def local_translate(value: str) -> str:
    replacements = [
        ("Appendix", "附件"),
        ("Technical Proposal", "技术方案"),
        ("Enterprise Resource Planning Solution", "企业资源规划解决方案"),
        ("National bank of Ethiopia", "埃塞俄比亚国家银行"),
        ("Table of contents", "目录"),
        ("Comments and Suggestions", "意见和建议"),
        ("Requirements Specification", "需求规格说明"),
        ("Requirements Clarity and Completeness", "需求清晰度与完整性"),
        ("Technical Solution and Architecture Optimization", "技术方案与架构优化"),
        ("Project Implementation and Risk Disclosure", "项目实施与风险披露"),
        ("Commercial, Regulatory and Standards Compliance", "商务、监管与标准合规"),
        ("O & M Handover and Scalability", "运维移交与可扩展性"),
        ("Technical Proposal and Response Deviation", "技术方案及响应偏离"),
        ("Response Deviation Table", "响应偏离表"),
        ("Functional Requirements Scheme", "功能需求方案"),
        ("Non-Functional Scheme", "非功能方案"),
        ("Core Management and User Rights Management Module", "核心管理和用户权限管理模块"),
        ("Official Document, Document and Process Management Module", "公文、文档和流程管理模块"),
        ("Human Resource Management", "人力资源管理"),
        ("Employee Attendance Administration", "员工考勤管理"),
        ("Finance and Accounting Management", "财务与会计管理"),
        ("Financial and Accounting Management", "财务与会计管理"),
        ("Budget and Performance Management", "预算与绩效管理"),
        ("Procurement and Contract Management", "采购与合同管理"),
        ("Asset and Inventory Management", "资产与库存管理"),
        ("Vehicle Operation and Maintenance Management", "车辆运行维护管理"),
        ("Project Management", "项目管理"),
        ("Knowledge Management and Electronic Library", "知识管理与电子图书馆"),
        ("Compliance, Risk and Audit Management", "合规、风险与审计管理"),
        ("Legal and Compliance Management", "法律与合规管理"),
        ("Organizational Planning and Communication Management", "组织规划与沟通管理"),
        ("Information Technology Service Management", "信息技术服务管理"),
        ("Security Control and Audit Trail", "安全控制与审计追踪"),
        ("Reporting and Business Intelligence", "报告与商业智能"),
        ("Performance and Scalability", "性能与可扩展性"),
        ("Usability and Reliability", "易用性与可靠性"),
        ("Maintainability and Supportability", "可维护性与支持性"),
        ("Portability and Compatibility", "可移植性与兼容性"),
        ("BID Submission date", "投标提交日期"),
        ("BID Reference No", "投标编号"),
        ("For", "提交给"),
    ]
    translated = value
    for source, target in replacements:
        translated = translated.replace(source, target)
    return translated


def should_translate(value: str) -> bool:
    if not value:
        return False
    return bool(re.search(r"[A-Za-z]{3,}", value))


def split_for_translation(value: str, limit: int = 4200) -> list[str]:
    if len(value) <= limit:
        return [value]
    parts: list[str] = []
    current: list[str] = []
    current_len = 0
    for piece in re.split(r"(?<=[.;:!?])\s+", value):
        if current and current_len + len(piece) + 1 > limit:
            parts.append(" ".join(current))
            current = [piece]
            current_len = len(piece)
        else:
            current.append(piece)
            current_len += len(piece) + 1
    if current:
        parts.append(" ".join(current))
    return parts


def translate_value(value: str, translator, cache: dict[str, str], delay: float) -> str:
    text = normalized_text(value)
    if not text:
        return ""
    if text in cache:
        return cache[text]
    if not should_translate(text):
        cache[text] = text
        return text
    if translator is None:
        translated = local_translate(text)
        cache[text] = translated
        return translated

    try:
        parts = split_for_translation(text)
        translated_parts = []
        for part in parts:
            translated_parts.append(translator.translate(part))
            if delay:
                time.sleep(delay)
        translated = " ".join(translated_parts)
    except Exception:
        translated = local_translate(text)
    cache[text] = translated
    return translated


def cell_text(cell) -> str:
    return normalized_text(" ".join(p.text for p in cell.paragraphs))


def load_cache() -> dict[str, str]:
    if CACHE_PATH.exists():
        return json.loads(CACHE_PATH.read_text(encoding="utf-8"))
    return {}


def save_cache(cache: dict[str, str]) -> None:
    CACHE_PATH.write_text(
        json.dumps(cache, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def paragraph_level(text: str) -> int:
    match = re.match(r"^(\d+(?:\.\d+){0,5})\.?\s+", text)
    if not match:
        return 0
    return min(match.group(1).count(".") + 1, 6)


def render_paragraph(text: str, translated: str) -> str:
    level = paragraph_level(text)
    if level:
        tag = f"h{min(level + 1, 6)}"
        return (
            f"<{tag}>{html.escape(translated)}</{tag}>"
            f"<p class=\"source\">{html.escape(text)}</p>"
        )
    return (
        "<p>"
        f"{html.escape(translated)}"
        f"<span class=\"source\">{html.escape(text)}</span>"
        "</p>"
    )


def render_table(table: Table, translator, cache: dict[str, str], delay: float) -> str:
    rows = []
    for row in table.rows:
        cells = []
        for cell in row.cells:
            raw = cell_text(cell)
            translated = translate_value(raw, translator, cache, delay)
            cells.append(
                "<td>"
                f"<div>{html.escape(translated)}</div>"
                f"<small>{html.escape(raw)}</small>"
                "</td>"
            )
        rows.append("<tr>" + "".join(cells) + "</tr>")
    return "<div class=\"table-wrap\"><table>" + "".join(rows) + "</table></div>"


def build_html(title: str, body: str, stats: dict[str, int]) -> str:
    return f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{html.escape(title)}</title>
  <style>
    :root {{
      font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
      color: #182126;
      background: #f3f6f7;
      line-height: 1.72;
    }}
    body {{ margin: 0; }}
    header {{
      position: sticky;
      top: 0;
      z-index: 10;
      padding: 18px 32px;
      border-bottom: 1px solid #dbe4e7;
      background: rgba(255,255,255,.96);
      backdrop-filter: blur(10px);
    }}
    header h1 {{ margin: 0; font-size: clamp(22px, 3vw, 34px); }}
    header p {{ margin: 6px 0 0; color: #5f6d75; font-size: 14px; }}
    main {{ max-width: 1180px; margin: 0 auto; padding: 28px 24px 80px; }}
    article {{
      padding: 28px;
      border: 1px solid #dbe4e7;
      border-radius: 8px;
      background: #fff;
      box-shadow: 0 16px 38px rgba(29,46,54,.08);
    }}
    h2, h3, h4, h5, h6 {{
      margin: 32px 0 8px;
      color: #0f514b;
      line-height: 1.35;
      letter-spacing: 0;
    }}
    h2 {{ font-size: 26px; border-bottom: 1px solid #dbe4e7; padding-bottom: 8px; }}
    h3 {{ font-size: 22px; }}
    h4 {{ font-size: 19px; }}
    h5, h6 {{ font-size: 17px; }}
    p {{ margin: 11px 0; font-size: 16px; }}
    .source {{
      display: block;
      margin-top: 4px;
      color: #6c7780;
      font-size: 12px;
      line-height: 1.45;
    }}
    .table-wrap {{
      overflow: auto;
      margin: 22px 0;
      border: 1px solid #dbe4e7;
      border-radius: 8px;
    }}
    table {{ width: 100%; border-collapse: collapse; min-width: 760px; }}
    td {{
      vertical-align: top;
      padding: 10px 12px;
      border-right: 1px solid #dbe4e7;
      border-bottom: 1px solid #dbe4e7;
      font-size: 14px;
    }}
    tr:first-child td {{ background: #eef5f4; font-weight: 700; color: #103f3b; }}
    td small {{
      display: block;
      margin-top: 5px;
      color: #718087;
      font-size: 11px;
      line-height: 1.38;
    }}
    @media (max-width: 720px) {{
      header {{ padding: 14px 18px; }}
      main {{ padding: 16px 12px 56px; }}
      article {{ padding: 18px; }}
      p {{ font-size: 15px; }}
    }}
  </style>
</head>
<body>
  <header>
    <h1>{html.escape(title)}</h1>
    <p>已从 Word 文档生成中文阅读页面；共处理 {stats["paragraphs"]} 个段落、{stats["tables"]} 个表格。</p>
  </header>
  <main>
    <article>
      {body}
    </article>
  </main>
</body>
</html>
"""


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("docx")
    parser.add_argument("output")
    parser.add_argument("--delay", type=float, default=0.02)
    parser.add_argument("--offline", action="store_true")
    args = parser.parse_args()

    translator = None
    if not args.offline:
        sys.path.insert(0, "/private/tmp/codex_py_deps")
        from deep_translator import GoogleTranslator
        translator = GoogleTranslator(source="auto", target="zh-CN")

    document = Document(args.docx)
    cache = load_cache()
    chunks: list[str] = []
    stats = {"paragraphs": 0, "tables": 0}

    for index, block in enumerate(iter_blocks(document), 1):
        if isinstance(block, Paragraph):
            raw = normalized_text(block.text)
            if not raw:
                continue
            translated = translate_value(raw, translator, cache, args.delay)
            chunks.append(render_paragraph(raw, translated))
            stats["paragraphs"] += 1
        else:
            chunks.append(render_table(block, translator, cache, args.delay))
            stats["tables"] += 1

        if index % 20 == 0:
            save_cache(cache)
            print(
                f"processed blocks={index} paragraphs={stats['paragraphs']} "
                f"tables={stats['tables']} cache={len(cache)}",
                flush=True,
            )

    save_cache(cache)
    title = "附件 2 技术方案（中文翻译）"
    Path(args.output).write_text(build_html(title, "\n".join(chunks), stats), encoding="utf-8")
    print(f"wrote {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
