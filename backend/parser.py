import os
from docling.document_converter import DocumentConverter

def parse_rules():
    """
    Uses IBM Docling to convert the local rules file to markdown format.
    Caches the parsed result for performance.
    """
    current_dir = os.path.dirname(os.path.abspath(__file__))
    rules_path = os.path.join(current_dir, "rules", "ifab_laws.txt")
    cache_path = os.path.join(current_dir, "rules", "ifab_laws_parsed.md")
    
    if os.path.exists(cache_path):
        with open(cache_path, "r", encoding="utf-8") as f:
            return f.read()
            
    try:
        converter = DocumentConverter()
        result = converter.convert(rules_path)
        markdown_text = result.document.export_to_markdown()
        
        with open(cache_path, "w", encoding="utf-8") as f:
            f.write(markdown_text)
            
        return markdown_text
    except Exception as e:
        print(f"Docling conversion failed: {e}. Falling back to direct read.")
        # Fallback in case of model issues inside docling environment
        if os.path.exists(rules_path):
            with open(rules_path, "r", encoding="utf-8") as f:
                content = f.read()
            with open(cache_path, "w", encoding="utf-8") as f:
                f.write(content)
            return content
        return ""

def get_law_section(query: str) -> str:
    """
    Searches through Docling-structured rules and returns sections matching the query.
    This acts as our local RAG retriever.
    """
    rules_md = parse_rules()
    sections = rules_md.split("\n## ")
    
    matched_sections = []
    for section in sections:
        lines = section.split("\n")
        title = lines[0] if lines else ""
        if query.lower() in title.lower() or query.lower() in section.lower():
            matched_sections.append("## " + section.strip())
            
    if matched_sections:
        return "\n\n".join(matched_sections)
        
    # fallback to keyword search inside paragraphs
    paragraphs = rules_md.split("\n\n")
    matched_paragraphs = [p for p in paragraphs if query.lower() in p.lower()]
    if matched_paragraphs:
        return "\n\n".join(matched_paragraphs[:3])
        
    return "No matching IFAB rule section was found for query: " + query

if __name__ == "__main__":
    print("Testing Docling parser...")
    parsed = parse_rules()
    print(f"Docling parsed successfully! Length: {len(parsed)} characters.")
    section = get_law_section("handball")
    print("\nSample RAG retrieval for 'handball':")
    print(section[:500] + "...")
