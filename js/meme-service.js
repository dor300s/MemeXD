'use strict';

const KEY = 'saved-memes';
var gSavedMemes = [];

var gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'First Line',
            size: 40,
            font: 'IMPACT',
            align: 'center',
            strokeColor: 'Black',
            color: 'white',
            positionX: 0,
            positionY: 0,
            textLength: 0
        },
        {
            txt: 'Second Line',
            size: 40,
            font: 'IMPACT',
            align: 'center',
            strokeColor: 'Black',
            color: 'white',
            positionX: 0,
            positionY: 0,
            textLength: 0
        },
    ]
}

function createLine() {
    gMeme.lines.push({
        txt: '',
        size: 40,
        font: 'IMPACT',
        align: 'center',
        strokeColor: 'Black',
        color: 'White',
        positionX: gCanvas.width / 2,
        positionY: gCanvas.height / 2,
        textLength: 0
    })
}

var gKeywords = { 'happy': 0, 'animals': 0, 'mad': 0, 'baby': 0, 'old': 0, 'cartoon': 0 };

var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['mad', 'old'] },
    { id: 2, url: 'img/2.jpg', keywords: ['animals'] },
    { id: 3, url: 'img/3.jpg', keywords: ['animals', 'baby'] },
    { id: 4, url: 'img/4.jpg', keywords: ['animals'] },
    { id: 5, url: 'img/5.jpg', keywords: ['mad', 'baby'] },
    { id: 6, url: 'img/6.jpg', keywords: ['happy', 'old'] },
    { id: 7, url: 'img/7.jpg', keywords: ['baby'] },
    { id: 8, url: 'img/8.jpg', keywords: ['happy', 'old'] },
    { id: 9, url: 'img/9.jpg', keywords: ['happy', 'baby'] },
    { id: 10, url: 'img/10.jpg', keywords: ['happy', 'old'] },
    { id: 11, url: 'img/11.jpg', keywords: ['mad', 'old'] },
    { id: 12, url: 'img/12.jpg', keywords: ['old'] },
    { id: 13, url: 'img/13.jpg', keywords: ['happy'] },
    { id: 14, url: 'img/14.jpg', keywords: ['old'] },
    { id: 15, url: 'img/15.jpg', keywords: ['old'] },
    { id: 16, url: 'img/16.jpg', keywords: ['happy', 'old'] },
    { id: 17, url: 'img/17.jpg', keywords: ['old'] },
    { id: 18, url: 'img/18.jpg', keywords: ['happy', 'cartoon'] },
    { id: 19, url: 'img/19.jpg', keywords: ['mad', 'old'] },
    { id: 20, url: 'img/20.jpg', keywords: ['cartoon'] },
    { id: 21, url: 'img/21.jpg', keywords: ['old'] },
    { id: 22, url: 'img/22.jpg', keywords: ['happy', 'baby'] },
    { id: 23, url: 'img/23.jpg', keywords: ['mad', 'old'] },
    { id: 24, url: 'img/24.jpg', keywords: ['animals'] },
    { id: 25, url: 'img/25.jpg', keywords: ['happy', 'old'] },
];

function setTwoLinesPos() {
    gMeme.lines[0].positionX = gCanvas.width / 2;
    gMeme.lines[0].positionY = gMeme.lines[0].size;
    gMeme.lines[1].positionX = gCanvas.width / 2;
    gMeme.lines[1].positionY = gCanvas.height - (2 * gMeme.lines[1].size);
}

function getImgList(filter) {
    var imgList = gImgs.slice();
    if (filter) {
        imgList = imgList.filter(img => {
            return img.keywords.join().includes(filter);
        });
        if (gKeywords[filter] >= 0 && gKeywords[filter] <= 50) gKeywords[filter] += 2;
    }
    return imgList;
}

function getCategories(filter) {
    var categories = Object.keys(gKeywords);
    if (filter) {
        categories = categories.filter(category => {
            return category.includes(filter);
        });
    }
    return categories;
}

function getCategoryFontSize(category) {
    return gKeywords[category];
}

function getSavedMemes(){
    if(!gSavedMemes || !gSavedMemes.length) return;
    var memeList = gSavedMemes.slice();
    return memeList;   
}

function updateImgIndex(id) {
    gMeme.selectedImgId = id;
}

function getImgId() {
    return gMeme.selectedImgId;
}

function updateText(text) {
    if (!gMeme.lines.length) addLine();
    gMeme.lines[gMeme.selectedLineIdx].txt = text;
}

function getText() {
    gMeme.lines.forEach((line, idx = 0) => {
        var font = line.size + 'px ' + line.font;
        drawText(line.txt, font, line.strokeColor, line.color, line.align, line.positionX, line.positionY + line.size, line.size, idx++);
    })
}


function addLine() {
    createLine();
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function deleteLine() {
    if (gMeme.selectedLineIdx !== -1) gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    if (gMeme.selectedLineIdx > 0) gMeme.selectedLineIdx--;
}

function getCurrentText() {
    if (gMeme.selectedLineIdx !== -1 && gMeme.lines.length !== 0) return gMeme.lines[gMeme.selectedLineIdx].txt;
    else return '';
}

function incFontSize() {
    if (gMeme.selectedLineIdx === -1) return;
    gMeme.lines[gMeme.selectedLineIdx].size += 5;
}

function decFontSize() {
    if (gMeme.selectedLineIdx === -1) return;
    gMeme.lines[gMeme.selectedLineIdx].size -= 5;
}

function changeFont(font) {
    if (gMeme.selectedLineIdx === -1) return;
    gMeme.lines[gMeme.selectedLineIdx].font = font;
}

function changeStrokeColor(value) {
    if (gMeme.selectedLineIdx === -1) return;
    gMeme.lines[gMeme.selectedLineIdx].strokeColor = value;
}

function changeFillColor(value) {
    if (gMeme.selectedLineIdx === -1) return;
    gMeme.lines[gMeme.selectedLineIdx].color = value;
}

function isCurrentLine(currlineIdx) {
    return (gMeme.selectedLineIdx === currlineIdx);
}

function removeObjectSelection() {
    gMeme.selectedLineIdx = -1;
    updateCanvas();
    updateInput();
}

function saveLineWidth(currLineIdx, textWidth) {
    gMeme.lines[currLineIdx].textLength = textWidth;
}

function isElement(x, y) {
    var selectedMemeId = gMeme.lines.findIndex(line => {
        return x > (line.positionX - line.textLength / 2) && x < (line.positionX + line.textLength / 2) && y > line.positionY && y < (line.positionY + line.size)
    });
    if (selectedMemeId !== -1) {
        gMeme.selectedLineIdx = selectedMemeId;
        updateCanvas();
        updateInput();
        return true;
    } else removeObjectSelection();
}

function changeObjectPosition(x, y) {
    gMeme.lines[gMeme.selectedLineIdx].positionX = x;
    gMeme.lines[gMeme.selectedLineIdx].positionY = y - gMeme.lines[gMeme.selectedLineIdx].size / 2;
    updateCanvas();
}

function updateSavedMemes(data){
    gSavedMemes.push(data);
    renderSavedMemes();
}

function _saveToStorage(){
    saveToStorage(KEY, gSavedMemes);
}

function _loadFromStorage(){
    var savedMemes = loadFromStorage(KEY);
    if(!savedMemes || !savedMemes.length) return;
    gSavedMemes = savedMemes;
}

function getImgSrc(idx){
    return gSavedMemes[idx];
}

function deleteSavedImg(idx){
    gSavedMemes.splice(idx,1);
    _saveToStorage();
    renderSavedMemes();
}