import os

files_to_include = {
    "Backend (API) Main Code": "backend/main.py",
    "Frontend Main Code (App.jsx)": "src/App.jsx",
    "Frontend News Panel (NewsPanel.jsx)": "src/NewsPanel.jsx",
    "Frontend Styling (index.css)": "src/index.css",
    "Tailwind Configuration": "tailwind.config.js"
}

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Gistly.site - Important Codes</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-twilight.min.css" rel="stylesheet" />
    <style>
        body { font-family: Arial, sans-serif; background: white; margin: 40px; }
        h1 { text-align: center; color: #333; }
        h2 { border-bottom: 2px solid #555; padding-bottom: 5px; margin-top: 40px; page-break-before: always; }
        h2:first-of-type { page-break-before: auto; }
        pre { background: #141414; border-radius: 8px; padding: 15px; font-size: 11px; white-space: pre-wrap; word-wrap: break-word; }
        @media print {
            body { font-family: monospace; font-size: 10pt; margin: 0; background: white; }
            pre { padding: 10px; background: white; color: black; border: 1px solid #ccc; font-size: 8pt; white-space: pre-wrap; word-wrap: break-word; }
            h2 { page-break-before: always; border-bottom: 1px solid black; }
        }
    </style>
</head>
<body>
    <h1>Gistly.site - Important Codes (API & Components)</h1>
    <p style="text-align: center;">Press <b>Ctrl + P</b> (or Cmd + P) to Print and save as PDF.</p>
"""

for title, path in files_to_include.items():
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            code = f.read()
        
        # Escape HTML tags
        code = code.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        
        lang = 'python' if path.endswith('.py') else 'javascript'
        if path.endswith('.css'):
            lang = 'css'
            
        html_content += f"<h2>{title} ({path})</h2>\\n"
        html_content += f'<pre><code class="language-{lang}">{code}</code></pre>\\n'

html_content += """
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-jsx.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-css.min.js"></script>
</body>
</html>
"""

with open("Important_Codes_Printable.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("Generated Important_Codes_Printable.html")
