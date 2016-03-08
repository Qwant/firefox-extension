
var meta = document.querySelector('meta[name="description"]');
if (meta) {
    if (meta.hasAttribute('content')) {
        self.port.emit("tab-meta-info", { description: meta.getAttribute('content') });
    }
}
