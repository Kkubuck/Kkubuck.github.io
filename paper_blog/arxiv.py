from __future__ import annotations

import html
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from pathlib import Path
from typing import List

ARXIV_API = "https://export.arxiv.org/api/query"
ARXIV_ABS = "https://arxiv.org/abs/{arxiv_id}"
ARXIV_PDF = "https://arxiv.org/pdf/{arxiv_id}.pdf"

ATOM_NS = {"atom": "http://www.w3.org/2005/Atom", "arxiv": "http://arxiv.org/schemas/atom"}


@dataclass
class ArxivCandidate:
    arxiv_id: str
    title: str
    summary: str
    published: str
    updated: str
    abs_url: str
    pdf_url: str



def search_arxiv(query: str, max_results: int = 5) -> List[ArxivCandidate]:
    params = {
        "search_query": f"all:{query}",
        "start": "0",
        "max_results": str(max_results),
        "sortBy": "relevance",
        "sortOrder": "descending",
    }
    url = f"{ARXIV_API}?{urllib.parse.urlencode(params)}"
    with urllib.request.urlopen(url, timeout=30) as response:
        xml_bytes = response.read()
    root = ET.fromstring(xml_bytes)
    candidates: List[ArxivCandidate] = []
    for entry in root.findall("atom:entry", ATOM_NS):
        id_text = entry.findtext("atom:id", default="", namespaces=ATOM_NS)
        title = normalize_text(entry.findtext("atom:title", default="", namespaces=ATOM_NS))
        summary = normalize_text(entry.findtext("atom:summary", default="", namespaces=ATOM_NS))
        published = entry.findtext("atom:published", default="", namespaces=ATOM_NS)
        updated = entry.findtext("atom:updated", default="", namespaces=ATOM_NS)
        arxiv_id = id_text.rsplit("/", 1)[-1]
        candidates.append(
            ArxivCandidate(
                arxiv_id=arxiv_id,
                title=title,
                summary=summary,
                published=published,
                updated=updated,
                abs_url=ARXIV_ABS.format(arxiv_id=arxiv_id),
                pdf_url=ARXIV_PDF.format(arxiv_id=arxiv_id),
            )
        )
    return candidates



def download_arxiv_pdf(arxiv_id: str, dest_path: Path) -> Path:
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    url = ARXIV_PDF.format(arxiv_id=arxiv_id)
    with urllib.request.urlopen(url, timeout=60) as response:
        pdf_bytes = response.read()
    dest_path.write_bytes(pdf_bytes)
    return dest_path



def normalize_text(value: str) -> str:
    value = html.unescape(value or "")
    value = re.sub(r"\s+", " ", value)
    return value.strip()
