var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var map = [];

// inicializační data
var width = document.getElementById("cellsX").value;
var height = document.getElementById("cellsY").value;
var cellSize = 20;
var generation = 0;
var isAutomate = false;
var fps = document.getElementById("fps").value;
var now;
var then = Date.now();
var interval = 1000 / fps;
var delta;

// event listenery
canvas.addEventListener('click', onCanvasClick, false);

// buňka
function Cell(x, y) {
    this.x = x;
    this.y = y;
    this.size = cellSize;
    this.isAlive = false;

    // vykreslení buňky
    this.draw = function() {
        ctx.beginPath();
        ctx.rect(this.x * this.size, this.y * this.size, this.size, this.size);
        ctx.strokeStyle = "#000";
        ctx.stroke();
        ctx.closePath();

        if (this.isAlive) {
            ctx.fillStyle = "#000";
        } else {
            ctx.fillStyle = "#f3f3f3";
        }

        ctx.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
        ctx.stroke();
    }
}

// zjistí, jak velký prostor je k dispozici pro canvas a podle toho nastaví jeho velikost
// + pokud bylo v canvasu něco nakresleno, tak to smaže
function prepareCanvas() {
    // zjistí kolik místa je k dispozici
    var main = document.getElementById("main");
    width = document.getElementById("cellsX").value;
    height = document.getElementById("cellsY").value;

    // zjistí, jak velké musí být buňky, aby se všechny vešly na plán
    var fooX = Math.floor(main.offsetWidth / width);
    var fooY = Math.floor(main.offsetHeight / height);
    
    // buňky jsou čtvercové, proto je třeba použít menší velikost
    if (fooX < fooY) {
        cellSize = fooX;
    } else {
        cellSize = fooY;
    }

    // nastaví velikost canvasu a smaže jej
    canvas.style.width = (cellSize * width) + "px";
    canvas.style.height = (cellSize * height) + "px";
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// po načtení mapy ze souboru připraví canvas podle těchto načtených dat
function loadCanvas() {
    prepareCanvas();

    // projde mapu a vytvoří buňky
    var foo = [];
    for (var i = 0; i < width; i++) {
        var temp = [];
        for (var j = 0; j < height; j++) {
            temp[j] = new Cell(i, j);

            // dle načtených dat nastaví, že je buňka živá/mrtvá
            if (map[i][j] == 1) {
                temp[j].isAlive = true;
            } else {
                temp[j].isAlive = false;
            }
        }
        foo[i] = temp;
    }
    // předá připravenou mapu
    map = foo;

    // resetuje počítadlo generací a předá mapu k animaci
    generation = 0;
    animate();
}

// vytvoření a vykreslení náhodného pole
function loadRandomCanvas() {
    prepareCanvas();
    var foo;
    
    // projde mapu a vytvoří buňky
    for (var i = 0; i < width; i++) {
        var temp = [];
        for (var j = 0; j < height; j++) {
            temp[j] = new Cell(i, j);

            // náhodně určí, zda má být buňka živá/mrtvá
            foo = Math.random() >= 0.6;

            if (foo) {
                temp[j].isAlive = true;
            } else {
                temp[j].isAlive = false;
            }
        }
        map[i] = temp;
    }

    // resetuje počítadlo generací a předá mapu k animaci
    generation = 0;
    animate();
}

// standardní inicializace mapy (pouze mapu vyčistí)
function initializeMap() {
    prepareCanvas();
    for (var i = 0; i < width; i++) {
        var temp = [];
        for (var j = 0; j < height; j++) {
            temp[j] = new Cell(i, j);
        }
        map[i] = temp;
    }
    generation = 0;
}

// obsloužení kliknutí na canvas
function onCanvasClick(ev) {
    // vypočte pozici
    var xPos = ev.clientX - canvas.offsetLeft;
    var yPos = ev.clientY - canvas.offsetTop;
    // předá událost k obsloužení pro příslušnou buňku
    getClickedCell(xPos, yPos);
}

// obsloužení kliknutí na příslušnou buňku = změna jejího stavu
function getClickedCell(xPos, yPos) {
    // hledání příslušné buňky
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            cell = map[i][j];
            // je-li nalezena správná buňka -> změna jejího stavu
            if ((xPos >= cell.x * cell.size && xPos < cell.x * cell.size + cell.size)
            && (yPos >= cell.y * cell.size && yPos < cell.y * cell.size + cell.size)) {
                cell.isAlive = !cell.isAlive;
            }
        }
    }
}

// funkce vracející počet živých sousedů konrétní buňky
function getNeighbours(cell) {
    neighboursCount = 0;
    var x = cell.x;
    var y = cell.y;

    if (x > 0 && map[x - 1][y].isAlive) {
        neighboursCount++;
    }
    if (x < width - 1 && map[x + 1][y].isAlive) {
        neighboursCount++;
    }
    if (y < height - 1 && map[x][y + 1].isAlive) {
        neighboursCount++;
    }
    if (y > 0 && map[x][y - 1].isAlive) {
        neighboursCount++;
    }
    if (x > 0 && y > 0 && map[x - 1][y - 1].isAlive) {
        neighboursCount++;
    }
    if (x < width - 1 && y > 0 && map[x + 1][y - 1].isAlive) {
        neighboursCount++;
    }
    if (y < height - 1 && x > 0 && map[x - 1][y + 1].isAlive) {
        neighboursCount++;
    }
    if (x < width - 1 && y < height - 1 && map[x + 1][y + 1].isAlive) {
        neighboursCount++;
    }

    return neighboursCount;
}

// vykreslení celé mapy (volá vykreslení jednotlivých buněk)
function drawCells(){
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            map[i][j].draw();
        }
    }
}

// funkce starající se o animaci v případě automatické simulace
function animate() {
    requestAnimationFrame(animate);
    now = Date.now();
    delta = now - then;
    fps = document.getElementById("fps").value
    interval = 1000 / fps;
    // je-li čas na výpočet dalšího kroku -> vypočti ho
    if (delta > interval) {
        then = now - (delta % interval);
        if (isAutomate) {
            applyRules();
        }
        drawCells();
        document.getElementById("generationSpan").textContent = generation;
    }
}

// funkce pro obsluhu tlačítka pro automatický běh
function automate() {
    isAutomate = !isAutomate;
    if (isAutomate) {
        document.getElementById("startstop").value="Stop";
    } else {
        document.getElementById("startstop").value="Start";
    }
}

// funkce obsahující sadu pravidel pro přežití/úmrtí buňky na plánu
function applyRules() {
    // dočasná mapa (nemůžeme si přepisovat data, když s nimi ještě budeme počítat)
    var temporaryMap = [];

    // naplní dočasnou mapu buňkami
    for (var i = 0; i < width; i++) {
        var temp = [];
        for (var j = 0; j < height; j++) {
            temp[j] = new Cell(i, j);
        }
        temporaryMap[i] = temp;
    }

    // projde všechny buňky v současné mapě
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            cell = map[i][j];

            // aplikuje pravidla a určí, zda má buňka změnit stav, nebo ne
            neighbours = getNeighbours(cell);
            if (neighbours < 2) {
                temporaryMap[i][j].isAlive = false;
            }
            if (cell.isAlive && (neighbours == 3 || neighbours == 2)) {
                temporaryMap[i][j].isAlive = true;
            }
            if (neighbours > 3) {
                temporaryMap[i][j].isAlive = false;
            }
            if (neighbours == 3) {
                temporaryMap[i][j].isAlive = true;
            }
        }
    }

    // nakonec předá nový stav do proměnné mapy
    map = temporaryMap;
    // zvýší počítadlo generace
    generation++;
}

// handler pro drag'n'drop pole pro načtení mapy
function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files;
    var reader = new FileReader();
    reader.onload = function(event) {            
        loadMapFromFile(event.target.result);
    }        
    reader.readAsText(files[0],"UTF-8");
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
}

// načtení dat z mapy
function loadMapFromFile(data) {
    // parsování po řádcích
    var cols = parseInt(data.split('\n')[0]);

    // je v souboru uveden validní rozměr?
    if ((cols <= 200) && (cols >= 5)) {
        document.getElementById("cellsX").value = cols;

        var rows = parseInt(data.split('\n')[1]);

        // je v souboru uveden validní rozměr?
        if ((rows <= 200) && (rows >= 5)) {
            document.getElementById("cellsY").value = rows;

            // jesou-li rozměry validní, načti mapu
            for(var i = 2; i < rows + 2; i++) {
                for(var j = 0; j < cols; j++) {
                    map[j][i-2] = parseInt(data.split('\n')[i].charAt(j));
                }
            }

            // příprava canvasu
            loadCanvas();
        }
    }
}

// příprava drag'n'drop a posluchače
var dropZone = document.getElementById('dropzone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);

// příprava aplikace na běh
initializeMap();
animate();


// audiopřehrávač
$(document).ready(function () {
    init();

    function init(){
        var current = 0;
        var audio = $('#audio');
        var playlist = $('#playlist');
        var tracks = playlist.find('li a');
        var len = tracks.length - 1;
        audio[0].volume = .10;
        //audio[0].play();

        playlist.on('click','a', function(e){
            e.preventDefault();
            link = $(this);
            current = link.parent().index();
            run(link, audio[0]);
        });

        audio[0].addEventListener('ended',function(e){
            current++;
            if(current == len){
                current = 0;
                link = playlist.find('a')[0];
            }else{
                link = playlist.find('a')[current];    
            }
            run($(link),audio[0]);
        });
    }

    function run(link, player){
            player.src = link.attr('href');
            par = link.parent();
            par.addClass('active').siblings().removeClass('active');
            player.load();
            player.play();
    }
});