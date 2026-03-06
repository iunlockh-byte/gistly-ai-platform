import os

files_to_include = {
    "Backend API (main.py) - Core Logic Setup": ("backend/main.py", 250),
    "Frontend (App.jsx) - Main Component & State": ("src/App.jsx", 500),
    "Frontend (NewsPanel.jsx) - Core Feed Logic": ("src/NewsPanel.jsx", 250),
    "Tailwind Config": ("tailwind.config.js", 100),
    "Frontend Styling (index.css)": ("src/index.css", 100)
}

# Changed Prism theme to a light theme: default (prism.min.css) instead of twilight
html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Gistly.site - Important Codes (White Background)</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" rel="stylesheet" />
    <style>
        body { font-family: Arial, sans-serif; background: white; margin: 40px; color: black; }
        h1 { text-align: center; color: #333; }
        h2 { border-bottom: 2px solid #555; padding-bottom: 5px; margin-top: 40px; page-break-before: always; }
        h2:first-of-type { page-break-before: auto; }
        
        /* Overriding Prism base styles for purely white background on screen as well */
        pre[class*="language-"] { 
            background: #ffffff !important; 
            border: 1px solid #ddd;
            border-radius: 4px; 
            padding: 15px; 
            font-size: 11px; 
            white-space: pre-wrap; 
            word-wrap: break-word; 
            color: black !important;
        }
        
        code[class*="language-"], pre[class*="language-"] {
            text-shadow: none !important;
        }

        .trunc-msg { color: #888; font-style: italic; margin-top: 10px; display: block; }
        
        @media print {
            body { font-family: monospace; font-size: 10pt; margin: 0; background: white; color: black; }
            pre { padding: 10px; background: white !important; color: black !important; border: 1px solid #ccc; font-size: 8pt; white-space: pre-wrap; word-wrap: break-word; }
            h2 { page-break-before: always; border-bottom: 1px solid black; }
            .trunc-msg { color: #555; }
        }
    </style>
</head>
<body>
    <h1>Gistly.site - Most Important Core Architectures (White Background)</h1>
    <p style="text-align: center;">Press <b>Ctrl + P</b> (or Cmd + P) to Print and save as PDF.</p>
"""

for title, (path, max_lines) in files_to_include.items():
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # Take only the first max_lines
        is_truncated = len(lines) > max_lines
        code = "".join(lines[:max_lines])
        
        # Escape HTML tags
        code = code.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        
        if is_truncated:
            code += f"\n\n... [ CONTENT TRUNCATED TO FIRST {max_lines} LINES FOR PRINTING ] ..."
        
        lang = 'python' if path.endswith('.py') else 'javascript'
        if path.endswith('.css'):
            lang = 'css'
            
        html_content += f"<h2>{title} ({path})</h2>\n"
        html_content += f'<pre class="language-{lang}"><code class="language-{lang}">{code}</code></pre>\n'

html_content += """
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-jsx.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-css.min.js"></script>
</body>
</html>
"""

with open("Important_Codes_White_Printable.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("Generated Important_Codes_White_Printable.html")
