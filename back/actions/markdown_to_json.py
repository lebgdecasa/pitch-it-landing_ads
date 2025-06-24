import markdown
from bs4 import BeautifulSoup
import re
import json
from typing import List, Dict

def parse_markdown_to_json(markdown_text: str):
    if not markdown_text:
        return {
            "title": "",
            "subtitle": "",
            "date": "",
            "sections": []
        }
    html = markdown.markdown(markdown_text, extensions=['extra'])
    soup = BeautifulSoup(html, 'html.parser')

    result = {
        "title": "",
        "subtitle": "",
        "date": "",
        "sections": []
    }

    current_section = None
    current_subsection = None

    for tag in soup.find_all():
        if tag.name == 'h1' and not result["title"]:
            result["title"] = tag.text.strip()

        elif tag.name == 'p':
            if re.match(r'^\*Date:', tag.text):
                result["date"] = tag.text.replace("*Date:", "").strip()
            elif not result["subtitle"]:
                result["subtitle"] = tag.text.strip()

        elif tag.name == 'h2':
            current_section = {
                "heading": tag.text.strip(),
                "content": "",
                "subsections": []
            }
            result["sections"].append(current_section)
            current_subsection = None

        elif tag.name == 'h3' and current_section:
            current_subsection = {
                "subheading": tag.text.strip(),
                "content": [],
                "bullets": []
            }
            current_section["subsections"].append(current_subsection)

        elif tag.name == 'ul':
            items = [li.text.strip() for li in tag.find_all('li')]
            if current_subsection:
                current_subsection["bullets"].extend(items)
            elif current_section:
                current_section.setdefault("bullets", []).extend(items)

        elif tag.name == 'p':
            paragraph = tag.text.strip()
            if current_subsection:
                current_subsection["content"].append(paragraph)
            elif current_section:
                if current_section["content"]:
                    current_section["content"] += "\n" + paragraph
                else:
                    current_section["content"] = paragraph
            elif not result["subtitle"]:  # If subtitle was skipped above
                result["subtitle"] = paragraph

    # Convert subsection content list to string
    for section in result["sections"]:
        for sub in section["subsections"]:
            sub["content"] = "\n".join(sub["content"]).strip()

    return result

def parse_final_analysis(md_text: str) -> Dict:
    """
    Parse the numbered-list style ‘final analysis’ Markdown into JSON.

    Expected pattern:
    # Title
    1. **Section-Heading**: optional intro…
       * bullet
       * bullet
    2. **Next-Heading**:
       ...
    """
    if not md_text:
        return {"title": "", "sections": []}
    html = markdown.markdown(md_text, extensions=["extra"])
    soup = BeautifulSoup(html, "html.parser")

    out: Dict = {"title": "", "sections": []}

    # pull the first <h1> as title (if any)
    h1 = soup.find("h1")
    if h1:
        out["title"] = h1.text.strip()

    # root-level <ol> → each <li> becomes a section
    for li in soup.find_all("ol", recursive=False):
        for item in li.find_all("li", recursive=False):
            sec = {"heading": "", "content": "", "bullets": []}

            # grab the bold heading  (**Heading**:)
            strong = item.find("strong")
            if strong:
                sec["heading"] = strong.text.strip()
                # everything after </strong> up to first <ul/ol> is paragraph-like content
                # remove the bold part & optional colon
                raw = re.sub(r"^<strong>.*?</strong>\s*:?","", item.decode_contents(), flags=re.S)
                chunk = BeautifulSoup(raw, "html.parser")
                # first <p> becomes 'content'
                first_p = chunk.find("p")
                if first_p:
                    sec["content"] = first_p.text.strip()
                    first_p.decompose()
                # any nested list items become bullets
                for sublist in chunk.find_all(["ul","ol"]):
                    sec["bullets"].extend([li.text.strip() for li in sublist.find_all("li")])
            else:
                # fall-back: treat whole <li> as bullet of previous section if no bold header
                if out["sections"]:
                    out["sections"][-1]["bullets"].append(item.text.strip())
                continue

            out["sections"].append(sec)

    return out
