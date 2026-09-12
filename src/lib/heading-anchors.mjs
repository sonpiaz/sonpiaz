export function headingId(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

export default function headingAnchors() {
  return function transform(tree) {
    const used = new Set();
    const text = node => node.type === 'text' ? node.value : (node.children || []).map(text).join('');
    function visit(node) {
      if (node.type === 'element' && ['h2', 'h3'].includes(node.tagName)) {
        const base = node.properties?.id || headingId(text(node));
        let id = base;
        let suffix = 1;
        while (used.has(id)) id = `${base}-${suffix++}`;
        used.add(id);
        node.properties = { ...node.properties, id };
        node.children.push({ type: 'element', tagName: 'a', properties: { href: `#${id}`, className: ['heading-anchor'], ariaLabel: `Link to ${text(node)}` }, children: [{ type: 'text', value: ' #' }] });
      }
      for (const child of node.children || []) visit(child);
    }
    visit(tree);
  };
}
