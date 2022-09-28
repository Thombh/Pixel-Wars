const colorsChoice = document.querySelector('#colorsChoice')
const game = document.querySelector('#game')
const cursor = document.querySelector('#cursor')
game.width = 1200
game.height = 600 
const gridCellSize = 10

const ctx = game.getContext('2d')
const gridCtx =game.getContext('2d')

const colorList = [
    "#FFEBEE", "#FCE4EC", "#F3E5F5", "#B39DDB", "#9FA8DA", "#90CAF9", "#81D4FA", "#80DEEA",
    "#4DB6AC", "#66BB6A", "#9CCC65", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", 
    "#A1887F", "#E0E0E0", "#90A4AE", "#000"
]
let currentColorChoice = colorList[9]

const firebaseConfig = {
    apiKey: "AIzaSyCNLE-CcQhlw71MRTD2nGRV34HLr6AC4A0",
    authDomain: "pixel-wars-9a12f.firebaseapp.com",
    projectId: "pixel-wars-9a12f",
    storageBucket: "pixel-wars-9a12f.appspot.com",
    messagingSenderId: "436388865110",
    appId: "1:436388865110:web:6760592a43ef57a5efc7f7"
  };
  firebase.initializeApp(firebaseConfig)
  const db = firebase.firestore()

colorList.forEach(color => {
    const colorItem = document.createElement('div')
    colorItem.style.backgroundColor = color
    colorsChoice.appendChild(colorItem)

    colorItem.addEventListener('click', () => {
        currentColorChoice =  color

        colorItem.innerHTML = '<i class="fa-solid fa-check"></i>'
   
   setTimeout (() => {
    colorItem.innerHTML = ""
   }, 1000)
    })
})

function createPixel(x, y, color){
    ctx.beginPath()
    ctx.fillStyle = color  
    ctx.fillRect(x, y, gridCellSize, gridCellSize)
}
function addPixelIntoGame(){
    const x = cursor.offsetLeft
    const y = cursor.offsetTop - game.offsetTop

    createPixel(x, y, currentColorChoice)

    const pixel = {
        x,
        y, 
        color: currentColorChoice
    }

    const pixelRef = db.collection('pixel').doc(`${pixel.x}-${pixel.y}`)
    pixelRef.set(pixel, {merge: true})

}

cursor.addEventListener('click', function(event) {
    addPixelIntoGame()
})
game.addEventListener('click', function(){
    addPixelIntoGame()
})

function drawGrids(ctx, width, heigth, cellWidth, cellHeigth){
    ctx.beginPath()
    ctx.strokeStyle = "#ccc"

    for (let i = 0; i < width; i++) {
        ctx.moveTo(i * cellWidth, 0)
        ctx.lineTo(i * cellWidth, heigth)
    }

    for (let i = 0; i < heigth; i++) {
        ctx.moveTo(0, i * cellHeigth, 0)
        ctx.lineTo(width, i * cellHeigth)
    } 
    ctx.stroke()
}
drawGrids(gridCtx, game.width, game.height, gridCellSize, gridCellSize)

game.addEventListener('mousemove', function(event){

   const cursorLeft = event.clientX  - (cursor.offsetWidth / 2) 
   const cursorTop = event.clientY - (cursor.offsetHeight / 2) 

   cursor.style.left = Math.floor(cursorLeft / gridCellSize ) * gridCellSize + "px"
   cursor.style.top = Math.floor(cursorTop / gridCellSize ) * gridCellSize + "px"

})

db.collection('pixel').onSnapshot(function(querySnapshot){
    querySnapshot.docChanges().forEach(function(change){
        const {x, y,color } = change.doc.data()

        createPixel(x, y, color)
    })
})
