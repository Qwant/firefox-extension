/**
 * @file contextMenuScript.js
 * @author Qwant
 */
self.on('context', function(node){
	self.postMessage(node.href);
});

