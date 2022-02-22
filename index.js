let arr;

let field = document.getElementById('gamefield');

let odd;
let shift = 7;
let oddColumns;
let row;
let emptySpace;
let limit = true;

let count;
let flagCount;
let bombSize;
let flagCounter = document.getElementById('flag');

let time;
let timeDiv = document.getElementById('time');

let size;

let pause;
let game;
let option;

let mes = document.getElementsByClassName('alert')[0];
let blackout = document.getElementById('windowBlackout');

let preview = document.getElementsByClassName("preview")[0];

let btnStart = document.getElementsByClassName('btn')[0];
btnStart.onclick = () => {
    let inputValue = parseInt(document.getElementsByClassName("length")[0].value);
    SizeChekAlert(inputValue);
};

let btnOption = document.getElementsByClassName("optionButton")[0];
btnOption.onclick = () => {
    let optionField = document.getElementsByClassName("option")[0];
    (option)? optionField.style.display = "none":
              optionField.style.display = "flex";
    option = !option;
}

let btnRestart = document.getElementsByClassName("btnOption")[0];
btnRestart.onclick = () => {
    let inputValue = parseInt(document.getElementsByClassName("lengthOption")[0].value);
    SizeChekAlert(inputValue);
}

let btnsLimit = document.getElementsByClassName('setLimit');
for (let btnLimit of btnsLimit) 
{
    btnLimit.onclick = ()=>{
        (limit)? btnLimit.classList.add('setLimitYes'):btnLimit.classList.remove('setLimitYes');
        limit=!limit;
    }
}

function SizeChekAlert(i) {
    if (i>1000)  
    {   blackout.classList.add('blackout');
        mes.children[0].innerHTML = '<span>FIELD SIZE IS TOO LONG,<br>ARE YOU SURE?</span>';
        mes.style.display = 'grid';
        mes.children[1].onclick = () =>
        {
            blackout.classList.remove('blackout');
            mes.style.display = 'none';
            createGame(i);
            preview.style.display = 'none';
        }
        mes.children[2].onclick = () =>
        {
            blackout.classList.remove('blackout');
            mes.style.display = 'none';
        }
 
    }
    else {
        btnStart.parentElement.parentElement.style.display = 'none';
        createGame(i);
    }
}

function createGame(i) {
    initPar()
    size = i;
    shift = Math.floor(Math.sqrt(size)) - 1;
    if (shift>=18 && limit) shift = 17;
    oddColumns = !(shift%2);
    field.style.gridTemplateColumns = `repeat(${shift+1}, 1fr)`
    createSize();
    createElementsThisSize();
    field.classList.add('border')
    field.addEventListener('select',(e)=> e.preventDefault())
}

function initPar() {
    
    arr = [];
    
    field.innerHTML = '';
    field.textContent= '';
    
    odd = false;
    //shift = 7;
    oddColumns = false;
    emptySpace = 0;
    limit = true;
    
    row = 0;
    count = 1;
    flagCount = 0;
    bombSize = 1000;
    flagCounter.innerText = `BOMBS TAGGET: 0`;
    
    time = [0,0,0,0];
    timeDiv.innerText = `TIME ${time[0]}${time[1]}:${time[2]}${time[3]}`;
    
    size = 128;
    
    pause = false;
    game = false;
    option = false;

    mes.style.display = 'none';
}

function createSize() {

    let oddPar = shift;

    for (let i = 0; i < size; i++)
    { 
        arr.push({in:0,row:row,visible:false,odd:odd,flag:false});

        if (i == oddPar) 
        {
            oddPar+=shift+1;
            row++;
            if (oddColumns) odd = !odd;
        }
        else 
        {
            odd = !odd;
        }
    }

    emptySpace =  (oddPar - size);

}

function createElementsThisSize() {
    for (let i = 0; i < size; i++)
{  
    let cell = document.createElement('div');
    cell.classList.add('cell');

    let closed = document.createElement('div');
    //(arr[i].odd) ? (cell.classList.add('odd'),cell.classList.add('oddClosed')) 
    //: (cell.classList.add('closed'));


    (arr[i].odd) ? (cell.classList.add('odd'),closed.classList.add('OddcellClosed')) 
    : (closed.classList.add('cellClosed'));

    cell.appendChild(closed);

    cell.addEventListener('click',()=> {
        if (!pause) {
            console.log(count);
            if (game ) {
                if (!arr[i].visible)
                    count++;
                    return OpenCells(i);
                }
            else {
                return startGame(i);
            }   
        }
    });

    cell.addEventListener('contextmenu',(e)=>{
        e.preventDefault();
        if (arr[i].visible==false)
        {
            let flag = cell.querySelector("div");

            (!arr[i].flag) ?(flag.classList.add('cross'),cell.classList.add('zFix'),flagCount++):
                            (flag.classList.remove('cross'),cell.classList.remove('zFix'),flagCount--);
            flagCounter.innerText = `BOMBS TAGGET: ${flagCount}`;
            arr[i].flag = !arr[i].flag;
        }
    })

    field.appendChild(cell);
}

if (emptySpace!= shift) {
for (let emptiness = 0; emptiness <= emptySpace; emptiness++)
        {
            let noCell = document.createElement('div');
            noCell.className = 'nonCell';
            field.appendChild(noCell);
        }
    }
}


function startGame(i) {

    randomBomb(i);
    alg(filtration);
    setArea()
    OpenCells(i);
    game = true;
    setTime();
}

function setTime() {
    let timeId = setInterval(() => {
        if (game && !pause) {
        time = addOneSecond(time);
        timeDiv.innerText = `TIME ${time[0]}${time[1]}:${time[2]}${time[3]}`;
        }
        else {
            clearInterval(timeId);
        }
    }, 1000);
}

function addOneSecond(arr,i=arr.length-1,maxVal=9) {
    if (arr[i]<maxVal)
    {
        arr[i]++;
        return arr;
    }
    else if (i<1)
    {   arr[i] = 0;
        return arr;
    }
    else 
    {
        arr[i]=0;
        if (maxVal==9)
            return addOneSecond(arr,i-1,5)
        return addOneSecond(arr,i-1)
    }
}

function setArea()
{  
    for (let i = 0; i <size;i++)
    {   
        if (arr[i].in == 10)
        {   let bomb = document.createElement('div');
            bomb.classList.add('bomb'); 

            field.children[i].appendChild(bomb);
            continue;
        }
        field.children[i].innerHTML += inPutNumbInCell(i);
    }
}

function inPutNumbInCell(i) {
    switch (arr[i].in) {
        case 0:
            return `<span class="inside numbZero">0</span>`;
        case 1:
            return `<span class="inside numbOne">1</span>`;
        case 2:
            return `<span class="inside numbTwo">2</span>`;
        case 3:
            return `<span class="inside numbThree">3</span>`;
        case 4:
            return `<span class="inside numbFour">4</span>`;
        case 5:
            return `<span class="inside numbFive">5</span>`;
        case 6:
            return `<span class="inside numbSix">6</span>`;
        case 7:
            return `<span class="inside numbSeven">7</span>`;
        case 8:
            return `<span class="inside numbEigh">8</span>`;
    }
}


function OpenCells(index) {
    //arr[index].visible = true;
    //(arr[index].odd) ? field.children[index].children[0].remove():
    //                   field.children[index].classList.remove('closed');

    //field.children[index].children[0].remove();
    DeleteClosedDiv(index);
    //field.children[index].classList.remove('flag')

    if (arr[index].in === 0)
    {
    let array = cellsAround(index);
    filtration(array,index,ContinueСycle);
    }
    else if (arr[index].in=== 10)
    {   game = false;
        pause = true;

        let promise1 = new Promise((resolve) => {

            let bomb = field.children[index].querySelector('.bomb');
            let light = document.createElement('div');
            light.classList.add('bombLight');
            bomb.appendChild(light);
            bomb.classList.add('bombAnimation');
            setTimeout(() => {
                resolve();
              }, 3100);
          });
          
          promise1.then(() => {
            Explosion(index);
          });

        return
    }
        victoryChek();
        return
}

function ContinueСycle(i)
{ 
    if (!arr[i].visible) {
        if ((arr[i].in === 0))
        {
            OpenCells(i);
        }
        count++;
        DeleteClosedDiv(i);
        //(arr[i].odd) ? field.children[i].classList.remove('oddClosed'):
        //           field.children[i].classList.remove('closed');
        //field.children[i].classList.remove('flag')
    }
}

function DeleteClosedDiv(i) {
    arr[i].visible = true;
    if (arr[i].flag) {
    arr[i].flag = false;
    flagCount--;
    flagCounter.innerText = `BOMBS TAGGET: ${flagCount}`;
    }
    let cell = field.children[i];
    cell.classList.remove('zFix');

    let closed = cell.querySelector("div");
    if (closed) closed.remove();
}


function random(min,max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function chekCell(array,i)
 {
    let indexB = random(0,size);
    if  (array.includes(indexB) || startPosition(i).includes(indexB))
            return chekCell(array,i);
    array.push(indexB);
    return array;

 }

function CreateBombs(numb,i)
{
    let bombPlace = [];
    while (numb)
    {
        bombPlace = chekCell(bombPlace,i);
        numb --;
    }

    for (let i = 0; i < bombPlace.length;i++)
    {  
        arr[bombPlace[i]].in = 10;
    }

}

function randomBomb(i) {
    let twelveAndHalfPercent = Math.floor(size/8);
    let fifteenPercent = Math.floor(twelveAndHalfPercent*1.2);
    bombSize = random(twelveAndHalfPercent,fifteenPercent);
    CreateBombs(bombSize,i);
}

function alg(func) {
    for (let i =0;i < arr.length; i++)
    {   if (arr[i].in===10) {
            let arrOfChosen = cellsAround(i);
            func(arrOfChosen,i,BombAroundCell);
            }
    }
}

function cellsAround(i) {
    return [i-shift-2,i-shift-1,i-shift,i-1,i+1,i+shift,i+shift+1,i+shift+2];
}

function Bordercells(i)
{
    return [i-shift,i-1,i+1,i+shift];
}

function startPosition(i)
{
    return [i-shift-2,i-shift-1,i-shift,i-1,i+1,i+shift,i+shift+1,i+shift+2,i];
}

function filtration(array,index,func,cross) {

    for (let i=0;i<array.length;i++)
    {   
        if (filterIfinArray(array[i],index,i,chekRows,cross))
        {  
            func(array[i]);
        }
    }
}

function filterIfinArray(Numb,index,lastIndex,func,cross = 0) {
    return ((Numb >= 0 && Numb < size && arr[Numb].in != 10) 
	   && func(Numb,index,lastIndex,cross))
}

function chekRows(Numb,index,lastIndex,cross) {
    return (((lastIndex<3-cross) && arr[Numb].row == arr[index].row - 1) ||
    ((lastIndex>2-cross) && (lastIndex<5-cross) && arr[Numb].row == arr[index].row) ||
    ((lastIndex>4-cross) && arr[Numb].row == arr[index].row + 1))
}

function BombAroundCell(i) {
    arr[i].in++;
}

function victoryChek() {
    if (count === arr.length - bombSize)
    {   count = -Infinity;
        game = false;
        pause = true;
        mes.children[0].innerHTML = '<span>MISSION COMPLETED<br>RETURN TO MENU?</span>';
        returnMenu();
    }
}

function Explosion(i) {
        count--;
        let noCell = document.createElement('div');
        field.replaceChild(noCell,field.children[i])  
        noCell.className = 'nonCell';
        mes.children[0].innerHTML = '<span>MISSION FAILED<br>RETURN TO MENU?</span>';
        returnMenu();
}

function returnMenu() {
    blackout.classList.add('blackout');
    mes.style.display = 'grid';
        mes.children[1].onclick = () =>
        {
            mes.style.display = 'none';
            blackout.classList.remove('blackout');
            initPar();
            preview.style.display = 'flex';
        }
        mes.children[2].onclick = () =>
        {
            blackout.classList.remove('blackout');
            game = true;
            pause = false;
            mes.style.display = 'none';
            setTime();
        }
}
