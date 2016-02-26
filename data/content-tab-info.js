
var meta = document.querySelector('meta[name="description"]');
if (meta) {
    if (meta.hasAttribute('content')) {
console.log('meta info '+meta.getAttribute('content'));
        self.port.emit("tab-meta-info", { description: meta.getAttribute('content') });
    }
}

