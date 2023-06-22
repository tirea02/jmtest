//전역변수 사용하지 않게 js class를 이용한 대대적인 refactoring 예정 


let currentBoard;
let answerBoard;
let blankPos;
let checkFirst;


const initPictureToArray = function(width){ // 이렇게 하기보다 object로 만들어서 tile.index, tile.src, ...etc 했으면 좀더 깔끔했을것 같다.
    let pictureArr = [];

    for(let i=0; i<width*width; i++){
        // let srcName = "./images/";
        // srcName += i;
        // srcName += ".gif";
        // srcName += `|tile${i}`
        let srcName = `./images/${width}-cat${i}.gif|tile${i}`
        pictureArr.push(srcName);
    }

    answerBoard = JSON.parse(JSON.stringify(pictureArr)); //make deepCopy
   
    return pictureArr;
}


const renderBoard = function(width, pictureArr){

    let boardText ="";
    let src ="";
    let id = "";

    for(let i=0; i< pictureArr.length; i++){
        [path, id] = pictureArr[i].split('|');
        id += `|pos${i}`
        if(i%width === 0){
            boardText +=`<br>`;
        }
        if(pictureArr[i]==="./images/blank.gif"){
            boardText += ` <img class="tile" id="blank" src="${path}" >`;
        }else{
        boardText += ` <img class="tile" id="${id}" src="${path}" >`;
        }
    }
   
    document.getElementById("output").innerHTML = boardText;
    addEvent();

    return [width,pictureArr];

}


const setNewBoard = function(width,pictureArr){
    let ret;
    ret = renderBoard(width,pictureArr);
     
    return ret; 
}
const getRandomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
  }



const mixBoard = function([width, pictureArr]){    // board는 srcName(ex  0,1,2,)을 값으로 가지는 배열이다.
    console.log(`=====================`);
    console.log(`mixBoard called`);
    let randomNumber =0;
    randomNumber = getRandomInt(0, width*width);
    blankPos = randomNumber; //전역변수를 사용하는건 굉장히 안좋은 행동입니다.

    pictureArr.sort(()=> Math.random() - Math.random()); //sort
    [path, id] = pictureArr[blankPos].split('|');
    let tileNum = id.substring(4);  //remove "tile" 
  
    if(checkFirst && isPuzzleSolvable(width, pictureArr, blankPos)===false){ // 알고리즘 통과하지 못하면 call init
        console.log(`this puzzle can't solved don't worry we will automaticaly redo the process`);
        reRollBoard(width);  // recall mixBoard
    }else{
    //code fixed 
    pictureArr[blankPos] = "./images/blank.gif";
    answerBoard[tileNum] = "./images/blank.gif";

    checkFirst =false; 
    currentBoard = renderBoard(width,pictureArr);

    return [width, pictureArr];
    }

}

const handleClick = function(event){
    const tile = this;
    let selectedId = tile.id;
    let temp = tile.id.split('|');
    temp = temp[1];
    let selectedIndex =temp.substring(3);
    console.log(`selectedIndex : ${selectedId}`);
   
  //  console.log(currentBoard);
    moveTile(selectedIndex, currentBoard);
   
}


const moveTile = function(selectedIndex, [width,pictureArr]){
    if(isAdjacent(selectedIndex, blankPos, width)){ // 인접한지 체크후 타일 교환
       let temp = pictureArr[blankPos];
       pictureArr[blankPos] = pictureArr[selectedIndex];
       pictureArr[selectedIndex] = temp;
       blankPos = selectedIndex;
       if(JSON.stringify(pictureArr) === JSON.stringify(answerBoard)){
        console.log(`정답입니다.`)
        alert("정답입니다.");
       }
      
       renderBoard(width, pictureArr)
    }
   
}

const addEvent = function(){
    tiles = document.getElementsByClassName("tile") ;
    for ( i of tiles){
        i.removeEventListener("click", handleClick);
        i.addEventListener("click", handleClick);
    }

}

const isAdjacent = function(selectedIndex, blankPos, width) {
    const selectedRow = Math.floor(selectedIndex / width);
    const selectedCol = selectedIndex % width;
    const blankRow = Math.floor(blankPos / width);
    const blankCol = blankPos % width;
  
    // Check if the selected tile is adjacent to the blank tile
    return (
      (Math.abs(selectedRow - blankRow) === 1 && selectedCol === blankCol) ||
      (Math.abs(selectedCol - blankCol) === 1 && selectedRow === blankRow)
    );
  };

  const isPuzzleSolvable = function(width, pictureArr, blankPos) {
    let inversions = 0;
    let blankRow = Math.floor(blankPos / width);
  
    // Set blank tile in pictureArr
    pictureArr[blankPos] = "./images/blank.gif";
  
    // Step 1: Count inversions
    for (let i = 0; i < pictureArr.length - 1; i++) {
      const tileValue = parseInt(pictureArr[i].split('tile')[1], 10);
      console.log(`tileValue +${tileValue}`);
      for (let j = i + 1; j < pictureArr.length; j++) {
        const nextTileValue = parseInt(pictureArr[j].split('tile')[1], 10);
        if (nextTileValue !== 0 && tileValue > nextTileValue) {
          inversions++;
        }
      }
    }
  
    // Step 2: Determine parity and required parity
    const puzzleSize = width * width;
    const isOddWidth = width % 2 === 1;
    const requiredParity = isOddWidth ? 0 : (puzzleSize - blankRow) % 2;
  
    // Step 3: Check parity condition
    return inversions % 2 === requiredParity;
  };

  

// let pic = initPictureToArray(4);
// currentBoard = setNewBoard(4, pic);
// mixBoard(currentBoard);
// addEvent();

const setting = function(width){
    let pic = initPictureToArray(width);
    currentBoard = setNewBoard(width, pic);

} 

const init  = function(width){
    checkFirst = true;
    let pic = initPictureToArray(width);
    currentBoard = setNewBoard(width, pic);
    mixBoard(currentBoard);
} 

const reRollBoard = function(width){
  let pic = initPictureToArray(width);
  mixBoard([width, pic]);
  
}







