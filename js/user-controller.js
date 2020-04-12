'use strict';

var gCanvas;
var gCtx;
var gIsMouseDown = false;
var gSearchFilter;
var gUploadedImg;
var gIsNavBarOpen = false;


function onInit() {
    renderGallery();
    renderCategories();
    _loadFromStorage();
    renderSavedMemes();
    gCanvas = document.querySelector('.my-canvas');
    gCtx = gCanvas.getContext('2d');
    setTwoLinesPos();
}

function renderGallery() {
    var imgList = getImgList(gSearchFilter);
    var elImgList = document.querySelector('.img-list');
    var strHtml = imgList.map(img => {
        return `<img src=${img.url} data-id=${img.id} onclick="renderCanvas(${img.id})">`
    }).join('');
    elImgList.innerHTML = strHtml;
}

function onShowCurrSection(section) {
    var pages = document.querySelectorAll('.gallery , .meme-editor , .saved-memes , .about');
    pages.forEach(page => {
        if (page.classList.contains(section)) page.classList.remove('hide-element');
        else page.classList.add('hide-element');
    })
}

function renderCategories() {
    var categories = getCategories(gSearchFilter);
    var strHtml = categories.map(category => {
        return `<h2 style="font-size:${getCategoryFontSize(category) + 24}px" onclick="onFilterImages('${category}')">${category}</h2>`
    }).join('')
    document.querySelector('.categories').innerHTML = strHtml;
}

function renderSavedMemes() {
    var savedMemes = getSavedMemes();
    var idx = 0;
    if (!savedMemes) var strHtml = `There is no saved images...`;
    else var strHtml = savedMemes.map(meme => {
        return `<img src="${meme}" alt="#" onclick="onOpenModal(this,${idx++})">`
    }).join('');
    document.querySelector('.saved-memes-list').innerHTML = strHtml;
}

function renderModal(src,idx){
    var strHtml = `<img src="icons/times-circle-regular.svg" class="close-modal-btn" onclick="toggleModal()" alt="#"><img src="${src}" alt="#" ><div class="saved-img-btn-container flex justify-center"><a href="#" class="saved-img-btn" onclick="onDownloadSavedImg(this,${idx})" download="my-img.jpg">Download</a><button class="saved-img-btn" onclick="onDeleteSavedImg(${idx})">Delete</button></div>`;
    document.querySelector('.saved-memes-modal').innerHTML = strHtml;

}

function onFilterImages(key) {
    if (!key) gSearchFilter = key;
    else gSearchFilter = key.toLowerCase();
    renderCategories();
    renderGallery();
}

function renderCanvas(id) {
    displayEditor();
    resizeCanvas();
    updateImgIndex(id);
    renderCanvasImg();
    setTwoLinesPos();
    updateCanvas();
    updateInput();
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    var size = elContainer.offsetWidth < elContainer.offsetHeight ? elContainer.offsetWidth : elContainer.offsetHeight;
    gCanvas.width = size;
    gCanvas.height = size;
}

function renderCanvasImg() {
    var id = getImgId();
    if (id !== 0) {
        var img = new Image();
        img.src = `img/${id}.jpg`;
    } else var img = gUploadedImg;
    if (img.width !== img.height) {
        if (gCanvas.width > img.width && gCanvas.height > img.height) {
            gCanvas.width = img.width;
            gCanvas.height = img.height;
        } else if (img.width > img.height) {
            var imgRatio = img.width / img.height;
            gCanvas.height = gCanvas.width / imgRatio;
        } else {
            var imgRatio = img.height / img.width;
            gCanvas.width = gCanvas.height / imgRatio;
        }
    }
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
}

function displayEditor() {
    document.querySelector('.gallery').classList.add('hide-element');
    document.querySelector('.meme-editor').classList.remove('hide-element');
}

function onUpdateText(text) {
    updateText(text);
    updateCanvas();
}

function updateCanvas() {
    renderCanvasImg();
    getText();
}

function drawText(text, font, strokeColor, color, align, x, y, fontSize, currLineIdx) {
    gCtx.strokeStyle = strokeColor;
    gCtx.fillStyle = color;
    gCtx.font = font;
    gCtx.textAlign = align;
    gCtx.fillText(text, x, y);
    gCtx.strokeText(text, x, y);
    var textWidth = gCtx.measureText(text).width;
    saveLineWidth(currLineIdx, textWidth);
    if (isCurrentLine(currLineIdx)) {
        markObject(x, y, textWidth, fontSize);
    }
}

function markObject(x, y, width, height) {
    gCtx.beginPath();
    gCtx.strokeStyle = 'White';
    gCtx.rect(x - (width / 2) - 5, y - height, width + 10, height + 5);
    gCtx.stroke();
    gCtx.closePath();
}

function onAddLine() {
    addLine();
    updateInput();
    updateCanvas();
}

function onDeleteLine() {
    deleteLine();
    updateInput();
    updateCanvas();
}

function updateInput() {
    var text = getCurrentText();
    document.querySelector('.input').value = text;
}

function onIncFontSize() {
    incFontSize();
    updateCanvas();
}

function onDecFontSize() {
    decFontSize();
    updateCanvas();
}

function onChangeFont(font) {
    changeFont(font);
    updateCanvas();
}

function onChangeStrokeColor(value) {
    changeStrokeColor(value);
    updateCanvas();
}

function onChangeFillColor(value) {
    changeFillColor(value);
    updateCanvas();
}

function onDownloadCanvas(elLink) {
    removeObjectSelection();
    const data = gCanvas.toDataURL();
    elLink.href = data;
}

function onCheckElement(ev) {
    gIsMouseDown = true;
    var x = ev.offsetX;
    var y = ev.offsetY;
    isElement(x, y);
}

function stopChangePosition() {
    gIsMouseDown = false;
}

function onChangeObjectPosition(ev) {
    var x = ev.offsetX;
    var y = ev.offsetY;
    if (gIsMouseDown && isElement(x, y)) {
        changeObjectPosition(x, y);
    }
}

function onChangeObjectPositionTouch(ev) {
    ev.preventDefault();
    if (ev.touches.length !== 1) return;
    var x = ev.touches[0].clientX - ev.touches[0].target.offsetLeft;
    var y = ev.touches[0].clientY - ev.touches[0].target.offsetTop;
    if (isElement(x, y)) changeObjectPosition(x, y);
}

function onImgInput(ev) {
    var render = new FileReader();
    render.onload = function (event) {
        gUploadedImg = new Image();
        gUploadedImg.onload = function () {
            renderCanvas(0);
        }
        gUploadedImg.src = event.target.result;
    }
    render.readAsDataURL(ev.target.files[0]);
    renderCanvas(0);
}


function uploadImg(elForm, ev) {
    ev.preventDefault();
    removeObjectSelection();
    document.getElementById('imgData').value = gCanvas.toDataURL("image/jpeg");
    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-container').innerHTML = `
        <a class="share-btn" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Ready to share!  
        </a>`
    }
    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('http://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then(function (res) {
            return res.text()
        })
        .then(onSuccess)
        .catch(function (err) {
            console.error(err)
        })
}

function onSaveImg() {
    removeObjectSelection();
    const data = gCanvas.toDataURL("image/png");
    updateSavedMemes(data);
    _saveToStorage();
    displayCheckMark();
}

function displayCheckMark(){
    var elCheckMark = document.querySelector('.check-mark');
    elCheckMark.classList.remove('hide-element');
    setTimeout(function(){
        elCheckMark.classList.add('show-check-mark');
    },0);

    setTimeout(function(){
        elCheckMark.classList.remove('show-check-mark');
    },600);

    setTimeout(function(){
        elCheckMark.classList.add('hide-element');
    },800);
}

function onToggleNavBar(elBtn) {
    document.querySelector('.nav-bar').classList.toggle('show-nav-bar');
    if (!gIsNavBarOpen)
        elBtn.src = 'icons/times-solid.svg';
    else elBtn.src = 'icons/bars-solid.svg';
    gIsNavBarOpen = !gIsNavBarOpen;
}


function onOpenModal(elImg,idx){
    var imgSrc = elImg.src;
    renderModal(imgSrc,idx);
    toggleModal();
}

function toggleModal(){
    document.querySelector('.saved-memes-modal').classList.toggle('hide-element');
    document.querySelector('.screen').classList.toggle('hide-element');
}

function onDownloadSavedImg(elLink,idx){
    elLink.href = getImgSrc(idx);
}

function onDeleteSavedImg(idx){
    deleteSavedImg(idx);
    toggleModal();
}
