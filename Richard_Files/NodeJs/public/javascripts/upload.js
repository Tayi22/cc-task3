function stopDefault(event) {
            event.preventDefault();
            event.stopPropagation();
        }
function dragOver(label, text) {

	label.style.animationName = "dropbox";
    label.innerText = text;
}
function dragLeave(label) {

	var len = label.style.length;
    for(var i = 0; i < len; i++) {
		label.style[label.style[i]] = "";
    }
    label.innerText = "Click to choose images or drag-n-drop them here";
}
function addFilesAndSubmit(event) {
    var files = event.target.files || event.dataTransfer.files;
    document.getElementById("filesfld").files = files;
    submitFilesForm(document.getElementById("filesfrm"));
}
function submitFilesForm(form) {
    var label = document.getElementById("fileslbl");
    dragOver(label, "Uploading Data...");
    var fd = new FormData();
    for(var i = 0; i < form.filesfld.files.length; i++) {
        var field = form.filesfld;
        fd.append(field.name, field.files[i], field.files[i].name);
    }
    var x = new XMLHttpRequest();
    x.onreadystatechange = function () {
        if(x.readyState == 4) {
            form.filesfld.value = "";
            dragLeave(label); 
            if(x.status == 200) {
                document.getElementById("finished").innerHTML = "Finished Uploading.";
            }
            else {
                document.getElementById("finished").innerHTML = "Error";
            }
        }
    };
    x.open("post", form.action, true);
    x.send(fd);
    return false;
}